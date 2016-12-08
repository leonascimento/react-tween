react-tween
===
Tween animation for React components

[Demo](http://codepen.io/mking-clari/pen/XNYbJX)

Tween
---

Let's say you have a bar chart. You want to animate the bar color from red to blue. What's the ideal API for this?

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

Now let's animate the color prop with `react-tween`. To do this, wrap the original component with a `Tween`.

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
    </Tween>
  );
}
```

When the color prop is set to blue, the rect color is animated from its previous color to blue.

If you want to customize easing, duration, or delay, you can pass additional options.

```javascript
import { easeCubicInOut } from 'd3-ease';

function BarChart({ color, ...props }) {
  return (
    <Tween
      easing={easeCubicInOut}
      delay={1000}
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

If you want to animate items added or removed from a collection, you can use `Tween.TransitionGroup`.

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
          key={style.key}
          style={{ opacity: style.style.opacity }}
        />
      ))}
    </Tween.TransitionGroup>
  );
}
```

In the above example, items fade in when added (animate from opacity 0) and fade out when removed (animate to opacity 0).

You can also set easing and duration on `Tween.TransitionGroup`.

```javascript
import { easeCubicInOut } from 'd3-ease';

function BarChart({ users, ...props }) {
  return (
    <Tween.TransitionGroup
      easing={easeCubicInOut}
      duration={500}
      styles={/* ... */}
      {...props}
    >
      {/* ... */}
    </Tween.TransitionGroup>
  );
}
```

Synchronizing Animations
---

Let's say you have animations in two separate parts of the component tree and you want to kick them off simultaneously. You can do this with the `group` prop. All animations with the same `group` prop start animating at the same time.

```javascript
function BarChart({ requestCounter, ...props }) {
  return (
    <Tween.TransitionGroup
      group={requestCounter}
      styles={/* ... */}
      {...props}
    >
      {/* ... */}
    </Tween.TransitionGroup>
  );
}

function LineChart({ requestCounter, ...props }) {
  return (
    <Tween.TransitionGroup
      group={requestCounter}
      styles={/* ... */}
      {...props}
    >
      {/* ... */}
    </Tween.TransitionGroup>
  );
}

function Chart({ requestCounter, ...props }) {
  return (
    <g {...props}>
      <BarChart requestCounter={requestCounter} />
      <LineChart requestCounter={requestCounter} />
    </g>
  );
}
```

Comparison to `react-motion`
---
Choose `react-tween` or `react-motion` based on whether you want tween or spring animation.
- If you need natural, physical motion, use spring animation.
- If you need to specify a duration, or you do not want a bounce, use tween animation.

Setup
---
```
yarn
yarn start
# Visit http://localhost:8080
```
