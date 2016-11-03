### 0.3.0

Reduce exported API to a single name, `Tween`.

```javascript
<Tween
  animation={Tween.sequence([
    Tween.timing({
      toValue: { color: 'red' },
    }),
    Tween.timing({
      toValue: { color: 'green' },
    }),
  ])}
>
  {style => /* ... */}
</Tween>

<Tween.TransitionGroup
  animations={[
    {
      key: '0',
      animation: Tween.timing({ toValue: { opacity: 1 } }),
      data: '0',
    },
    ...
  ]}
  willEnter={style => ({ ...style, color: 'transparent' })}
  willLeave={style => Tween.timing({ toValue: { ...style, color: 'transparent' } })}
>
  {styles => /* ... */}
</Tween.TransitionGroup>
```

### 0.2.0

Add support for sequential and parallel animations.

```javascript
<Tween
  animation={Animations.sequence([
    Animations.timing({
      toValue: { color: 'red' },
    }),
    Animations.timing({
      toValue: { color: 'green' },
    }),
  ])}
>
  {style => /* ... */}
</Tween>

<TransitionTween
  animations={[
    {
      key: '0',
      animation: Animations.timing({ toValue: { opacity: 1 } }),
      data: '0',
    },
    ...
  ]}
  willEnter={style => ({ ...style, color: 'transparent' })}
  willLeave={style => Animations.timing({ toValue: { ...style, color: 'transparent' } })}
>
  {styles => /* ... */}
</TransitionTween>
```

### 0.1.0

Add `Tween` and `TransitionTween`, tween equivalents of `Motion` and `TransitionMotion` from `react-motion`.

```javascript
<Tween
  delay={0}
  duration={500}
  easing={easeCubicInOut}
  style={{ opacity: 1 }}
>
  {style => /* ... */}
</Tween>

<TransitionTween
  styles={[
    {
      key: '0',
      style: { opacity: 1 },
      data: '0',
    },
    ...
  ]}
  willEnter={() => ({ opacity: 0 })}
  willLeave={() => ({ opacity: 0 })}
>
  {styles => /* ... */}
</TransitionTween>
```