const axios = require('axios');
const db = require('../services/dbOperations');

const createPin = async (req, res) => {
    const { limit } = req.body;
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;

    if (!limit || typeof limit !== 'number' || limit <= 0) {
        return res.status(400).json({ error: 'A valid limit parameter is required.' });
    }

    try {
        // Fetch pins data from the database with the specified limit
        let pins = await db.getPinsToUpload(limit);

        // Ensure pins is an array
        if (!Array.isArray(pins)) {
            pins = [pins];
        }
        if (!pins || pins.length === 0) {
            return res.status(404).json({ error: 'No pins available for upload.' });
        }

        // Create Pinterest pins
        const results = await Promise.all(
            pins.map(async (pinData) => {
                const pinPayload = await preparePinData(pinData);
                try {
                    const result = await createPinOnPinterest(pinPayload, accessToken,pinData.id);

                    // Update pin_created status in the database
                    await db.update(pinData.id,{pin_created:1});

                    return { success: true, pinData, result };
                } catch (error) {
                    console.log(error);
                    console.error(`Failed to create pin for ${pinData.prompt}: ${error.message}`);
                    return { success: false, pinData,pinPayload, error: error.message };
                }
            })
        );

        // Separate successful and failed results
        const successfulPins = results.filter(result => result.success);
        const failedPins = results.filter(result => !result.success);

        res.json({
            success: true,
            successfulPins: successfulPins.length,
            failedPins: failedPins.length,
            details: {
                successfulPins,
                failedPins
            }
        });
    } catch (error) {
        console.error('Unexpected error during pin creation:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

const preparePinData = async (pinData) => {
    const imagePaths = pinData.image_path.split(','); // Assuming image paths are comma-separated
    const board_id = process.env.BOARD_ID;

    const mediaItems = await Promise.all(
        imagePaths.map(async (url) => ({
            title:truncateText(pinData.prompt, 100),
            description:truncateText(pinData.prompt, 150),
            link:'',
            content_type: 'image/jpeg', // Adjust this if the images are in a different format
            data: await downloadImageAsBase64(url)
        }))
    );
    return {
        board_id,
        title: truncateText(pinData.prompt, 100),
        description: truncateText(pinData.prompt, 150),
        media_source: {
            source_type: 'multiple_image_base64',
            items:mediaItems,
        }
    };
};
// Utility function to truncate text to a specified length
const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) : text;
};

// Function to download an image and convert it to base64
const downloadImageAsBase64 = async (imageUrl) => {
    try {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');
        return base64Image;
    } catch (error) {
        console.error(`Error downloading image from ${imageUrl}:`, error.message);
        throw error;
    }
};

const getBoards = async (req, res) => {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const baseUrl = process.env.BASE_URL

    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required.' });
    }

    try {
        const response = await axios.get(`${baseUrl}/v5/boards`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

const createBoard = async (req, res) => {
    const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
    const baseUrl = process.env.BASE_URL
    const {name,description,privacy} = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: 'Access token is required.' });
    }

    try {
        
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        const response = await axios.post(`${baseUrl}/v5/boards`,{name,description,privacy}, { headers });

        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const createPinOnPinterest = async (pin, accessToken,id) => {
    const baseUrl = process.env.BASE_URL
    const url = `${baseUrl}/v5/pins`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
   
    try{
        const response = await axios.post(url, pin, { headers });
        return response.data;
    }catch(error){
        console.log(error)
        console.log("PROMOPT ID: ",id)
        throw new Error(error.message);
    }
};

module.exports = {
    createPin,
    getBoards,
    createBoard
};
