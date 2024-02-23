require('dotenv').config();
const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

app.get('/auth/reddit', (req, res) => {
  const state = generateRandomString(16); // Generating a random string and verify it in the callback to prevent CSRF attacks
  const scope = 'read'; 
  const authUrl = `https://www.reddit.com/api/v1/authorize?${querystring.stringify({
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    state,
    redirect_uri: process.env.REDIRECT_URI,
    duration: 'temporary',
    scope,
  })}`;
  res.redirect(authUrl);
});

app.get('/auth/reddit/callback', async (req, res) => {
  const { code, state } = req.query;
  try {
    const response = await axios.post('https://www.reddit.com/api/v1/access_token', querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    }), {
      auth: { username: process.env.CLIENT_ID, password: process.env.CLIENT_SECRET },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token } = response.data;
    res.send('Authentication successful!');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Authentication failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
