/**
 * Check if input is digit
 * @function isDigit
 * @export
 * @param {int} number
 * @returns {boolean} -
 */
export function isDigit(number) {
  if (isNaN(parseInt(number, 10))) return false;
  return true;
}

/**
 * Check if a user as access to a document
 * @function validateAccess
 * @export
 * @param {int} docUserId - the user id on the document
 * @param {int} docAccess - the access on the document
 * @param {int} docRoleId - the role id on the document
 * @param {int} userId - the user's id
 * @param {int} userRoleId - the user's role id
 * @returns {object} - a boolean and error message
 */
export function validateAccess(doc, user) {
  const errorMsg = {};
  const docUserId = doc.userId;
  const docAccess = doc.access;
  const docRoleId = doc.roleId;
  const userId = user.id;
  const userRoleId = user.roleId;
  let validatedUser = true;

  if ((docAccess === 1 && docUserId !== userId) ||
    (docAccess === 2 && docRoleId !== userRoleId)) {
    validatedUser = false;
    errorMsg.message = 'You do not have access to this document';
  }
  return {
    errorMsg,
    validatedUser
  };
}
