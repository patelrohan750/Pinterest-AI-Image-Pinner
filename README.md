🚀 Automated AI Image Scraper and Pinterest Pin Creator
=======================================================

📖 Description
--------------

This Node.js project automates the process of scraping AI-generated images from a third-party website and creating Pinterest pins using the Pinterest API. It includes features such as web scraping, image conversion to base64 format, OAuth authentication, and automatic pin creation with custom titles and descriptions. The project demonstrates a seamless integration between web scraping and social media automation, making it easier to manage AI-generated content on Pinterest.

🛠 Technology Stack
-------------------

*   **Node.js**: JavaScript runtime for server-side development.
*   **Express**: Web framework for building RESTful APIs.
*   **MySQL**: Relational database management system.

📦 Packages
-----------

Here are the packages used in this project, as specified in `package.json`:

*   `express`: Web framework for Node.js.
*   `mysql2`: MySQL client for Node.js.
*   `axios`: Promise-based HTTP client for making requests.
*   `dotenv`: Module for loading environment variables from a `.env` file.
*   `morgan`: HTTP request logger middleware for Node.js.
*   `cheerio`: Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
*   `puppeteer`: Headless browser for web scraping and automated testing.
*   `winston`: Logging library for Node.js.

🔧 Set Up Environment Variables
-------------------------------

Create a `.env` file in the root directory of the project with the following variables:

    PINTEREST_ACCESS_TOKEN="<ADD PINTEREST ACCESS TOKEN WHICH GET FROM THE OAUTH TOKEN>"
    PORT=3000
    EXCHANGE_URL=https://www.pinterest.com/oauth/token
    CLIENT_ID="<PINTERNEST APP ID>"
    CLIENT_SECRET="<PINTERNEST APP SECRET ID>"
    REDIRECT_URI="<REDIRECT URL AFTER THE AUTHENTICATE>"
    MAIN_URI=https://www.pinterest.com/oauth/?client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&scope=boards:read,pins:read,pins:write,pins:write_secret,boards:write
    REDIRECT_URI_TOKEN="<REDIRECT URL AFTER THE AUTHENTICATE>"
    PROD_API_URL=https://api.pinterest.com
    SANDBOX_API_URL=https://api-sandbox.pinterest.com
    BASE_URL=https://api-sandbox.pinterest.com
    BOARD_ID="<ADD YOUR PINTEREST BOARD ID>"
    DB_HOST="<MYSQL DB HOST>"
    DB_USER="<MYSQL DB USER>"
    DB_PASSWORD="<MYSQL DB PASSWORD>"
    DB_DATABASE="<MYSQL DB DATABASE>"
    

For more details, refer to the `.env.example` file provided in the project.

💻 Installation Setup
---------------------

1.  **Clone the Repository:**

        git clone https://github.com/patelrohan750/Pinterest-AI-Image-Pinner.git

3.  **Navigate to the Project Directory:**

        cd Pinterest-AI-Image-Pinner

5.  **Install Dependencies:**

        npm install

7.  **Create and Configure the `.env` File:**

Follow the instructions in the **Set Up Environment Variables** section above to configure your environment variables.

9.  **Start the Application:**

        npm start

11.  **Access the Application:**

Open your web browser and go to `http://localhost:3000` to access the application.

🌟 Features
-----------

*   **AI Image Scraping**: Automatically scrape AI-generated images from a specified website.
*   **Image Conversion**: Convert images to base64 format for easier integration.
*   **Pinterest Integration**: Use OAuth authentication to interact with the Pinterest API.
*   **Automatic Pin Creation**: Create Pinterest pins with custom titles and descriptions.
*   **Database Management**: Store and manage data using MySQL.
*   **Logging**: Track application activity using Winston.
*   **Web Scraping**: Utilize Puppeteer for advanced scraping tasks.

📡 API Endpoints
----------------

### POST `/api/scrape-prompts-urls`

Scrape images based on the specified prompt and limit.

**Request Body:**

    {
          "limit": 20,
          "prompt": "3d cricket player"
        }
        

**Response:**

    {
          "message": "Scrape prompt successfully",
          "total": 20,
          "items": [
            "https://example.com/image1.jpg",
            "https://example.com/image2.jpg",
            "https://example.com/image3.jpg",
            "https://example.com/image4.jpg",
            "https://example.com/image5.jpg",
            "https://example.com/image6.jpg",
            "https://example.com/image7.jpg",
            "https://example.com/image8.jpg",
            "https://example.com/image9.jpg",
            "https://example.com/image10.jpg",
            "https://example.com/image11.jpg",
            "https://example.com/image12.jpg",
            "https://example.com/image13.jpg",
            "https://example.com/image14.jpg",
            "https://example.com/image15.jpg",
            "https://example.com/image16.jpg",
            "https://example.com/image17.jpg",
            "https://example.com/image18.jpg",
            "https://example.com/image19.jpg",
            "https://example.com/image20.jpg"
          ]
        }
        

