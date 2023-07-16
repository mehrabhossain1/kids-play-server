const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 8800;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
