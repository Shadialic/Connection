import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './model/sequelize.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();

// Get the current file URL and directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.URL,
    credentials: true,
    methods: "*",
  })
);

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => {
    console.error('Unable to create database & tables:', err);
  });

app.use('/', userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
