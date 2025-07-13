
export function chatMode(botName) {
  localStorage.setItem('activeBot', botName);
  window.location.href = '/chat'; // replace with routing logic as needed
}
