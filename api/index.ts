const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel!"));

app.get("/get-directions", async (req, res) => {
  const { start, goal, option } = req.query;

  console.log("Query parameters:", { start, goal, option });

  const url = "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving";
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
    "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
  };

  console.log("Request URL:", url);
  console.log("Request headers:", headers);

  try {
    const response = await axios.get(url, {
      params: { start, goal, option },
      headers: headers,
    });

    console.log("Response status:", response.status);
    console.log("Response data: ", response.data);
    // console.log("Response data:", JSON.stringify(response.data, null, 2));

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 0; // This will choose a random available port
  const server = app.listen(PORT, () =>
    console.log(`Server ready on port ${server.address().port}.`)
  );
}

// 장소 검색 API 호출
app.get('/search', async (req, res) => {
  const query = req.query.query;  // 검색어 예: '술집'
  const coordinates = req.query.coordinates;  // 좌표 예: '127.137712,37.439945'

  try {
    const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-place/v1/search', {
      const headers = {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_CLIENT_SECRET,
      },
      params: {
        query: query,
        coordinate: coordinates,
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error occurred while searching');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;