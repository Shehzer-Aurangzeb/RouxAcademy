const express = require('express');

const router = express.Router();

module.exports = (speakerService) => {
  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakerService.getList();
      const artworks = await speakerService.getAllArtwork();
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speakers',
        speakers,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });
  router.get('/:shortname', async (request, response, next) => {
    try {
      const { shortname } = request.params;
      const speaker = await speakerService.getSpeaker(shortname);
      const artworks = await speakerService.getArtworkForSpeaker(shortname);
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speaker-detail',
        speaker,
        artworks,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
