import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './model/sequelize.js';
import './model/associations.js'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import chatRouter from './routes/chatRoute.js';
import decodeTokenMiddleware from './middleware/authMiddleware.js';
import messageRouter from './routes/messageRoute.js';
dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(decodeTokenMiddleware);
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
app.use('/chat', chatRouter);
app.use('/messages',messageRouter);



const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Start the server
import { Server } from 'socket.io'; // Correct import statement for socket.io

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.URL,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("setup",(userData)=>{
    socket.join(userData.id)
    console.log(userData.id,'userData.id');
    socket.emit("coneected")
  })
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });
  socket.on("new message", (newMessageRecieved) => {
    let chat=newMessageRecieved.chat
    console.log(`Socket ${socket.id} joined room ${chat}`);

    if( !chat.users){
     return  console.log('not definded');
    }
    chat.users.forEach(user => {
      if(user.id==newMessageRecieved.sender.id)return;
      socket.in(user.id).emit("message recieved",newMessageRecieved)
      
    });
   
  });


});