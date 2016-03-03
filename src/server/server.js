import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static('public'));

app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Listen on port 3000, IP defaults to 127.0.0.1 (localhost)
app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Server running at http://localhost: ' + port);
});
