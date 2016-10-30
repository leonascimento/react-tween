export default function mergeDiff(keys, nextKeys) {
  // Create a lookup table from key to index
  const extractIndexes = keys => (
    keys.reduce((result, k, i) => {
      result[k] = i;
      return result;
    }, {})
  );
  const indexes = extractIndexes(keys);
  const nextIndexes = extractIndexes(nextKeys);

  // Create the set of all keys
  const mergedKeys = [].concat(keys, nextKeys).reduce((result, k) => {
    result[k] = true;
    return result;
  }, {});

  // Sort the set of all keys
  // If k1 and k2 are in the same style array, use their relative order.
  // Otherwise, put the next style after the current style. (This is an arbitrary convention.)
  const mergedKeyArray = Object.keys(mergedKeys);
  mergedKeyArray.sort((k1, k2) => {
    if (nextIndexes.hasOwnProperty(k1) && nextIndexes.hasOwnProperty(k2)) {
      // k1 and k2 are both in next styles
      return nextIndexes[k1] - nextIndexes[k2];
    }

    if (indexes.hasOwnProperty(k1) && indexes.hasOwnProperty(k2)) {
      // k1 and k2 are both in current styles
      return indexes[k1] - indexes[k2];
    }

    // k1 and k2 are in different style arrays.
    if (indexes.hasOwnProperty(k1)) {
      // k1 is in current styles and k2 is in next styles
      return 1;
    } else {
      // k1 is in next styles and k2 is in current styles
      return -1;
    }
  });
  return mergedKeyArray;
}
