const express = require('express');
const path = require('path');
const app = express();

const PORT = 5500;

// Serve static files
app.use(express.static(path.join(__dirname, '/')));

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

// RUNNING:
// npm install express --no-bin-links; node 404_test.js
