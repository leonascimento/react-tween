react-tween
===
Tween animation for React components

The idea is to bring CSS transitions into the React world. The nice thing about CSS transitions is that they are declarative. If a value changes, the value is automatically animated to the new value. With `react-tween`, if you have a prop that you want to animate, you can take the component you want to animate, wrap it in a `Tween`, and you're done.

Usage
---

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