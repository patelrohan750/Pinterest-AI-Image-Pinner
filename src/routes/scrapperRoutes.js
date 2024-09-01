const express = require('express');
const scrapperController = require('../controllers/scrapperController');

const router = express.Router();

router.post('/scrape-prompts-urls', scrapperController.scrapePromptUrls);
router.post('/scrape-prompts-info', scrapperController.scrapePromptInfo);


module.exports = router;
