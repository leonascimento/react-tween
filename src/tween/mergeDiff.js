export default function mergeDiff(keys, nextKeys) {
  const order = {};
  for (let i = 0; i < keys.length; i++) {
    order[keys[i]] = i;
  }

  const nextOrder = {};
  for (let i = 0; i < nextKeys.length; i++) {
    nextOrder[nextKeys[i]] = i;
  }

  let prefix = [];
  let currentSegment = prefix;
  const segments = {};
  for (let i = 0; i < keys.length; i++) {
    if (nextOrder.hasOwnProperty(keys[i])) {
      segments[keys[i]] = [];
      currentSegment = segments[keys[i]];
    } else {
      currentSegment.push(keys[i]);
    }
  }

  let mergedKeys = prefix.slice();
  for (let i = 0; i < nextKeys.length; i++) {
    mergedKeys.push(nextKeys[i]);
    if (segments.hasOwnProperty(nextKeys[i])) {
      mergedKeys = mergedKeys.concat(segments[nextKeys[i]]);
    }
  }
  return mergedKeys;
}
