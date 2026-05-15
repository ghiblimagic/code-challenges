/**
 * @param {number[]} nums
 * @return {boolean}
 */
// These notes are intentionally excessive as this was done to "rubber duck" through the code to learn

// parameter, array of integers
// return boolean based on if player 1 can win
// ex nums = [1,5,2]  false
// edge case/important note:
// can't just do math.max of the starting and end array, because the other players optimal playing choices have to be considered
// what if they don't always grab the larger of the two numbers?
// but question says: You may assume that both players are playing optimally.

// pseudocode
// we will figure out what the maximum advantage a player can get per turn
// store expensive lookups in a memoized object

// this will require recursive logic

var predictTheWinner = function (nums) {
  const arrayLength = nums.length;
  // creating a subarray for each element to fill out memo
  const memoizedAdvantage = Array.from({ length: arrayLength }, (_, i) =>
    new Array(arrayLength).fill(null),
  );
  // [leftIndex][rightIndex] = the value inside will the be the maximum advantage a player could get for choosing a specific element

  // however, some of these indexes will stay null/not be used.
  // its just easier to give each subarray the same amount of spaces

  // original array [1, 5, 2] from the problem

  // memo for tracking the maximum advantage at different positions a player could be at:
  //                 r=0     r=1   r=2
  // leftIndex=0  [    1,    4,   -2   ]
  // leftIndex==1  [  null,   5,    3   ]
  // leftIndex==2  [  null, null,   2   ]

  // in reality we'd skip the base cases ex [0][0] which only points to one element, since it would be faster to just do an array lookup
  //                 r=0     r=1   r=2
  // leftIndex=0  [   base,    4,   -2   ]
  // leftIndex==1  [  null,   base,    3   ]
  // leftIndex==2  [  null, null,   base   ]

  // [0][2] aka [1, 5, 2]  the very start we return -2 as the maximum advantage
  // [0][1] aka [1,5] = 4
  //[1][2] aka [5,2] = 3

  // [0][0] aka [1]= return the base value of 1
  // [1][1] aka [5]= return the base value of 5
  // [2][2] aka [2]= return the base value of 2

  // some of these prepoulated areas of the memo will stay null because they will never exist, an array can't end before it starts
  // [1][0] - invalid so stays null
  // [2][0] - invalid so stays null
  // [2][1] - invalid so stays null

  function totalAdvantagePerTurn(leftElement, rightElement) {
    if (leftElement === rightElement) return nums[leftElement];
    // base case: one element left, just take it
    // not memoized — a direct array read is as fast as a memo lookup, so caching it would be wasted overhead

    if (memoizedAdvantage[leftElement][rightElement] !== null)
      return memoizedAdvantage[leftElement][rightElement]; // already solved, look it up

    const pickLeft =
      nums[leftElement] - totalAdvantagePerTurn(leftElement + 1, rightElement);
    // take left end elmement/number, subtract from opponents advantage they could get throughout the game (recursive call)
    const pickRight =
      nums[rightElement] - totalAdvantagePerTurn(leftElement, rightElement - 1);
    // take right end elmement/number,  subtract from opponents advantage they could get throughout the game

    memoizedAdvantage[leftElement][rightElement] = Math.max(
      pickLeft,
      pickRight,
    ); // save the best outcome/whats the maximimum advantage possible
    // remember whats the best entire game advantage a player can get for choosing that element

    return memoizedAdvantage[leftElement][rightElement];
    // return the number from this end result, since we're doing recursive function calls
  }

  return totalAdvantagePerTurn(0, arrayLength - 1) >= 0; // player 1 wins if their net advantage is >= 0
  // we need it to be true or false whether play 1 can win so >=0
};
