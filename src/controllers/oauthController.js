const axios = require("axios");

// Currently No use.
exports.login = (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  const authUrl =
    "https://www.pinterest.com/oauth/authorize?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "boards:read,pins:read,pins:write,pins:write_secret,boards:write&", // Replace with desired scopes (comma-separated)
    });
  console.log("authUrl: ", authUrl);
  res.redirect(authUrl);
};

exports.callback = async (req, res) => {
  const code = req.query.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI_TOKEN;
  const baseUrl = process.env.BASE_URL


  try {
    const authorizationString = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");
    const headers = {
      Authorization: `Basic ${authorizationString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    console.log("code: ",code);
    console.log("clientId: ",clientId);
    console.log("clientSecret: ",clientSecret);
    console.log("redirectUri: ",redirectUri);
    console.log("baseUrl: ",baseUrl);
    const params = {
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    };
    const response = await axios.post(
      `${baseUrl}/v5/oauth/token`,
      params,
      { headers }
    );
    const data = response.data;
    console.log("data: ",data)
    const accessToken = data.access_token;

    res.json({ success: true,toke:accessToken,message:"Authorization successful!" });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error during token exchange");
  }
};
