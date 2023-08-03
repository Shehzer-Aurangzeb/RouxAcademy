const path = require('path');
const express = require('express');

const app = express();

const port = 3000;

//* middleware to serve static files
app.use(express.static(path.join(__dirname, './static')));
//* middleware to tell express where to find views and use ejs as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (request, response) => {
  // * it will look into index file views/pages
  response.render('pages/index', { pageTitle: 'Welcome' });
});

app.get('/speakers', (request, response) => {
  response.sendFile(path.join(__dirname, './static/speakers.html'));
});

app.listen(port, () => {
  console.log('Server running on port', port);
});
