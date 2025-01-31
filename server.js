const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const app = express();
const port = 3000; 
const path=require("path");
const API_KEY = "Your_API_Key"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
app.use(express.static(path.join(__dirname))); 
app.use(express.json());

let chatHistory = [];

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const chat = model.startChat({
      history: chatHistory
    });

    const result = await chat.sendMessageStream(userMessage);
    let botResponse = '';

    for await (const chunk of result.stream) {
      botResponse += chunk.text();
    }

    chatHistory.push(
      { role: "user", parts: [{ text: userMessage }] },
      { role: "model", parts: [{ text: botResponse }] }
    );

    res.json({ 
      message: botResponse,
      history: chatHistory 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Something went wrong',
      details: error.message 
    });
  }
});

app.get('/welcome', (req, res) => { //GET
    const welcomeMessage = "I am your daily assistant! How can I assist you today?";
    res.json({ message: welcomeMessage });
  });


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});