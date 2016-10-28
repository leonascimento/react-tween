import range from 'lodash.range';
import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import TransitionTween from './TransitionTween';
import Tween from './Tween';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      delay: false,
      long: false,
      stagger: false,
      tweenType: 'tween',
    };
  }

  render() {
    const { counter, long, tweenType } = this.state;

    const delay = this.state.delay ? 1000 : 0;
    const duration = long ? 1000 : 400;
    const stagger = this.state.stagger ? 200 : 0;

    const data = range(5).map(i => ({ key: i.toString(), value: i }));
    const filteredData = data.filter(d => ((counter % 2 === 0) ? true : (d.value % 2 === 1)));

    const colorScale = scaleOrdinal()
      .domain(data.map(d => d.key))
      .range(schemeCategory20);

    const styles = filteredData
      .map(d => ({
        key: d.key,
        style: {
          color: 'gray',
          height: 20,
        },
        data: d,
      }));

    return (
      <div
        style={{ userSelect: 'none' }}
        {...this.props}
      >
        <div>
          <button
            onClick={() => this.setState({ counter: counter + 1 })}
            type="button"
          >
            Next
          </button>
        </div>
        <div>
          <div>
            <label>
              <input
                checked={tweenType === 'tween'}
                onChange={e => this.setState({ tweenType: e.currentTarget.value })}
                type="radio"
                value="tween"
              />
              Tween
            </label>
          </div>
          <div>
            <label>
              <input
                checked={tweenType === 'transition-tween'}
                onChange={e => this.setState({ tweenType: e.currentTarget.value })}
                type="radio"
                value="transition-tween"
              />
              Transition Tween
            </label>
          </div>
        </div>
        <div>
          <label>
            <input
              checked={this.state.delay}
              onChange={() => this.setState({ delay: !this.state.delay })}
              type="checkbox"
            />
            Delayed
          </label>
        </div>
        <div>
          <label>
            <input
              checked={this.state.stagger}
              onChange={() => this.setState({ stagger: !this.state.stagger })}
              type="checkbox"
            />
            Staggered
          </label>
        </div>
        <div>
          <label>
            <input
              checked={long}
              onChange={() => this.setState({ long: !long })}
              type="checkbox"
            />
            Long
          </label>
        </div>
        {tweenType === 'tween' && <Tween
          delay={delay}
          duration={duration}
          style={{ color: (counter % 2 === 0) ? 'blue' : 'orange' }}
        >
          {style => (
            <div
              style={{ color: style.color }}
            >
              Hello, Tween!
            </div>
          )}
        </Tween>}
        {tweenType === 'transition-tween' && <TransitionTween
          delay={delay}
          duration={duration}
          sortKey={d => d.key}
          stagger={stagger}
          styles={styles}
          willEnter={() => ({ color: 'blue', height: 0 })}
          willLeave={() => ({ color: 'orange', height: 0 })}
        >
          {styles => (
            <div>
              <div
                style={{ height: 150 }}
              >
                {styles.map(style => (
                  <div
                    key={style.key}
                    style={{ color: style.style.color }}
                  >
                    {style.key}
                  </div>
                ))}
              </div>
              <div>
                {styles.map(style => (
                  <div
                    key={style.key}
                    style={{
                      backgroundColor: colorScale(style.key),
                      height: style.style.height,
                      width: 20,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </TransitionTween>}
      </div>
    );
  }
}
