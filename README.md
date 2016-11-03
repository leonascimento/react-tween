react-tween
===
Tween animation for React components

Demos
---
- [Animate opacity and color with `<Tween />`](http://codepen.io/mking-clari/pen/JRqzLN)
- [Animate bars with `<Tween.TransitionGroup />`](http://codepen.io/mking-clari/pen/yadomz)

Usage
---
- `<Tween />` is used to animate a single value over time.
- `<Tween.TransitionGroup />` is used to animate a list of items where items are being added and removed.

```javascript
import Tween from 'react-tween';

// Tween is declarative.
// toValue defines the destination style.
// Whenever the destination style changes, the inner component is animated to that
// destination style.
<Tween animation={Tween.timing({ toValue: { opacity: 1 } })}>
  {style => (
    <div style={{ opacity: style.opacity }}>
      Animate opacity
    </div>
  )}
</Tween>

// Tween.TransitionGroup takes the place of ReactTransitionGroup.
<Tween.TransitionGroup
  animations={[
    {
      // The key is the child component key.
      key: '0',
      // toValue defines the destination style for this item.
      animation: Tween.timing({ toValue: { height: 100 } }),
      // The data is an arbitrary value associated with the key.
      data: '0',
    },
    {
      key: '1',
      animation: Tween.timing({ toValue: { height: 200 } }),
      data: '1',
    },
  ]}
  // The willEnter prop defines the initial style of an item when it is first added.
  willEnter={style => ({ ...style, height: 0 })}
  // The willLeave prop defines the animation of an item when it is removed.
  willLeave={style => Tween.timing({ toValue: { ...style, height: 0 } })}
>
  {interpolatedStyles => (
    <div className="bars">
      {interpolatedStyles.map(style => (
        <div
          className="bar"
          key={style.key}
          style={{ height: style.style.height }}
        />
      ))}
    </div>
  )}
</Tween.TransitionGroup>

// Both Tween and Tween.TransitionGroup support customized duration and
// easing.
import { easeSinInOut } from 'd3-ease';

<Tween
  animation={Tween.timing({
    toValue: { opacity: 1 },
    duration: 1000,
    easing: easeSinInOut,
  })}
>
  {/* ... */}
</Tween>

// Run animations in sequence with Tween.sequence
<Tween
  animation={Tween.sequence([
    // The color will first animate to green, then to red.
    Tween.timing({ toValue: { color: 'green' } }),
    Tween.timing({ toValue: { color: 'red' } }),
  ])}
>
  {/* ... */}
</Tween>

// Run animations in parallel with Tween.parallel
<Tween
  animation={Tween.parallel([
    Tween.timing({ toValue: { color: 'orange' } }),
    Tween.timing({ toValue: { opacity: 1 } }),
  ])}
>
  {/* ... */}
</Tween>

// Delay animations with Tween.delay
<Tween
  animation={Tween.delay(500, Tween.timing({ toValue: { opacity: 1 } }))}
>
  {/* ... */}
</Tween>

// Stagger animations with Tween.stagger
<Tween
  animation={Tween.stagger(500, [
    // First, the color will animate to orange.
    // When the color is halfway to orange, the opacity will begin animating
    // to 1.
    Tween.timing({
      toValue: { color: 'orange' },
      duration: 1000,
    }),
    Tween.timing({
      toValue: { opacity: 1 },
      duration: 1000,
    }),
  ])}
>
  {/* ... */}
</Tween>
```

Implementation
---
- The structure of the `<Tween />` and `<Tween.TransitionGroup />` components is based on [react-motion](https://github.com/chenglou/react-motion).
- The animation API is based on [React Native's animation API](https://facebook.github.io/react-native/docs/animations.html).
- The animation is implemented using [d3's interpolation, easing, and timer](https://d3js.org). Any value d3 can interpolate, `react-tween` can interpolate.

Comparison to `react-motion`
---
Why not spring-based animation? I think spring-based animation is, in many cases, ideal. But sometimes it's not possible to use it. For example, the designer may specify a traditional easing-based animation, or the feature may require a controlled duration. In this case, it's better to use an easing-based animation rather than a spring-based one. `react-tween` is simply another tool in the frontend developer's toolbox.
