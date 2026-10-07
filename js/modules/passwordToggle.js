/* ===================================================================
   passwordToggle.js
   The small "Show" button inside every password field.

   Both the login and the register page use this, so it lives in its
   own module instead of being written twice.
   =================================================================== */

/* Switches one password field between hidden and visible.
   The button says which input it belongs to in data-target. */
function togglePassword(event) {
  const button = event.currentTarget;
  const input = document.getElementById(button.dataset.target);

  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}

/* Finds every toggle button on the page and makes it work. */
export function setupPasswordToggles() {
  const buttons = document.querySelectorAll(".password-toggle");

  buttons.forEach(function (button) {
    button.addEventListener("click", togglePassword);
  });
}
