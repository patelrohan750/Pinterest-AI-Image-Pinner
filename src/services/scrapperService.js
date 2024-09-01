const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const dbOp = require('./dbOperations');

// Infinite scroll.
const scrapeInfiniteScrollItems = async (page, itemTargetCount) => {
  let items = [];

  while (itemTargetCount > items.length) {
    const html = await page.content();

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Extract links to popups
    $('a[href^="/prompt/"]').each(async(index, element) => {
      const popupLink = $(element).attr('href');
      if (popupLink) {
        items.push(`https://lexica.art${popupLink}`);
        await dbOp.insertUrl(`https://lexica.art${popupLink}`);
      }
    });

    previousHeight = await page.evaluate("document.body.scrollHeight");
    await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
    await page.waitForFunction(
      `document.body.scrollHeight > ${previousHeight}`
    );
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return items;
};

// Scrape the prompt ids.
const scrapeUrls = async(prompt,limit) => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: false });

    // Construct the URL with the search prompt
    const url = `https://lexica.art/?q=${encodeURIComponent(prompt)}`;

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url,{ waitUntil: 'networkidle2' });

    const items = await scrapeInfiniteScrollItems(page, limit);
    // Close the browser
    await browser.close();
    return items
  } catch (error) {
    console.error(`Error scraping images: ${error.message}`);
    return [];
  }
}

// Scrap particular prompt info. 
const scrapeInfo = async (limit) => {
  const browser = await puppeteer.launch({ headless: true }); // Launch browser only once
  try {
    const page = await browser.newPage(); // Open a single page instance
    const urls = await dbOp.getUrlsToScrape(limit); // Fetch 50 URLs to scrape
    for (const {id,url} of urls) {
      await scrapeDataAndUpdateDb(page, url, id); // Use the same page instance
    }

    return urls;
  } catch (error) {
    console.error('Failed to scrape pins:', error.message);
    return [];
  } finally {
    await browser.close(); // Close the browser after all URLs are processed
  }
};

// Function to scrape data and update the database
const scrapeDataAndUpdateDb = async (page, url, id) => {
  try {
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url, { waitUntil: 'networkidle2' });

    const popupHtml = await page.content();
    const $ = cheerio.load(popupHtml);

    const promptText = $('div.mt-6 > p > a').text();
    const imagePaths = [];

    $('img').each((index, element) => {
      const imageUrl = $(element).attr('src');
      if (imageUrl) {
        imagePaths.push(imageUrl);
      }
    });

    const imagePathsString = imagePaths.join(',');

    // Extract the prompt ID from the link
    const urlObj = new URL(url);
    const promptId = urlObj.pathname.split('/').pop();

    // Update the record in the database
    const updatedData =  {
      'prompt_id': promptId,
      'prompt': promptText,
      'no_of_images': imagePaths.length,
      'image_path':imagePathsString,
     }
    await dbOp.update(id,updatedData)
    console.log(`Processed prompt with ID: ${id}`);

  } catch (error) {
    console.error(`Failed to scrape data for URL ${url}:`, error.message);
  }
};


module.exports = {
  scrapeUrls,
  scrapeInfo
};