import clamp from 'lodash.clamp';
import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';

export class TimingAnimation {
  constructor({ toValue, duration = 400, easing = easeCubicInOut, delay = 0 }) {
    this.toValue = toValue;
    this.duration = duration;
    this.easing = easing;
    this.delay = delay;
  }

  interpolateStyle(startStyle, elapsed) {
    // Clamp instead of allowing overshoot because some overshoots are invalid.
    // This is especially noticeable with parallel color animations that happen at different rates (some colors go to white instead of the destination value).
    const t = clamp(elapsed / this.duration, 0, 1);
    return interpolate(startStyle, this.toValue)(this.easing(t));
  }

  get endStyle() {
    return this.toValue;
  }
}

export class SequenceAnimation {
  constructor(animations) {
    this.animations = animations;
  }

  interpolateStyle(startStyle, elapsed) {
    let offset = 0;
    let style = startStyle;
    for (let i = 0; i < this.animations.length; i++) {
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
    return this.animations.reduce((result, animation) => ({ ...result, ...animation.endStyle }), {});
  }
}

export class ParallelAnimation {
  constructor(animations) {
    this.animations = animations;
  }

  interpolateStyle(startStyle, elapsed) {
    return this.animations.reduce((result, animation) => ({ ...result, ...animation.interpolateStyle(startStyle, elapsed) }), {});
  }

  get duration() {
    return Math.max(...this.animations.map(animation => animation.duration));
  }

  get endStyle() {
    return this.animations.reduce((result, animation) => ({ ...result, ...animation.endStyle }), {});
  }
}

export class IdentityAnimation {
  constructor({ toValue }) {
    this.toValue = toValue;
  }

  interpolateStyle(startStyle, elapsed) {
    return this.toValue;
  }

  get duration() {
    return 0;
  }

  get endStyle() {
    return this.toValue;
  }
}

export default class Animations {
  static timing = options => new TimingAnimation(options);
  static sequence = animations => new SequenceAnimation(animations);
  static parallel = animations => new ParallelAnimation(animations);
  static identity = options => new IdentityAnimation(options);
}
