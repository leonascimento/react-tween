react-tween
===
Tween animation for React components

Let's say you have a bar chart where each bar is an SVG `rect`. We want to animate the `rect` `fill` from red to blue. What's the ideal API for this?

Here's the unanimated component.

```javascript
function BarChart({ color, ...props }) {
  return (
    <rect
      fill={color}
      height={100}
      width={30}
      {...props}
    />
  );
}
```

Now let's animate it with `react-tween`. To do this, wrap the original component with a `Tween` that identifies which prop is animated.

```javascript
function BarChart({ color, ...props }) {
  return (
    <Tween
      style={{ color }}
    >
      {style => (
        <rect
          fill={style.color}
          height={100}
          width={30}
          {...props}
        />
      )}
  );
}
```

When the color prop is set to blue, the inner rect's color is animated from its previous color to blue.

API
---
```javascript
import { easeCubicInOut } from 'd3-ease';
import Tween from 'react-tween';

function BarChart({ color, ...props }) {
  return (
    <Tween
      easing={easeCubicInOut}
      duration={500}
      style={{ color }}
    >
      {style => (
        <rect
          fill={style.color}
        />
      )}
    </Tween>
  );
}
```

Comparison to `react-motion`
---
I think the API of `react-motion` is ideal, which is why this library is modelled after it. However, I don't think spring animation covers all cases. For example, the designer may require a specific duration, or may want to disallow bouncing. In this case, tween animation can be used.

Setup
---
```
yarn
yarn start
# Visit http://localhost:8080
```