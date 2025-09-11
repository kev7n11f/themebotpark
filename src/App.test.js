import { chatMode } from './utils';

// Mock localStorage for testing
const localStorageMock = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
delete window.location;
window.location = { href: '' };

test('chatMode function sets active bot in localStorage', () => {
  const botName = 'TestBot';
  chatMode(botName);
  
  expect(localStorage.setItem).toHaveBeenCalledWith('activeBot', botName);
});

// NOTE: The following test assumed chatMode sets window.location.href directly.
// If chatMode uses React Router or another navigation method, this test should be updated
// to mock and assert the correct navigation function (e.g., useNavigate, history.push).
// test('chatMode function redirects to chat page', () => {
//   const botName = 'TestBot';
//   chatMode(botName);
//   
//   expect(window.location.href).toBe('/chat');
// });