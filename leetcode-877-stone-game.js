/**
 * @param {number[]} piles
 * @return {boolean}
 */

// parameters: array of integers
// return boolean
// example piles = [3,7,2,3] true
//edge cases to not worry about in this case: no negative integers, no strings ect, no ties because the piles are odd, bob playing first is not an issue here
// pseudocode:
// make an array to memoize the results of each turn

// we will be getting the max advantage a player can get per turn
// recursive calls are necessary
var stoneGame = function (piles) {
  const pilesLength = piles.length;

  const memoizedAdvantages = Array.from({ length: pilesLength }, (_, i) =>
    new Array(pilesLength).fill(null),
  );

  function advantagePerTurn(leftIndex, rightIndex) {
    if (leftIndex === rightIndex) return piles[leftIndex];
    // if we're on the last play, return with an array lookup

    const currentTurnMemo = memoizedAdvantages[leftIndex][rightIndex];

    if (currentTurnMemo !== null) return currentTurnMemo;

    const leftElementChosen =
      piles[leftIndex] - advantagePerTurn(leftIndex + 1, rightIndex);
    const rightElementChosen =
      piles[rightIndex] - advantagePerTurn(leftIndex, rightIndex - 1);

    const maximizedChoice = Math.max(leftElementChosen, rightElementChosen);

    memoizedAdvantages[leftIndex][rightIndex] = maximizedChoice;

    return maximizedChoice;
  }

  return advantagePerTurn(0, pilesLength - 1) > 0;
};