### POST `/api/scrape-prompts-info`

Scrape detailed information about images based on the specified limit.

**Request Body:**

    {
      "limit": 10
    }
    

**Response:**

    {
      "message": "Scrape prompt successfully",
      "updated": 10,
      "items": [
        "https://example.com/image1_info.jpg",
        "https://example.com/image2_info.jpg",
        "https://example.com/image3_info.jpg",
        "https://example.com/image4_info.jpg",
        "https://example.com/image5_info.jpg",
        "https://example.com/image6_info.jpg",
        "https://example.com/image7_info.jpg",
        "https://example.com/image8_info.jpg",
        "https://example.com/image9_info.jpg",
        "https://example.com/image10_info.jpg"
      ]
    }
    

### GET `/api/boards`

Retrieve a list of Pinterest boards.

**Response:**

    {
      "items": [
        {
          "follower_count": 10,
          "id": "board123",
          "collaborator_count": 2,
          "pin_count": 46,
          "board_pins_modified_at": "2024-08-15T05:49:03",
          "name": "AI Inspirations",
          "privacy": "PUBLIC",
          "created_at": "2024-08-15T05:49:03",
          "description": "A board for AI-generated inspirations.",
          "owner": {
            "username": "ai_artist"
          },
          "media": {
            "pin_thumbnail_urls": [
              "https://example.com/thumb1.jpg",
              "https://example.com/thumb2.jpg"
            ],
            "image_cover_url": "https://example.com/cover.jpg"
          }
        }
      ],
      "bookmark": null
    }
    

### POST `/api/boards`

Create a new Pinterest board.

**Request Body:**

    {
      "name": "AI World1",
      "description": "AI World1",
      "privacy": "PUBLIC"
    }
    

**Response:**

    {
      "name": "AI World1",
      "description": "AI World1",
      "pin_count": 0,
      "owner": {
        "username": "ai_artist"
      },
      "board_pins_modified_at": "2024-09-01T08:37:59",
      "media": {
        "pin_thumbnail_urls": [],
        "image_cover_url": null
      },
      "privacy": "PUBLIC",
      "created_at": "2024-09-01T08:37:59",
      "id": "board456",
      "collaborator_count": 0,
      "follower_count": 0
    }
    

### POST `/api/create-pins`

Create Pinterest pins with a specified limit.

**Request Body:**

    {
      "limit": 1
    }
    

**Response:**

    {
      "success": true,
      "successfulPins": 0,
      "failedPins": 1,
      "details": {
        "successfulPins": [],
        "failedPins": [
          {
            "success": false,
            "pinData": {
              "id": 81,
              "prompt_id": "123",
              "prompt": "AI-generated image",
              "url": "https://example.com/image.jpg",
              "no_of_images": 1,
              "image_path": "/path/to/image.jpg",
              "pin_created": 0
            },
            "pinPayload": {
              "board_id": "your_board_id",
              "title": "AI Image Pin",
              "description": "An AI-generated image pin.",
              "media_source": {
                "source_type": "multiple_image_base64",
                "items": [
                  {
                    "title": "Close up of muscular male in a sci-fi setting",
                    "description": "Close up of a muscular male speedball player in a sci-fi stadium, wearing a retro-futuristic outfit.",
                    "link": "https://example.com",
                    "content_type": "image/jpeg",
                    "data": "base64_encoded_image_data"
                  }
                ]
              },
              "error": "Request failed with status code 400"
            }
          }
        ]
      }
    }
    

🔗 Pinterest API Documentation
------------------------------

For more details on Pinterest API usage, refer to the [Pinterest API Documentation](https://developers.pinterest.com/docs/api/v5/introduction/?).

🤝 Contribution Guidelines
--------------------------

1.  **Fork the Repository**
2.  **Create a New Branch**

        git checkout -b feature/your-feature

4.  **Make Your Changes**
5.  **Commit Your Changes**

         git commit -m 'Add new feature'

7.  **Push to the Branch**

        git push origin feature/your-feature

9.  **Create a New Pull Request**

📝 License
----------

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
