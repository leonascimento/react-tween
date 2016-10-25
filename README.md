react-tween
===
Tween animation for React components

Usage
---

Example: Animate opacity. The style contains the value to animate to.

```javascript
import { Tween } from 'react-tween';

<Tween style={{ opacity }}>
  {interpolatedStyle => (
    <div style={{ opacity: interpolatedStyle.opacity }}>
      {/* ... */}
    </div>
  )}
</Tween>
```

Example: Specify the animation duration.

```javascript
<Tween
  duration={400}
  style={{ opacity }}
>
  {/* ... */}
</Tween>
```

Example: Specify a delay. This is especially useful for sequencing animations.

```javascript
<Tween
  delay={500}
  style={{ opacity }}
>
  {/* ... */}
</Tween>
```

Example: Specify the easing.

```javascript
import { easeCubicInOut } from 'd3-ease';

<Tween
  easing={easeCubicInOut}
  style={{ opacity }}
>
  {/* ... */}
</Tween>
```

Example: Animate multiple properties.

```javascript
<Tween style={{ color, opacity }}>
  {/* ... */}
</Tween>
```

Example: Animate adding or removing segments from a stacked bar.

```javascript
import { TransitionTween } from 'react-tween';

<TransitionTween
  styles={[
    {
      key: bar.get('id'),
      style: {
        height: bar.get('value'),
      },
      data: bar,
    },
  ]}
  // When a segment is added, it starts with height 0.
  willEnter={() => ({ height: 0 })}
  // When a segment is removed, it animates down to height 0.
  willLeave={() => ({ height: 0 })}
>
  {interpolatedStyles => (
    <div className="bar">
      {/* interpolatedStyles includes segments that are in the process of being added and removed. */}
      {interpolatedStyles.map(interpolatedStyle => (
        <div
          className="segment"
          key={interpolatedStyle.key}
          style={{ height: interpolatedStyle.style.height }}
        />
      ))}
    </div>
  )}
</TransitionTween>
```
