const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({origin: true});

exports.infiniteGPT = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const response = await axios.post(
          "https://infinite-gpt.p.rapidapi.com/infinite-gpt",
          {
            query: req.body.query || "Hello",
            sysMsg: "You are a friendly chatbot.",
          },
          {
            headers: {
              "x-rapidapi-key": "REVOKED-RAPIDAPI-KEY",
              "x-rapidapi-host": "infinite-gpt.p.rapidapi.com",
              "Content-Type": "application/json",
            },
          },
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });
});

exports.jSearchJobs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const query = req.query.query || "software engineer";
      const location = req.query.location || "remote";

      const response = await axios.get(
          `https://jsearch.p.rapidapi.com/search?query=${query}&location=${location}&num_pages=1`,
          {
            headers: {
              "x-rapidapi-key": "REVOKED-RAPIDAPI-KEY",
              "x-rapidapi-host": "jsearch.p.rapidapi.com",
            },
          },
      );
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({error: error.message});
    }
  });
});
