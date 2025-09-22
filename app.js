const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const port = process.env.PORT || 3000;
const chatEmitter = new EventEmitter();

const app = express();

// Serve static files if any
app.use(express.static(path.join(__dirname, '/public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/chat', (req, res) => {
  const { message } = req.query;
  if (message) chatEmitter.emit('message', message);
  res.end();
});

app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`);

  chatEmitter.on('message', onMessage);

  req.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${port}`);
});
