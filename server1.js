const express = require('express');
const { getAccessToken } = require('./tokenservice');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(cors());

app.get('/api/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (error) {
    res.status(500).send('Error fetching token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
