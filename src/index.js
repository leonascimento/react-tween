import Animations from './tween/Animations';
import PropTypes from './tween/PropTypes';
import TransitionTween from './tween/CompatibleTransitionTween';
import Tween from './tween/CompatibleTween';

// v0.1
Tween.PropTypes = PropTypes;
Tween.Tween = Tween;
Tween.TransitionTween = TransitionTween;

// v0.2
Tween.Animations = Animations;

// v0.3
Tween.TransitionGroup = TransitionTween;
Tween.timing = Animations.timing;
Tween.delay = Animations.delay;
Tween.sequence = Animations.sequence;
Tween.parallel = Animations.parallel;
Tween.stagger = Animations.stagger;
Tween.identity = Animations.identity;

module.exports = Tween;
