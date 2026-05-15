/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */

// Key Observations:

// The last element of postorder is always the root
// Finding the root in inorder splits the array into left and right subtrees
// The sizes of those subtrees tell us how to split postorder as well

// postorders last element is how we find the root
var buildTree = function (inorder, postorder) {
  // need this check, or you get a maximum call stack warning
  // because otherwise theres no escape for the recursion,
  // rootVal = undefined, so root is -1,
  // So middle= -1 causes inorder.slice(0, -1) to return [] again, and the function keeps calling itself with the same empty arrays forever until the stack explodes.
  if (!postorder.length) return null;

  // Last element of postorder is always the root
  const rootVal = postorder[postorder.length - 1];
  // question asks for the tree to be returned, so we have to make a TreeNode
  const root = new TreeNode(rootVal);

  // since postOrder told us what the root is,
  // lets find where root sits in inorder — splits left and right
  // middle isn't just a position, it's a count of how many nodes are in the LEFT subtree.
  const middleLeftCount = inorder.indexOf(rootVal);

  // Slice into left and right halves

  // lefts slice will always start at 0, because its the left side
  const leftRootInorder = inorder.slice(0, middleLeftCount); // end at middle, since to the left would be left subtree items.
  // .slice(0,1) is the same as saying take ONE item, aka the count of items in the left tree
  const leftRootPostorder = postorder.slice(0, middleLeftCount); // end at middle, since to the left would be left subtree items
  root.left = buildTree(leftRootInorder, leftRootPostorder);

  const rightRootInorder = inorder.slice(middleLeftCount + 1);
  // so we take all the left tree elements (middleLeft Count) and the old root away (+1), since we only want right tree elements
  const rightRootPostorder = postorder.slice(
    middleLeftCount,
    postorder.length - 1,
  ); // take off the items from the left tree, and then - 1 because we're deleting the old root off

  root.right = buildTree(rightRootInorder, rightRootPostorder);

  return root;

  // inorder:   [ 9 | 3 | 15, 20, 7 ]
  //                 ↑
  //             middle = 1  → "there is 1 node to the left of the root"

  //  The two arrays are structured like this:

  //  inorder:   [ left subtree | root | right subtree ]
  // postorder: [ left subtree | right subtree | root ]

  // They both contain the exact same nodes in the left subtree — just in a different internal order. So if there are 1 nodes to the left in inorder, there must also be 1 node in the front of postorder belonging to the left subtree.

  // inorder:   [ 9  |  3  | 15, 20, 7 ]
  // postorder: [ 9  | 15, 7, 20 |  3  ]
  //              ↑                  ↑
  //           same 1 node        same root
  //           different position, same count

  // So slice(0, middle) on both arrays grabs the same set of nodes, just differently ordered:
  // leftRootInorder   = [9]  ← 9 in sorted position
  // leftRootPostorder = [9]  ← 9 in postorder position (happens to be same here)
  // The slices don't need to be in the same order — they just need to contain the same nodes, because the next recursive call will sort out the structure from there.
};
