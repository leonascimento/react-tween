import clamp from 'lodash.clamp';
import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';

export class TimingAnimation {
  constructor({ toValue, duration = 400, easing = easeCubicInOut, delay = 0 }) {
    this.toValue = toValue;
    this.durationWithoutDelay = duration;
    this.easing = easing;
    this.delay = delay;
  }

  interpolateStyle(startStyle, elapsed) {
    // Clamp instead of allowing overshoot because some overshoots are invalid.
    // This is especially noticeable with parallel color animations that happen at different rates
    // (some colors go to white instead of the destination value).
    const t = clamp((elapsed - this.delay) / this.durationWithoutDelay, 0, 1);
    return interpolate(startStyle, this.toValue)(this.easing(t));
  }

  get duration() {
    return this.durationWithoutDelay + this.delay;
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

export class StaggerAnimation {
  constructor(stagger, animations) {
    this.stagger = stagger;
    this.animations = animations;
  }

  interpolateStyle(startStyle, elapsed) {
    return this.animations.reduce((result, animation, i) => ({
      ...result,
      ...animation.interpolateStyle(startStyle, elapsed - (this.stagger * i)),
    }), {});
  }

  get duration() {
    return Math.max(...this.animations.map((animation, i) => (
      animation.duration + (this.stagger * i)
    )));
  }

  get endStyle() {
    return this.animations.reduce((result, animation) => ({
      ...result,
      ...animation.endStyle,
    }), {});
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

export default {
  timing: options => new TimingAnimation(options),
  sequence: animations => new SequenceAnimation(animations),
  parallel: animations => new StaggerAnimation(0, animations),
  stagger: (stagger, animations) => new StaggerAnimation(stagger, animations),
  identity: options => new IdentityAnimation(options),
};
