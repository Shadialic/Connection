import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import { Op } from 'sequelize';
import { uploadToCloudinary } from "../utils/Cloudnery/cloudnery.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).json({ message: "userId not exist" });
  }
  try {
    const currentUserId = req.userId; 

    let isChat = await Chat.findOne({
      where: { isGroupChat: false },
      include: [
        {
          model: User,
          as: "admin",
          attributes: ["id", "userName", "email"],
          where: { id: currentUserId },
          required: true,
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "userName", "email"],
          through: { attributes: [] },
          where: { id: userId },
          required: true,
        },
      ],
    });


    if (isChat) {
      return res.json(isChat);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        adminId: currentUserId,
        users: [currentUserId, userId]
      };

      const createdChat = await Chat.create(chatData);
      await createdChat.addParticipants([currentUserId, userId]);
      console.log(chatData, "chatData");

      const fullChat = await Chat.findOne({
        where: { id: createdChat.id },
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id", "userName", "email"],
            through: { attributes: [] },
          },
        ],
      });

      return res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const fetchChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    // Fetch chats where the current user is a participant, ordered by updatedAt
    let chats = await Chat.findAll({
      where: {
        users: {
          [Op.contains]: [currentUserId],
        },
      },
      order: [["updatedAt", "DESC"]],
    });

    // Fetch latest message details for each chat
    for (let chat of chats) {
      if (chat.latestMessageId) {
        const latestMessage = await Message.findOne({
          where: { id: chat.latestMessageId },
          include: [
            {
              model: User,
              as: "sender",
              attributes: { exclude: ["password"] },
            },
          ],
        });

        // Attach latest message to chat object
        chat.dataValues.latestMessage = latestMessage || null;
      }

      // Fetch user details for each chat
      const userIds = chat.users;
      const users = await User.findAll({
        where: {
          id: userIds,
        },
        attributes: { exclude: ["password"] },
      });

      chat.dataValues.participants = users;
    }

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};


const createGroupChat = async (req, res) => {
  console.log(req.body, 'oooooo');
  const { chatName, groupPhoto } = req.body;
  let users;
  
  try {
    users = JSON.parse(req.body.users);
    console.log(users, 'pepepepep');
  } catch (error) {
    return res.status(400).json({ message: "Invalid users format" });
  }

  if (users.length < 2) {
    return res.status(400).json({ message: "More than 2 users are required to form a group chat" });
  }

  let members = users.map(user => user.id);

  // Add the current user (admin) to the members array
  members.push(req.userId);
  console.log(members, '=================');

  try {
    // Create the group chat
    const groupChat = await Chat.create({
      chatName: chatName,
      isGroupChat: true,
      adminId: req.userId,
      groupImage: groupPhoto,
      users: members
    });

    console.log(groupChat, 'groupChat');

    // Add users to the group chat
    await groupChat.addParticipants(members);

    // Retrieve the full group chat with participants and admin populated
    const fullGroupChat = await Chat.findOne({
      where: { id: groupChat.id },
      include: [
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
          through: { attributes: [] }
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] }
        }
      ]
    });

    res.status(201).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const renameGroup = async (req, res) => {
  const { ChatId, chatName } = req.body;

  try {
    // Update the chat name
    const updated = await Chat.update(
      { chatName: chatName },
      {
        where: { id: ChatId },
        returning: true,
        plain: true,
      }
    );
    console.log(updated, "updated");

    if (updated === 0) {
      return res.json({ message: "Chat Not Found" });
    }

    const updatedChat = await Chat.findOne({
      where: { id: ChatId },
      include: [
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
          through: { attributes: [] },
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
        },
      ],
    });
    console.log(updatedChat, "updatedChat");
    res.json(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
const addToGroup = async (req, res) => {
  const { ChatId, userId } = req.body;
  console.log(req.body,'req.body');

  try {
    const chat = await Chat.findOne({
      where: { id: ChatId },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "admin",
          attributes: ["id"],
        },
      ],
    });

    if(!chat) {
      return res.json({ message: "Chat Not Found" });
    }

    // Check if the requester is the admin
    if(chat.adminId !== req.userId) {
      return res
        .status(403)
        .json({ message: "Only admins can add users to the group" });
    }

    // Add the user to the group
    await chat.addParticipants(userId);

    // Fetch the updated chat with related users and admin
    const updatedChat = await Chat.findOne({
      where: { id: ChatId },
      include: [
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
          through: { attributes: [] },
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const removeFromGroup = async (req, res) => {
  console.log(req.body, 'req');
  const { ChatId, userId } = req.body;

  try {
    // Find the chat to ensure it exists and include users to check if the requester is admin
    const chat = await Chat.findOne({
      where: { id: ChatId },
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id"],
          through: { attributes: [] },
        },
        {
          model: User,
          as: "admin",
          attributes: ["id"],
        },
      ],
    });
    console.log(chat, 'chat');

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }
    if (!chat.admin || chat.admin.id !== req.userId) {
      return res.status(403).json({ message: "Only admins can remove users from the group" });
    }

    const chatUser = chat.participants.find(user => user.id === userId);
    if (!chatUser) {
      return res.status(404).json({ message: "User Not Found in the Chat" });
    }

    
    await chat.removeParticipant(userId);  

    const updatedChat = await Chat.findOne({
      where: { id: ChatId },
      include: [
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
          through: { attributes: [] },
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.json(updatedChat);
  } catch (error) {
    console.error(error); 
    res.status(400).json({ message: error.message });
  }
};


export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
