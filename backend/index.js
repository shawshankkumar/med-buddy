const express = require("express");
const app = express();
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { ulid } = require("ulid");
const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const PdfParse = require("pdf-parse");
const axios = require("axios");
const bcrypt = require("bcrypt");
let db;

const genAI = new GoogleGenerativeAI("AIzaSyDvx6DYQF168oHBaidcqu4fKkATHZf9LQE");

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
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    deleteFile(filePath, file.filename);
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: "shashank",
    Key: `file/${userId}/${file.filename}`,
    Body: fileContent,
    ContentType: "application/pdf",
    ACL: "public-read",
  };

  const pdfData = await PdfParse(fileContent);
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt_2 =
    "is the next line of the string resembling a medical test report? if yes return true otherwise false, nothing else \n" +
    pdfData.text;
  const result_2 = await model.generateContent(prompt_2);
  const response_2 = await result_2.response;
  const text_2 = response_2.text();
  console.log(text_2, pdfData.text);
  // @ts-ignore
  if (text_2 === "false") {
    deleteFile(filePath);
    return res.send({
      response: "Error",
      message: "Not a medical report",
    });
  }

  s3.upload(params, async function (err, data) {
    if (err) {
      deleteFile(filePath, file.filename);
      throw err;
    }
    res.send({
      response: "Success",
      message: "File uploaded successfully",
      url: `https://cf.shawshankkumar.me/file%2F${userId}%2F${file.filename}`,
      name: file.filename,
      text_2,
    });
  });

  await (await getDb())
    .collection("files")
    .insertOne({ createdAt: +new Date(), userId, fileName: file.filename });

  deleteFile(filePath, file.filename);
});

app.get("/files", async (req, res) => {
  const token = req.headers.authorization;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;
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

app.post("/summary", async (req, res) => {
  const token = req.headers.authorization;
  const fileName = req.body.fileName;
  const force = req.body.force;
  const tokenObj = await (await getDb())
    .collection("tokens")
    .findOne({ token });
  if (!tokenObj) {
    return res.status(401).json({ message: "Unauthorized: Token not found" });
  }
  const userId = tokenObj.userId;
  const data = await (await getDb())
    .collection("files")
    .findOne({ userId, fileName });
  if (!data) {
    return res.status(404).json({ message: "File not found" });
  }

  if (!force && data.summary) {
    return res.status(200).json({
      data: data.summary,
    });
  }
  const url = `https://cf.shawshankkumar.me/file%2F${userId}%2F${fileName}`;
  // @ts-ignore
  const pdfDownload = await axios.get(url, { responseType: "arraybuffer" });
  const pdfData = await PdfParse(pdfDownload.data);
  // @ts-ignore
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt_2 =
    `Pretend that you are a doctor, give report summary after reading the test parameters and tell without much technical details about what happened, their values and if it's abnormal. Give diet and nutrition advice to improve the results of the report. Tell us about the medical condition from the report results. Each section should have a key in an object 'Report Summary:', 'Diet and nutrition advice:', 'Medical Condition:' Write report summary in less than 1000 words in a way that normal person can get some idea. In the diet plan, tell what should the patient avoid and eat based on the report since giving a complete diet plan would need more test results. Write the medical condition in less than 1000 words in a way that a normal person would understand about health and don't get scared. In the medical condition part, tell which type of doctor and practioner should this patient go to. Be very specific about diet and also recommend foods they can eat and should avoid\n` +
    pdfData.text;
  const result_2 = await model.generateContent(prompt_2);
  const response_2 = await result_2.response;
  const text_2 = response_2.text();
  console.log(text_2);
  await (await getDb())
    .collection("files")
    .updateOne({ userId, fileName }, { $set: { summary: text_2 } });
  res.status(200).json({
    data: text_2,
  });
});

app.post("/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const existingUser = await (await getDb())
    .collection("users")
    .findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = "user_" + ulid();
  await (await getDb()).collection("users").insertOne({
    email,
    password: hashedPassword,
    createdAt: +new Date(),
    name,
    userId,
  });
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await (await getDb()).collection("users").findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = "token_" + ulid();
    await (await getDb()).collection("tokens").insertOne({
      token,
      userId: user.userId,
      createdAt: +new Date(),
      role: ["developer"],
    });
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, name: user.name, userId: user.userId },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/", (req, res) => {
  res.send("Med Buddy");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
