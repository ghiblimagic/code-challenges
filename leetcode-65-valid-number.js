/**
 * @param {string} s
 * @return {boolean}
 PARAMETER: a string
 Return: True or false/ boolean
 Example:"e" false
- edge case: ., -, + by themselves
- "-90E3" e is also valid so you can't return false just because theres an alphabetic letter
- "--6
 */
var isNumber = function (s) {
  const iterableS = [...s];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  let currentElement = null;
  let previousElement = null;
  let nextElement = null;
  let eFound = 0;
  let dotsFound = 0;

  // it must have one of the numbers at bare minimum

  if (!iterableS.some((element) => numbers.includes(element))) {
    return false;
  }

  if (iterableS[0].toLowerCase() === "e") {
    return false;
  }

  if (iterableS.slice(0, 2).join("") === ".e") {
    return false;
  }

  // ####### FOR LOOP START ###########

  for (let i = 0; i < iterableS.length; i++) {
    currentElement = iterableS[i];
    nextElement = iterableS[i + 1];
    previousElement = iterableS[i - 1];

    // if we find another dot and it already has 1 dot from a previous loop, return false
    if (currentElement === "." && dotsFound >= 1) {
      return false;
    }

    // checks for E/e
    if (currentElement.toLowerCase() === "e") {
      eFound++;

      if (eFound > 1) {
        return false;
      }

      // if e has nothing after it return false
      if (nextElement === undefined) {
        return false;
      }

      // e must have an integer in front of it or .
      if (!numbers.includes(previousElement) && previousElement !== ".") {
        return false;
      }
    }

    if (
      i !== 0 &&
      currentElement === "." &&
      eFound > 0
    ) // for this edge case 99e2.5
    // . can't exist after e
    {
      return false;
    }

    //  + and - CHECK

    if (currentElement === "+" || currentElement === "-") {
      // - or + can't be followed by : -, +, undefined or e

      if (
        nextElement === "-" ||
        nextElement === "+" ||
        nextElement === undefined ||
        nextElement.toLowerCase() === "e"
      ) {
        return false;
      } else if (
        nextElement === "." &&
        iterableS[i + 2] !== undefined &&
        iterableS[i + 2].toLowerCase() === "e"
      ) {
        // "-.e"  "+.e" is invalid
        return false;
      } else if (i !== 0) {
        // it can only have one of either + or - at
        // 1. the very start
        // 2.  or if e is to its left
        if (previousElement.toLowerCase() !== "e") {
          return false;
        }
      }
    }

    // check if it has an alphabetic letter that isn't e

    if (currentElement.toLowerCase() !== currentElement.toUpperCase()) {
      // if it is a letter
      if (currentElement.toLowerCase() !== "e") {
        return false;
      }
    }

    if (currentElement === ".") {
      dotsFound++;
    }
  } // end of for loop
  return true;
};
