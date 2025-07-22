// Simple in-memory store for chat history
// In a production app, this would be a database
const memoryStore = {};

// Function to save a conversation to memory
function saveToMemory(userId, botId, message, isUser = true) {
  const key = `${userId}:${botId}`;
  
  if (!memoryStore[key]) {
    memoryStore[key] = [];
  }
  
  memoryStore[key].push({
    role: isUser ? 'user' : 'bot',
    content: message,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last 20 messages to limit memory usage
  if (memoryStore[key].length > 20) {
    memoryStore[key] = memoryStore[key].slice(-20);
  }
}

// Function to get conversation history
function getMemory(userId, botId, limit = 10) {
  const key = `${userId}:${botId}`;
  return (memoryStore[key] || []).slice(-limit);
}

// Function to summarize memory
function summarizeMemory(userId, botId) {
  const memory = getMemory(userId, botId);
  if (memory.length === 0) return "No previous conversation";
  
  return memory.map(m => `${m.role === 'user' ? 'User' : 'Bot'}: ${m.content}`).join('\n');
}

// Function to get all conversation stats for a bot
function getBotConversationStats(botId) {
  // Count unique users and total messages for this bot
  let uniqueUsers = new Set();
  let totalMessages = 0;
  
  Object.keys(memoryStore).forEach(key => {
    // Key format is userId:botId
    const [userId, storedBotId] = key.split(':');
    
    if (storedBotId === botId) {
      uniqueUsers.add(userId);
      totalMessages += memoryStore[key].length;
    }
  });
  
  return {
    uniqueUsers: uniqueUsers.size,
    totalMessages
  };
}

// Export the memory functions
module.exports = {
  saveToMemory,
  getMemory,
  summarizeMemory,
  getBotConversationStats
};