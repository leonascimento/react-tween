// Merge newKeys and oldKeys based on shared pivot keys
// By convention, oldKeys precede newKeys
//
// Example
// oldKeys    [1] 2 [3 4]   6 [8]
// newKeys        2       5 6     7
// mergedKeys  1  2  3 4  5 6  8  7
export default function mergeDiff(oldStyles, newStyles) {
  const prefixSlice = [];
  let slice = prefixSlice;
  const slices = Object.keys(oldStyles).reduce((result, k) => {
    if (Object.prototype.hasOwnProperty.call(newStyles, k)) {
      slice = [];
      result[k] = slice; // eslint-disable-line no-param-reassign
    } else {
      slice.push(k);
    }
    return result;
  }, {});

  return Object.keys(newStyles).reduce((result, k) => {
    result.push(k);
    if (Object.prototype.hasOwnProperty.call(slices, k)) {
      result = result.concat(slices[k]); // eslint-disable-line no-param-reassign
    }
    return result;
  }, prefixSlice.slice());
}
