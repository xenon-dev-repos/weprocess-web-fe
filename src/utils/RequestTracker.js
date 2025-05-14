/**
 * Global session request tracker to prevent duplicate requests across component instances.
 * This is used by both the useChat hook and the ApiService to coordinate API calls.
 */
export const GLOBAL_SESSION_REQUEST = {
  inProgress: false,
  lastRequestTime: 0,
  pendingRequest: false
}; 