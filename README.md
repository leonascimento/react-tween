react-tween
===
Usage
---
Example: Animate opacity from the previous value to a new value.

```javascript
<Tween style={{ opacity }}>
  {interpolatedStyle => (
    <div style={{ opacity: interpolatedStyle.opacity }}>
      {/* ... */}
    </div>
  )}
</Tween>
```

Example: Animate multiple properties with a specific duration.

```javascript
<Tween
  duration={1000}
  style={{ color, opacity }}
>
  {/* ... */}
</Tween>
````
