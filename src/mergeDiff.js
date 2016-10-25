import Immutable from 'immutable';

export default function mergeDiff(s1, s2) {
  const s2Keys = s2.toSet();

  // Group s1Keys into knownOrder and unknownOrder segments
  let segments = Immutable.List();
  for (let i = 0; i < s1.size; i++) {
    const orderKnownForKey = s2Keys.has(s1.get(i));
    if (segments.isEmpty() || orderKnownForKey !== segments.getIn([segments.size - 1, 'knownOrder'])) {
      segments = segments.push(Immutable.Map({
        knownOrder: orderKnownForKey,
        keys: Immutable.List([s1.get(i)]),
      }));
    } else {
      segments = segments.updateIn([segments.size - 1, 'keys'], keys => keys.push(s1.get(i)));
    }
  }

  // Insert an unknownOrder segment based on the position of the previous segment.
  // If there is no previous segment, insert the unknownOrder segment at the beginning of the merged key list.
  let result = s2;
  for (let i = 0; i < segments.size; i++) {
    const segment = segments.get(i);

    if (!segment.get('knownOrder')) {
      if (i === 0) {
        result = segment.get('keys').concat(result);
      } else {
        const prevSegment = segments.get(i - 1);
        const prevSegmentKey = prevSegment.get('keys')
          .sortBy(k => result.indexOf(k))
          .last();
        const prevSegmentKeyIndex = result.indexOf(prevSegmentKey);
        result = result.slice(0, prevSegmentKeyIndex + 1)
          .concat(segment.get('keys'))
          .concat(result.slice(prevSegmentKeyIndex + 1));
      }
    }
  }
  return result;
}
