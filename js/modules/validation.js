/* ===================================================================
   validation.js
   Small checks used by the register and login forms.
   Each function answers one yes/no question and nothing else.
   =================================================================== */

/* True when the user typed nothing, or only spaces. */
export function isEmpty(value) {
  return value.trim() === "";
}

/* Checks the email looks like name@domain.com
   The pattern means: some characters, then @, then some characters,
   then a dot, then some characters. No spaces anywhere. */
export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/* Passwords shorter than 6 characters are too weak. */
export function isLongEnough(password) {
  return password.length >= 6;
}

/* True when both password fields hold the same text. */
export function doPasswordsMatch(password, confirmPassword) {
  return password === confirmPassword;
}
