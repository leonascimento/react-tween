import range from 'lodash/range';
import React from 'react';
import { scaleOrdinal, schemeCategory20 } from 'd3-scale';
import TransitionTween from './TransitionTween';
import Tween from './Tween';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = { counter: 0 };
  }

  render() {
    const { counter } = this.state;

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
        onClick={() => this.setState({ counter: counter + 1 })}
        style={{ userSelect: 'none' }}
        {...this.props}
      >
        <Tween
          style={{ color: (counter % 2 === 0) ? 'blue' : 'orange' }}
        >
          {style => (
            <div
              style={{ color: style.color }}
            >
              Hello, Tween!
            </div>
          )}
        </Tween>
        <TransitionTween
          sortKey={d => d.key}
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
        </TransitionTween>
      </div>
    );
  }
}
