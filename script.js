const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
  
  const messageText = document.createElement('pre');
  messageText.textContent = message;
  
  const timestamp = document.createElement('div');
  timestamp.classList.add('message-time');
  timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  messageElement.appendChild(messageText);
  messageElement.appendChild(timestamp);
  
  chatMessages.appendChild(messageElement);
  setTimeout(() => {
    messageElement.classList.add('visible');
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 10);
}

async function sendMessage() {
  const message = userInput.value.trim();

  if (message) {
    addMessage(message, true);
    userInput.value = '';

    try {
      const response = await fetch('/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      addMessage(data.message, false);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("An error occurred while sending your message.", false);
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/welcome');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    addMessage(data.message, false);
  } catch (error) {
    console.error("Error loading welcome message:", error);
  }
});

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});