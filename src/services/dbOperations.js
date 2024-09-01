const db = require("../utils/db");

// Add the enrty in table.
const create = async (data) => {
  const query = `
  INSERT INTO pintrest_automation (prompt_id, prompt, url, no_of_images, image_path, pin_created)
  VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    prompt_id = VALUES(prompt_id),
    prompt = VALUES(prompt),
    url = VALUES(url),
    no_of_images = VALUES(no_of_images),
    image_path = VALUES(image_path),
    pin_created = VALUES(pin_created)
`;
  const params = [
    data.prompt_id,
    data.prompt,
    data.url,
    data.no_of_images,
    data.image_path,
    data.pin_created,
  ];
  try {
    await db.query(query, params);
  } catch (error) {
    console.error("Failed to upsert record:", error.message);
  }
};

// Fetch pins with pin_created = 0 and limit the result
const getPinsToUpload = async (limit) => {
  const query = `
  SELECT * 
  FROM pintrest_automation 
  WHERE pin_created = 0 
    AND prompt_id IS NOT NULL 
    AND prompt IS NOT NULL 
  LIMIT ?
`;
  try {
      const [rows] = await db.query(query, [limit]);
      return rows;
  } catch (error) {
      console.error('Failed to fetch pins:', error.message);
      throw error;
  }
};

// Get prompts url to scrape the prompt data
const getUrlsToScrape = async (limit) => {
  console.log("limit: ",limit);
  const query = `
    SELECT id,url 
    FROM pintrest_automation 
    WHERE prompt IS NULL 
    AND prompt_id IS NULL 
    LIMIT ?
  `;
  
  try {
      const rows = await db.query(query, [limit]);
      return rows;
  } catch (error) {
      console.error('Failed to fetch URLs:', error.message);
      throw error;
  }
};

// Insert URL into the database
const insertUrl = async (url) => {
  const query = `
    INSERT INTO pintrest_automation (url)
    VALUES (?)
  `;
  try {
    await db.query(query, [url]);
    console.log('URLs inserted successfully');
  } catch (error) {
    console.error("Failed to insert URLs:", error.message);
  }
};

// Select a record by prompt_id
const getRecordByPromptId = async (promptId) => {
  const query = "SELECT * FROM pintrest_automation WHERE prompt_id = ?";
  const params = [promptId];
  try {
    const results = await db.query(query, params);
    return results;
  } catch (error) {
    console.error("Failed to get record by prompt ID:", error.message);
    return null; // Return null or handle as needed
  }
};

// Update Pin in table.
const update = async (id, updatedData) => {
  const query = `
  UPDATE pintrest_automation
  SET ${Object.keys(updatedData)
    .map((key) => `${key} = ?`)
    .join(", ")}
  WHERE id = ?
`;
  const params = [...Object.values(updatedData), id];
  try {
    await db.query(query, params);
  } catch (error) {
    console.error("Failed to update record:", error.message);
  }
};

module.exports = {
  create,
  update,
  getRecordByPromptId,
  getPinsToUpload,
  insertUrl,
  getUrlsToScrape
};
