export default function mergeDiff(keys, nextKeys) {
  const nextOrder = nextKeys.reduce((result, k, i) => {
    result[k] = i; // eslint-disable-line no-param-reassign
    return result;
  }, {});

  const prefix = [];
  let currentSegment = prefix;
  const segments = {};
  for (let i = 0; i < keys.length; i += 1) {
    if (Object.prototype.hasOwnProperty.call(nextOrder, keys[i])) {
      segments[keys[i]] = [];
      currentSegment = segments[keys[i]];
    } else {
      currentSegment.push(keys[i]);
    }
  }

  let mergedKeys = prefix.slice();
  for (let i = 0; i < nextKeys.length; i += 1) {
    mergedKeys.push(nextKeys[i]);
    if (Object.prototype.hasOwnProperty.call(segments, nextKeys[i])) {
      mergedKeys = mergedKeys.concat(segments[nextKeys[i]]);
    }
  }
  return mergedKeys;
}
