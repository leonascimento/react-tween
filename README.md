react-tween
===
Tween animation for React components

Tween
---

Let's say you have a bar chart where each bar is an SVG `rect`. We want to animate the `rect` color from red to blue. What's the ideal API for this?

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

When the color prop is set to blue, the rect color is animated from its previous color to blue.

If you want to customize the easing or duration, you can do this.

```javascript
import { easeCubicInOut } from 'd3-ease';

function Bar({ color, ...props }) {
  return (
    <Tween
      easing={easeCubicInOut}
      duration={500}
      style={{ color }}
    >
      {/* ... */}
    </Tween>
  );
}
```

TransitionGroup
---

If you have a collection of items and you want to apply styles to items that are added or removed, you can use `Tween.TransitionGroup` instead of `Tween`.

`Tween.TransitionGroup` accepts a list of styles instead of a single style. Each style has a key that is used to determine if a child has been added or removed (similar to React child keys).

```javascript
function BarChart({ users, ...props }) {
  return (
    <Tween.TransitionGroup
      styles={users.map(user => ({
        key: user.id,
        style: {
          opacity: 1,
        },
        data: user,
      }))}
      willEnter={style => ({ ...style, opacity: 0 })}
      willLeave={style => ({ ...style, opacity: 0 })}
    >
      {styles => styles.map(style => (
        <rect
          fill={style.style.color}
          key={style.key}
        />
      ))}
    </Tween.TransitionGroup>
  );
}
```

You can also set easing and duration on `Tween.TransitionGroup`.

```javascript
import { easeCubicInOut } from 'd3-ease';

function BarChart({ users, ...props }) {
  return (
    <Tween.TransitionGroup
      easing={easeCubicInOut}
      duration={500}
      {...props}
    >
      {/* ... */}
    </Tween.TransitionGroup>
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