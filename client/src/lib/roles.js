/**
 * roles.js
 * Temporary local role + user identity helpers
 * Replace with Firebase Auth or backend user context later.
 */

// Simulated role — can be "rep", "bdc", "manager", or "admin"
export function getCurrentUserRole() {
  // Adjust this to test different permission levels
  return "rep"; // default salesperson view
}

// Simulated user ID — must match one of the users in roundRobinStorage.js
export function getCurrentUserId() {
  // Example IDs: u1–u8
  return "u4"; // Dana K. by default
}