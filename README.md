react-tween
===
Tween animation for React components

Examples
---
- [Animate opacity and color with `<Tween />`](http://codepen.io/mking-clari/pen/JRqzLN)
- Animate avatars with `<TransitionTween />`

Usage
---
```javascript
import { TransitionTween, Tween } from 'react-tween';

// Tween is used to animate a single value.
// Tween is declarative: The style declares the destination value, and whenever the destination value changes, the style
// is animated from the current value to the destination value.
<Tween style={{ opacity: 1 }}>
  {style => (
    <div style={{ opacity: style.opacity }}>
      Animate opacity
    </div>
  )}
</Tween>

// TransitionTween is used to animate a list of items where items are being added and removed.
// It takes the place of TransitionGroup.
// When an item is added, optionally specify the initial style with the willEnter prop.
// By default, the initial style is the style given by the styles array.
// Similarly, when an item is removed, optionally specify the final style with the willLeave prop.
// The sortKey prop defines the order of the items in the list.
// The sortKey is a function of the data, which is an arbitrary value associated with the key.
<TransitionTween
  sortKey={d => d}
  styles={[
    {
      key: '0',
      style: { height: 100 },
      data: '0',
    },
    {
      key: '1',
      style: { height: 200 },
      data: '1',
    },
  ]}
  willEnter={() => ({ height: 0 })}
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
- The animation is implemented using d3's interpolation, easing, and timer. Any value d3 can interpolate, `react-tween`
  can interpolate.
