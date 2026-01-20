const express = require('express');
const axios = require('axios');
require('dotenv').config(); // AGGIUNGI QUESTA RIGA
const app = express();
app.use(express.json());

// USA VARIABILI D'AMBIENTE (sicuro!)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER || 'GotToGods'; // METTI IL TUO USERNAME
const REPO_NAME = process.env.REPO_NAME || 'ora-artista'; // METTI IL NOME REPO

app.post('/update-file', async (req, res) => {
  const { path, content, message } = req.body;
  
  try {
    // 1. Ottieni SHA del file esistente
    const getFile = await axios.get(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    
    const sha = getFile.data.sha;
    
    // 2. Aggiorna il file
    const update = await axios.put(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      {
        message: message || 'Aggiornamento dal web',
        content: Buffer.from(content).toString('base64'),
        sha: sha
      },
      { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
    );
    
    res.json({ success: true, commit: update.data.commit.html_url });
  } catch (error) {
    console.error('GitHub API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: error.response?.data?.message || error.message 
    });
  }
});

// AGGIUNGI QUESTA PER FRONTEND
app.use(express.static('public')); // Se hai file statici

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
