import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import Users from "./models/Users.js"
import twilio from "twilio";
import PDFDocument from "pdfkit";
import fs from "fs";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import { ifError } from "assert";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const SECRET_KEY  = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

mongoose.connect(DB_URL, {
    family: 4,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});
// Cloudinary Credentials
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
// Twilio Credentials
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = twilio(accountSid, authToken);

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

  const authenticateUser = (req, res, next) => {
    console.log(req.headers.authorization);
    
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decodedToken = jwt.verify(
      token,
      SECRET_KEY
  );
  req.user = {
    username: decodedToken.username,
    userId: decodedToken.userId, 
    email: decodedToken.email,
  }  
    next();
  };

app.post('/register', async (req, res) =>{
    const { user } = req.body;
    const username = user.username;
    const email = user.email;
    const password = user.password;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await Users.findOne({email});
    if (isUserExist) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new Users({
        username,
        email,
        password: hashedPassword,
    });

    newUser.save()
    .then(() => {
        res.status(201).json({ message: "User registered successfully" });
    })
    .catch((error) => {
        res.status(500).json({ message: "Error registering user", error });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    Users.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Compare passwords
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: "Error comparing passwords", error: err });
                }
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                // Generate JWT
                const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '12h' });
                
                res.status(200).json({ message: "Login successful", token });
            });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error logging in", error });
        });
});

app.post("/send-bill-to-customer", async (req, res) => {
  try {

    function generateTablePDF(filename, tableData) {
      const doc = new PDFDocument({ margin: 50 });
      const writeStream = fs.createWriteStream(filename);
      doc.pipe(writeStream);

      const columnWidth = 120;
      const rowHeight = 28;
      const tableX = 50;
      let y = 140;

      // shop title
      doc.fontSize(22).font("Helvetica-Bold")
        .text("ABC GROCERIES", { align: "center" });

      const pageWidth = doc.page.width;
      const margin = 50;

      // bill details
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text("NAME: RAMASWAMY", margin, 80);

      let dateText = "DATE: 12/1/2023";
      let dateWidth = doc.widthOfString(dateText);
      doc.text(dateText, pageWidth - margin - dateWidth, 80);

      doc.text("BILL NO: 12D837FHJFD78K34J", margin, 105);

      let timeText = "TIME: 3:48 PM";
      let timeWidth = doc.widthOfString(timeText);
      doc.text(timeText, pageWidth - margin - timeWidth, 105);

      // table header
      const columns = ["no", "name", "price", "qty", "amount"];
      doc.fontSize(12).font("Helvetica-Bold");

      columns.forEach((col, i) => {
        const x = tableX + i * columnWidth;
        doc.rect(x, y, columnWidth, rowHeight).fillAndStroke("#e0e0e0", "#000");
        doc.fill("#000").text(col.toUpperCase(), x + 10, y + 8);
      });

      y += rowHeight;
      doc.font("Helvetica").fontSize(12);

      tableData.forEach((row, index) => {
        const isLastRow = index === tableData.length - 1;

        columns.forEach((col, i) => {
          const x = tableX + i * columnWidth;
          let fillColor = index % 2 ? "#f9f9f9" : "#ffffff";
          if (isLastRow) fillColor = "#d4ffd4";

          doc.rect(x, y, columnWidth, rowHeight)
            .fillAndStroke(fillColor, "#000");

          let text = row[col] !== undefined ? String(row[col]) : "";
          doc.fill("#000").text(text, x + 10, y + 8);
        });

        y += rowHeight;
      });

      doc.end();

      return new Promise((resolve, reject) => {
        writeStream.on("finish", () => resolve(filename));
        writeStream.on("error", reject);
      });
    }

    const tableData = [
      { no: 1, name: "Apple", price: 50, qty: 3, amount: 150 },
      { no: 2, name: "Banana", price: 20, qty: 10, amount: 200 },
      { no: 3, name: "Milk", price: 40, qty: 2, amount: 80 },
      { no: "", name: "TOTAL", price: "", qty: "", amount: 430 }
    ];

    const pdfPath = await generateTablePDF("table.pdf", tableData);

    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      format: "pdf",
      use_filename: true,
      unique_filename: false,
    });

    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: "whatsapp:+919159053487",
      body: "📄 Your grocery bill is ready",
      mediaUrl: [uploadResult.secure_url]
    });

    res.json({
      success: true,
      message: "PDF Generated & Sent to WhatsApp",
      cloud_url: uploadResult.secure_url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "PDF Generation Error", error });
  }
});


app.post("/send-bill", authenticateUser, async (req, res) => {
    const {data} = req.body;
      const userId = req.user.userId;
    console.log(data);
    
    try {
       const year = new Date().getFullYear(), month = new Date().toLocaleString('en-IN', { month: 'long' }), date = new Date().getDate();
      const user = await Users.findOne({_id: userId});

      let isCustomerExist = user.customers.findIndex((prev) => {
        return prev?.phoneNo == data.customerData.phoneNo
      }) 

      if ( isCustomerExist !== -1) {// If customer exists
        let index = isCustomerExist;
        let currentBillData = data.bill;
        await Users.updateOne(
          { _id: userId },
          {
            $push: {
              [`customers.${index}.bills.${year}.${month}.${"26"}`]: currentBillData
            }
          }
        );
      } else {    // If customer does not exist    
        let currentBillData = data.bill;
        user.customers.push({
          name: data.customerData.name,
          phoneNo: data.customerData.phoneNo,
          bills: {[year]: {
            [month]: {
              [date]: [currentBillData]
            }
          }}
        })
      }
      user.markModified('profile');
      await user.save();
    } catch (error) {
      console.log(error);
      
    }
});

app.post("/change-user-info", authenticateUser, async (req, res) => {
  const {changedDataName, changedData} = req.body;
  console.log(changedDataName, changedData);
  
  const userId = req.user.userId;
  try {
  const user = await Users.findOne({_id: userId});  

  await Users.updateOne(
  { _id: userId },
  { $set: { [`personalInfo.${changedDataName}`]: changedData } }
);

  console.log(user);

  await user.save();
  } catch (error) {
    res.status(500).json({error: "Error changing user personal data"})
  }
});

// -------------------------------------- GET METHODS --------------------------------------
app.get("/get-user-data", authenticateUser,  async (req, res) => {
    const userId = req.user.userId;
    try {
      const user = await Users.findOne({_id: userId}, { password: 0, email: 0 });  
      res.status(200).json({userData: user});
    } catch (error) {
      res.status(500).json({error: "Error fetching user data"})
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});