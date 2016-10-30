react-tween
===
Tween animation for React components

Demos
---
- [Animate opacity and color with `<Tween />`](http://codepen.io/mking-clari/pen/JRqzLN)
- [Animate bars with `<TransitionTween />`](http://codepen.io/mking-clari/pen/yadomz)

Usage
---
- `<Tween />` is used to animate a single value over time.
- `<TransitionTween />` is used to animate a list of items where items are being added and removed.

```javascript
import { TransitionTween, Tween } from 'react-tween';

// Tween is declarative.
// The style defines the destination value.
// Whenever the destination value changes, the style is animated to that destination value.
<Tween style={{ opacity: 1 }}>
  {style => (
    <div style={{ opacity: style.opacity }}>
      Animate opacity
    </div>
  )}
</Tween>

// TransitionTween takes the place of TransitionGroup.
<TransitionTween
  // The sortKey prop defines the order of the items in the list. It is a function of the item data.
  sortKey={d => d}
  styles={[
    {
      // The key is the child component key.
      key: '0',
      // The style is the set of values being animated.
      style: { height: 100 },
      // The data is an arbitrary value associated with the key.
      data: '0',
    },
    {
      key: '1',
      style: { height: 200 },
      data: '1',
    },
  ]}
  // The willEnter prop defines the initial style when an item is added.
  // By default, the initial style is the one given by the styles array.
  willEnter={() => ({ height: 0 })}
  // The willLeave prop defines the final style when an item is removed.
  // By default, the final style is whatever the item's style is at the time it is removed.
  willLeave={() => ({ height: 0 })}
>
  {styles => (
    <div className="bars">
      {styles.map(style => (
        <div
          className="bar"
          key={style.key}
          style={{ height: style.style.height }}
        />
      ))}
    </div>
  )}
</TransitionTween>

// Both Tween and TransitionTween support customized delay, duration, and easing.
import { easeSinInOut } from 'd3-ease';

<Tween
  delay={500}
  duration={1000}
  easing={easeSinInOut}
  style={{ opacity: 1 }}
>
  {/* ... */}
</Tween>
```

Implementation
---
- The API is based off of [react-motion](https://github.com/chenglou/react-motion).
- The animation is implemented using d3's interpolation, easing, and timer. Any value d3 can interpolate, `react-tween` can interpolate.

Comparison to `react-motion`
---
Why not spring-based animation? I think spring-based animation is, in many cases, ideal. But sometimes it's not possible to use it. For example, the designer may specify a traditional easing-based animation, or the product may require the duration to be limited, rather than open-ended. In this case, it's better to use an easing-based animation rather than a spring-based one. `react-tween` is simply another tool in the frontend developer's toolbox.