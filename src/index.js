import Animations from './tween/Animations';
import PropTypes from './tween/PropTypes';
import TransitionTween from './tween/CompatibleTransitionTween';
import Tween from './tween/CompatibleTween';

Tween.TransitionGroup = TransitionTween;
Tween.timing = Animations.timing;
Tween.delay = Animations.delay;
Tween.sequence = Animations.sequence;
Tween.parallel = Animations.parallel;
Tween.stagger = Animations.stagger;
Tween.identity = Animations.identity;

export {
  // v0.1
  PropTypes,
  Tween,
  TransitionTween,
  // v0.2
  Animations,
  // v0.3
  Tween as default,
};
