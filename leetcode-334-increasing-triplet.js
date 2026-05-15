/**
 * @param {number[]} nums
 * @return {boolean}
 */
function increasingTriplet(nums) {
  // Track the smallest value seen so far
  let first = Infinity;

  // Track the second smallest value seen so far (must come after `first`)
  let second = Infinity;

  for (const n of nums) {
    if (n <= first) {
      // `n` is the new smallest number we've seen — reset `first`
      first = n;
    } else if (n <= second) {
      // `n` is bigger than `first` but smaller than `second`
      // so it becomes the new second smallest
      second = n;
      // we can't just use the old second as the end for the triplet, because it came earlier in the array than the new value.
    } else {
      // `n` is bigger than both `first` and `second`
      // meaning we found 3 increasing numbers → return true immediately
      return true;
    }
  }

  // We finished the loop without ever finding a valid triplet
  return false;
}
