const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const app = express();
const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakersService('./data/speakers.json');

const port = 3000;
const routes = require('./routes');
//* middleware to serve static files
app.use(express.static(path.join(__dirname, './static')));
//* middleware to tell express where to find views and use ejs as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
//* to make it work in production
app.set('trust proxy', 1);

//* global variables that are available on any template
app.use(async (request, response, next) => {
  try {
    const speakerNames = await speakerService.getNames();
    response.locals.names = speakerNames;
    return next();
  } catch (err) {
    return next(err);
  }
});

//* variables that are initialized at the start of the application and available throughout life cycle
app.locals.siteName = 'ROUX Meetups';

//* as REST APIs are stateless therefore we need sessions/cookies to persist data between requests
app.use(
  cookieSession({
    name: 'session',
    keys: ['saqQddce12s', 'Sa1defw1df'],
  })
);

//* body parser to parse form data and json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//* all requests that are directed to / will use this middleware
app.use(
  '/',
  routes({
    feedbackService,
    speakerService,
  })
);

//* error handler because it has 4 arguments and first one is error
app.use((err, request, response, next) => {
  response.locals.message = err.message;
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
  next();
});
app.listen(port, () => {
  console.log('Server running on port', port);
});
