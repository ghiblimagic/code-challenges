/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function (root) {
  // even though example 3 says Input: root = []
  // Output: []
  // in reality hen LeetCode shows [] in the examples, it just means "empty tree" in their visual format. Under the hood, they're actually passing null into your function, not a real empty array.
  if (root === null) return null;

  // alternative:
  //    if (!root) {
  //  return root;    }

  // we're modifying root directly, so it'll remember the progress we made.

  // swap the left and right children of the current layer into eachothers spots

  [root.left, root.right] = [root.right, root.left];

  //then recursively go down each layer and swap out the lower levels
  invertTree(root.left);
  invertTree(root.right);
  // it knows what its parent node was, so the inverted children know which node it sits under
  // ex: 4 switched 2 and 7s spots, and then told 2 and 7 to switch their children around
  // When invertTree(7) finishes and swaps 7's children, node 4 automatically "sees" the result because it still holds a reference to node 7. The tree is just connected objects in memory.

  return root;

  // Each call is completely unaware of the bigger picture — it just does its one job on whatever node it received.

  // invertTree(4)          ← "I am node 4, swap my children"
  //   invertTree(7)        ← "I am node 7, swap my children"
  //     invertTree(9)      ← "I am node 9, I have no children, return"
  //     invertTree(6)      ← "I am node 6, I have no children, return"
  //   invertTree(2)        ← "I am node 2, swap my children"
  //     invertTree(3)      ← "I am node 3, I have no children, return"
  //     invertTree(1)      ← "I am node 1, I have no children, return"

  // The call stack is what tracks "where we are." JavaScript remembers that node 4 is still waiting for its two recursive calls to finish before it returns, node 7 is waiting for its two calls, and so on. Once the deepest calls hit null and return, everything unwinds back up naturally.
};
