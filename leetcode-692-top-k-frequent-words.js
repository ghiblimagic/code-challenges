/**
 * @param {string[]} words
 * @param {number} k
 * @return {string[]}
 */
var topKFrequent = function (words, k) {
  //parameters: array of strings, a single integer (k)
  // return: an array of strings of k length, starting from most frequent to least
  // for those in the same frequency, they should be sorted in lexicographic order
  // example: Example 1:
  // Input: words = ["i","love","leetcode","i","love","coding"], k = 2
  // Output: ["i","love"]
  // Explanation: "i" and "love" are the two most frequent words.
  // Note that "i" comes before "love" due to a lower alphabetical order.

  // psuedocode

  // frequency paired with words

  // reduce would work, but its an entire map operation, so not efficient
  let wordToFrequencyLookup = new Map();

  for (let word of words) {
    // if it doesn't exist yet
    if (!wordToFrequencyLookup.has(word)) {
      // set its count to 1
      wordToFrequencyLookup.set(word, 1);
    } else {
      let currentCount = wordToFrequencyLookup.get(word);

      wordToFrequencyLookup.set(word, (currentCount += 1));
    }
  } // end of for loop

  return (
    [...wordToFrequencyLookup.keys()]
      // grab the keys (string) and put into an array
      .sort((a, b) => {
        // sort based on frequency, largest to smallest
        const freqA = wordToFrequencyLookup.get(a);
        const freqB = wordToFrequencyLookup.get(b);

        if (freqA !== freqB) {
          return freqB - freqA;
          // if they don't have the same frequency, return the higher one
        } else {
          // if they're tied, then sort them by lexical
          return a.localeCompare(b); // alpha order on ties
          // or alternatively return a > b ? 1 : -1;  instead of localeCompare

          // The tricky thing is that .sort() on its own works on arrays — you can't directly use it to compare two individual strings in a comparator. What you can do is use the same comparison operators that the default string sort uses under the hood:
        }
      })
      .slice(0, k)
  );
};
