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

test('chatMode function redirects to chat page', () => {
  const botName = 'TestBot';
  chatMode(botName);
  
  expect(window.location.href).toBe('/chat');
});