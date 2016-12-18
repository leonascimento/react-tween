react-tween
===
Tween animation for React components

[Demo](http://codepen.io/mking-clari/pen/XNYbJX)

Usage
---
Animate props with `Tween`.

```javascript
function Example({ color, ...props }) {
  return (
    <Tween
      style={{ color }}
    >
      {style => (
        <div
          style={{ backgroundColor: style.color }}
        />
      )}
    </Tween>
  );
}
```

Customize easing, duration, and delay.

```javascript
import { easeCubicInOut } from 'd3-ease';

function Example({ color, ...props }) {
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

Animate added or removed items with `Tween.TransitionGroup`.
- In this example, the collection is a list of meetings.
- When a meeting is added, it fades in (`willEnter`).
- When a meeting is removed, it fades out (`willLeave`).

```javascript
function Example({ meetings, ...props }) {
  return (
    <Tween.TransitionGroup
      styles={meetings.map(meeting => ({
        key: meeting.id,
        style: {
          opacity: 1,
        },
        data: meeting,
      }))}
      willEnter={style => ({ ...style.style, opacity: 0 })}
      willLeave={style => ({ ...style.style, opacity: 0 })}
    >
      {styles => (
        <div>
          {styles.map(style => (
            <div
              key={style.key}
              style={{ opacity: style.style.opacity }}
            >
              {style.data.title}
            </div>
          ))}
        </div>
      )}
    </Tween.TransitionGroup>
  );
}
```

For `Tween.TransitionGroup`, each style is a `TransitionStyle`, which has the following format.

```javascript
{
  key, // item id
  style: { ... }, // plain style object (same format as style for `Tween`)
  data, // item data
}
```

`willEnter` and `willLeave` are passed `TransitionStyle`s and should return plain style objects.

Synchronizing animations
---
By default, `Tween`s animate whenever their styles change. If you want control over when animation begins, set the `group` prop. If the `group` prop is set, animation only begins when the value of this prop changes.

```javascript
function Example({ color1, color2, invalidationCounter, ...props }) {
  return (
    <div {...props}>
      <Tween
        group={invalidationCounter}
        style={{ color: color1 }}
      >
        {/* ... */}
      </Tween>
      <Tween
        group={invalidationCounter}
        style={{ color: color2 }}
      >
        {/* ... */}
      </Tween>
    </div>
  );
}
```

Comparison to `react-motion`
---
Choose `react-tween` or `react-motion` based on whether you want tween or spring animation.
- If you want natural, physical motion, use spring animation.
- If you want to specify a duration, or you do not want a bounce, use tween animation.

Setup
---
```
yarn
yarn start
# Visit http://localhost:8080
```
