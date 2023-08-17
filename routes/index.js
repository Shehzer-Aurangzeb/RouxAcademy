const express = require('express');

const router = express.Router();
const speakersRoutes = require('./speakers');
const feedbackRoutes = require('./feedback');

module.exports = (params) => {
  const { feedbackService, speakerService } = params;
  router.get('/', async (request, response, next) => {
    // * it will look into index file views/pages
    try {
      const topSpeakers = await speakerService.getList();
      const artworks = await speakerService.getAllArtwork();

      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRoutes(speakerService));
  router.use('/feedback', feedbackRoutes(feedbackService));

  return router;
};
