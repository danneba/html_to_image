const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const nodeHtmlToImage = require("node-html-to-image");
const cloudinary = require("./cloudinary");
const { error } = require("console");

require("dotenv").config();

const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
  },
});

app.get("/get-pg-version", async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const response = await client.query("SELECT version()");
      res.json({ postgresVersion: response.rows[0].version });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.get("/convert-to-image", async (req, res) => {
//   const htmlFilePath = path.join(__dirname, "views", "index.html");
//   fs.readFile(htmlFilePath, "utf8", (err, html) => {
//     if (err) {
//       return res.status(500).send("Error when reading the file");
//     }
//     nodeHtmlToImage
//       .toPng(html)
//       .then((dataURl) => {
//         res.send(`<img src=${dataURl} alt="converted image"/>`);
//       })
//       .catch((error) => {
//         console.error(error);
//         res.status(500).send("Error when converting the image");
//       });
//   });
// });

// app.get("/convert-to-image", async (req, res) => {
//   // const htmlContent =
//   //   "<html><body><h1>Hello, HTML to Image!</h1></body></html>";
//   const htmlContent = path.join(__dirname, "views", "index.html");
//   fs.readFile(htmlContent, "utf8", async (err, htmlContent) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error reading the file");
//     }

//     try {
//       const image = await nodeHtmlToImage({ html: htmlContent });
//       res.writeHead(200, { "Content-Type": "image/png" });
//       res.end(image, "binary");
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error converting HTML to image");
//     }
//   });
// });
// app.get("/", (req, res) => {
//   res.send("Hi");
// });
app.post("/convert-to-image", async (req, res) => {
  const htmlContent = req.body.htmlBody;
  if (!htmlContent) {
    res.status(401).json({ error: "trying to connect " });
  }
  try {
    const image = await nodeHtmlToImage({ html: htmlContent });
    res.writeHead(200, { "content-Type": "image/png" });
    res.end(image, "binary");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error converting HTML to  image");
  }
});

app.post("/accept-html", async (req, res) => {
  const htmlContent = req.body.htmlReq;
  if (!htmlContent) {
    res.status(400).json({ error: "No HTML is provided " });
  }
  try {
    cloudinary.uploader
      .upload_stream({ resource_type: "raw" }, (error, result) => {
        if (error) {
          console.error(error);
          return res
            .status(500)
            .json({ error: "Error uploading the html file to cloudinary" });
        }
        res.json({ cloudinaryUrl: result.secure_url });
      })
      .end(htmlContent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing HTML content" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
