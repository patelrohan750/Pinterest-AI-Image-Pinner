const scrapper = require('../services/scrapperService');

const scrapePromptUrls = async (req, res) => {
    const { prompt, limit } = req.body;

    if (!prompt || !limit) {
        return res.status(400).json({ error: 'Prompt and limit are required parameters' });
    }
    
    const items = await scrapper.scrapeUrls(prompt,limit)

    res.status(200).json({ message: 'Scrape promopt successfully',total:items.length,items});
};

const scrapePromptInfo = async (req, res) => {
    const { limit } = req.body;

    if (!limit) {
        return res.status(400).json({ error: 'limit is required parameters' });
    }
    
    const items = await scrapper.scrapeInfo(limit);

    res.status(200).json({ message: 'Scrape promopt successfully',updated:items.length,items});
};

module.exports = {
    scrapePromptUrls,
    scrapePromptInfo
};