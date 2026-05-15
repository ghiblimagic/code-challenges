/**
 * @param {string[]} arr
 * @return {string[]}
 */
function shortestSubstrings(arr) {
  const length = arr.length;
  const answer = new Array(length).fill("");
  // the answer array is equal to the original length
  // since we're looking for the one SHORTEST unique substring for EACH WORD that comes earliest in the alphabet

  for (let i = 0; i < length; i++) {
    // loop through the array aka each word

    // we're going to find the shortest substring (for this specific word) that doesn't exist in any other words,
    //then push it to the answer array at the very end
    const word = arr[i];
    let found = false;
    // re-declared here, so it resets for every word
    // found only gets changed to true after we check a specific substring against all the words
    // so theres no risk of us leaving the loop early before a potential answer substring would be found
    // it will only return true when we find the shortest substring for that word,
    // that doesn't exist in any other words

    // create the substrings, from shorter substrings to longer substrings
    // 1. outer for loop = length of substring starting as single letters (1)
    // 2a. inner loop = building candidate substrings to test
    // sliding window through the word,
    // with the ending index based on the length deterimed in the outer loop
    // so if outer loop = 3 length
    // inner loop will do .slice(0,3) ==> 3 letter substring "abc"
    // 2b. inner loop, test those substrings against all the words, see if any are unique, if so leave the loop early
    for (let subLength = 1; subLength <= word.length && !found; subLength++) {
      // start at the shortest substring 1, and loop higher as needed
      // the max size the substring could be is the entire word, word.length

      const candidates = [];
      // temporary array to store the substrings

      // j = word.length 5 - sublength 1 = 4
      for (let j = 0; j <= word.length - subLength; j++) {
        // builds candidate substrings for that string length

        // 0, 0+1 ==> .slice(0,1)
        // 1, 1+1 ==> .slice(1,2)
        // 2, 2+1 ==> .slice(2,3)

        //  subLength will only increase if no unique substring was found at the current length
        // 0, 0+2 ==> .slice(0,2)
        // 1, 1+2 ==> .slice(1,3)
        // 2, 2+2 ==> .slice(2,4)
        candidates.push(word.slice(j, j + subLength));
      }
      candidates.sort();
      // candidates are sorted before they are checked, since if theres two substrings of the same length ["ca","ab"] that are unique, we want the one that comes first in the alphabet

      for (const sub of candidates) {
        // iterate through candidates for the substring length

        // Check if sub appears in any other word
        const unique = arr.every((other, j) => j === i || !other.includes(sub));
        if (unique) {
          answer[i] = sub;
          // add that unique substring to the answer array
          found = true;
          // update found so we don't loop through that word anymore
          break;
        }
      }
      // if a substring that doesn't exist in another word for that length is not found,
      // the outer for loop runs again, and we start looking at sublength =2,
      // and so on and so forth
      // so we exit early if we find a short substring for that word and push it as the answer for that array element
      // and then move to the next word
    }
  }

  return answer;
}

// why this solution doesn't usually have high runtime despite the many loop and iteration methods

// !found short circuits the subLength loop: once a unique substring is found for a word, we stop trying longer lengths for that word entirely.

// .every() short circuits internally: the moment it finds another word containing the substring, it stops checking the rest of the array and returns false immediately. It doesn't always scan every word.

// Short substrings tend to win early: in practice, unique substrings are often found at length 1 or 2, so the subLength loop rarely climbs high.
