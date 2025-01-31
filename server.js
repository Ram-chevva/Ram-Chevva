// Import necessary modules
const express = require('express');
const https = require('https'); // For making HTTPS requests
const fs = require('fs'); // For file system operations
const app = express();

// Set the port for the server
const port = process.env.PORT || 5500;  // You can use any port, 5500 is the default for local development

// Fetch the content of the GitHub Pages site
app.get('/', (req, res) => {
  const githubPagesUrl = 'https://ram-chevva.github.io/Ram-Chevva/';

  https.get(githubPagesUrl, (githubRes) => {
    let data = '';

    // Concatenate data chunks
    githubRes.on('data', (chunk) => {
      data += chunk;
    });

    // When the full response is received, send the content
    githubRes.on('end', () => {
      res.send(data); // Send the fetched GitHub Pages HTML content to the client
    });
  }).on('error', (err) => {
    console.error('Error fetching content from GitHub Pages:', err);
    res.status(500).send('Error fetching content');
  });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
