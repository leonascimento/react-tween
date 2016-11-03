import clamp from 'lodash.clamp';
import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import warning from 'warning';

export class TimingAnimation {
  constructor({ toValue, duration = 500, easing = easeCubicInOut }) {
    this.toValue = toValue;
    this.duration = duration;
    this.easing = easing;
  }

  interpolateStyle(startStyle, elapsed) {
    // Clamp instead of allowing overshoot because some overshoots are invalid.
    // This is especially noticeable with parallel color animations that happen at different rates
    // (some colors go to white instead of the destination value).
    const t = clamp(elapsed / this.duration, 0, 1);

    return interpolate(startStyle, this.toValue)(this.easing(t));
  }

  get endStyle() {
    return this.toValue;
  }
}

export class DelayAnimation {
  constructor(delay, animation) {
    this.delay = delay;
    this.animation = animation;
  }

  interpolateStyle(startStyle, elapsed) {
    return this.animation.interpolateStyle(startStyle, elapsed - this.delay);
  }

  get duration() {
    return this.delay + this.animation.duration;
  }

  get endStyle() {
    return this.animation.endStyle;
  }
}

export class SequenceAnimation {
  constructor(animations) {
    this.animations = animations;
  }

  interpolateStyle(startStyle, elapsed) {
    let offset = 0;
    let style = startStyle;
    for (let i = 0; i < this.animations.length; i += 1) {
      const animation = this.animations[i];

      if (elapsed - offset < animation.duration) {
        return { ...style, ...animation.interpolateStyle(style, elapsed - offset) };
      }

      style = { ...style, ...animation.endStyle };
      offset += animation.duration;
    }
    return style;
  }

  get duration() {
    return this.animations.reduce((result, animation) => result + animation.duration, 0);
  }

  get endStyle() {
    return this.animations.reduce((result, animation) => ({
      ...result,
      ...animation.endStyle,
    }), {});
  }
}

export class ParallelAnimation {
  constructor(animations) {
    this.animations = animations;
  }

  interpolateStyle(startStyle, elapsed) {
    return this.animations.reduce((result, animation) => ({
      ...result,
      ...animation.interpolateStyle(startStyle, elapsed),
    }), {});
  }

  get duration() {
    return Math.max(...this.animations.map(animation => animation.duration));
  }

  get endStyle() {
    return this.animations.reduce((result, animation) => ({
      ...result,
      ...animation.endStyle,
    }), {});
  }
}

export class StaggerAnimation {
  constructor(delay, animations) {
    this.animation = new ParallelAnimation(animations.map((animation, i) => (
      new DelayAnimation(delay * i, animation)
    )));
  }

  interpolateStyle(startStyle, elapsed) {
    return this.animation.interpolateStyle(startStyle, elapsed);
  }

  get duration() {
    return this.animation.duration;
  }

  get endStyle() {
    return this.animation.endStyle;
  }
}

export class IdentityAnimation {
  constructor({ toValue }) {
    this.toValue = toValue;
  }

  interpolateStyle() {
    return this.toValue;
  }

  get duration() { // eslint-disable-line class-methods-use-this
    return 0;
  }

  get endStyle() {
    return this.toValue;
  }
}

export default class Animations {
  static timing({ delay, ...options }) {
    if (delay) {
      warning(false, 'Use Tween.delay instead of Tween.timing({ delay })');

      return new DelayAnimation(delay, new TimingAnimation(options));
    }

    return new TimingAnimation(options);
  }

  static delay(...args) {
    return new DelayAnimation(...args);
  }

  static sequence(...args) {
    return new SequenceAnimation(...args);
  }

  static parallel(...args) {
    return new ParallelAnimation(...args);
  }

  static stagger(...args) {
    return new StaggerAnimation(...args);
  }

  static identity(...args) {
    return new IdentityAnimation(...args);
  }
}
