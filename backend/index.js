const express = require("express");
const app = express();
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { ulid } = require("ulid");
const { MongoClient } = require("mongodb");

let db;

async function initializeClient() {
  const client = await MongoClient.connect(
    "mongodb+srv://majorproj:Anurocks1234$55sbdhsd2ijdwdonan@cluster0.0wodb.mongodb.net/major-proj"
  );

  return client.db();
}

async function getDb() {
  if (!db) {
    db = await initializeClient();
  }
  return db;
}

const port = 3001;
app.use(express.json());
app.use(express.urlencoded());

const tokensObj = {
  token_01HPSQ5NXAAVEERHRB46R04GVA: {
    userName: "Shashank Kumar",
    userId: "user_01HPSQ5NXCWN9RXZJEGRGQE5C0",
    access: ["developer"],
  },
  token_01HPSQMY8S7N1SC3R2K4RCBW29: {
    userName: "Anupama Jha",
    userId: "user_01HPSQMY8SKMH8SBGWRP7ADKZB",
    access: ["developer"],
  },
};

function deleteFile(filePath, filename) {
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`${filename} has been deleted successfully.`);
  } else {
    console.log(`File ${filename} does not exist.`);
  }
}

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "file_" + ulid() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .pdf format allowed!"));
    }
  },
});

const s3 = new AWS.S3({
  accessKeyId: "8d1d7da927b6a897dd462fe69b46954e",
  secretAccessKey:
    "b5cfdb89b62166644f07df75f8b5e14c8a22f40ae5de2319a4cc9ee133b9551a",
  endpoint: "https://61837c45dfc997b1a932f4b2116d93ae.r2.cloudflarestorage.com",
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Please upload a PDF file." });
  }
  const filePath = path.join(__dirname, "uploads", file.filename);

  const token = req.headers.authorization;
  let userId;
  if (tokensObj[token]) {
    userId = tokensObj[token].userId;
  } else {
    deleteFile(filePath, file.filename);
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: "shashank",
    Key: `file/${userId}/${file.filename}`,
    Body: fileContent,
    ContentType: "application/pdf",
    ACL: 'public-read'
  };

  s3.upload(params, function (err, data) {
    if (err) {
      deleteFile(filePath, file.filename);
      throw err;
    }
    res.send({
      response: "Success",
      message: "File uploaded successfully",
      data: `https://cf.shawshankkumar.me/file%2F${userId}%2F${file.filename}`,
    });
  });

  await (await getDb())
    .collection("files")
    .insertOne({ createdAt: +new Date(), userId, fileName: file.filename });

  deleteFile(filePath, file.filename);
});

app.get("/files", async (req, res) => {
  const token = req.headers.authorization;
  let userId;
  if (tokensObj[token]) {
    userId = tokensObj[token].userId;
  } else {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }

  const data = await (await getDb())
    .collection("files")
    .find({ userId })
    .toArray();
  const updatedData = data.map((e) => {
    const { _id, ...eNew } = e;
    return {
      ...eNew,
      fileUrl: `https://cf.shawshankkumar.me/file%2F${e.userId}%2F${e.fileName}`,
    };
  });
  res.status(200).json({
    data: updatedData,
  });
});

app.get("/", (req, res) => {
  res.send("Med Buddy");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
