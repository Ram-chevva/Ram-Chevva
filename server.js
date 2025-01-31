const express = require('express');
const app = express();

// You can change the port number here
const port = 5500;

app.use(express.static('public')); // Serve static files from the "public" folder

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
