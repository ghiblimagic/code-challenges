/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function (strs) {
  //parameter: array of strings
  // return: array with a subarray of strings
  // ex Input: strs = ["eat","tea","tan","ate","nat","bat"]
  // Output: [["bat"],["nat","tan"],["ate","eat","tea"]]

  // for fastest lookup, we'll use a map to store the found words, with the value being the index they were STORED at in the new array
  // to make sure its stored

  //edgecase: we don't have to do .toLowerCase() as they're all english words

  const answer = [];
  const lookup = new Map();

  function sharedAnagramPattern(word) {
    const anagram = word.split("").sort().join("");
    // aet is the shared pattern for ate, eat, tea
    return anagram;
  }

  function lookupAnagram(word) {
    const anagram = sharedAnagramPattern(word);

    if (lookup.has(anagram)) {
      const anagramIndex = lookup.get(anagram);
      // join the word into the anagram subarray
      answer[anagramIndex].push(word);
    } else {
      const emptyAnswerSlot = answer.length;
      // add to the lookup
      lookup.set(anagram, emptyAnswerSlot);
      // add to answer array as subarray
      answer.push([word]);
    }
  }

  for (let i = 0; i < strs.length; i++) {
    // iterate through the original array
    const word = strs[i];
    lookupAnagram(word);
  } // end of for loop

  return answer;
};
