import Animations from './tween/Animations';
import PropTypes from './tween/PropTypes';
import TransitionGroup from './tween/TransitionGroup';
import Tween from './tween/Tween';

// v0.1
Tween.PropTypes = PropTypes;
Tween.Tween = Tween;
Tween.TransitionTween = TransitionGroup;

// v0.2
Tween.Animations = Animations;

// v0.3
Tween.TransitionGroup = TransitionGroup;
Tween.timing = Animations.timing;
Tween.delay = Animations.delay;
Tween.sequence = Animations.sequence;
Tween.parallel = Animations.parallel;
Tween.stagger = Animations.stagger;
Tween.identity = Animations.identity;

module.exports = Tween;
