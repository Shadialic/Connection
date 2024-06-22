import ChatDb from "../model/chatModel.js";
import User from "../model/userModel.js";
import Message from "../model/messageModel.js";


const accessChat = async (req, res) => {
  console.log('-3-3-3');
  const { userId } = req.body;
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).json({ message: "userId not exist" });
  }
  try {
    const currentUserId = req.user.id;
    let isChat = await ChatDb.findOne({
      where: {
        isGroupChat: false,
      },
      include: [
        {
          model: User,
          as: "ChatUsers",
          through: {
            attributes: [],
          },
          where: {
            id: currentUserId,
          },
          required: true,
        },
        {
          model: User,
          as: "ChatUsers",
          through: {
            attributes: [],
          },
          where: {
            id: userId,
          },
          required: true,
        },
      ],
    });
    console.log(isChat, "isChat");

    if (isChat) {
      return res.json(isChat);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        adminId: currentUserId,
      };
      console.log(chatData, "chatData");

      const createdChat = await ChatDb.create(chatData);
      await createdChat.addUsers([currentUserId, userId]);

      const fullChat = await ChatDb.findOne({
        where: { id: createdChat.id },
        include: [
          {
            model: User,
            as: "ChatUsers",
            attributes: { exclude: ["password"] },
            through: { attributes: [] },
          },
        ],
      });
      console.log(fullChat, "fullchat");
      return res.status(200).json(fullChat);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const fetchChats = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    let chats = await ChatDb.findAll({
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
          through: { attributes: [] },
          where: {
            id: currentUserId,
          },
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
        },
        {
          model: Message,
          as: "latestMessage",
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["name", "pic", "email"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users;
  try {
    users = JSON.parse(req.body.users);
  } catch (error) {
    return res.status(400).send({ message: "Invalid users format" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Add the current user to the users array
  users.push(req.user.id);

  try {
    // Create the group chat
    const groupChat = await ChatDb.create({
      chatName: req.body.name,
      isGroupChat: true,
      adminId: req.user.id,
    });

    // Add users to the chat
    await groupChat.addUsers(users);

    // Retrieve the full group chat with users and admin populated
    const fullGroupChat = await ChatDb.findOne({
      where: { id: groupChat.id },
      include: [
        {
          model: User,
          as: "users",
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

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    // Update the chat name
    const [updated] = await ChatDb.update(
      { chatName: chatName },
      {
        where: { id: chatId },
        returning: true,
        plain: true,
      }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Fetch the updated chat with related users and admin
    const updatedChat = await Chat.findOne({
      where: { id: chatId },
      include: [
        {
          model: User,
          as: "users",
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
const addToGroup =async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Find the chat to ensure it exists and include users to check if the requester is admin
    const chat = await ChatDb.findOne({
      where: { id: chatId },
      include: [
        {
          model: User,
          as: "ChatUsers",
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

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the requester is the admin
    if (chat.adminId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only admins can add users to the group" });
    }

    // Add the user to the group
    await chat.addChatUser(userId);

    // Fetch the updated chat with related users and admin
    const updatedChat = await ChatDb.findOne({
      where: { id: chatId },
      include: [
        {
          model: User,
          as: "ChatUsers",
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
}
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Find the chat to ensure it exists and include users to check if the requester is admin
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: [
        {
          model: User,
          as: "ChatUsers",
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

    if (!chat) {
      return res.status(404).json({ message: "Chat Not Found" });
    }

    // Check if the requester is the admin
    if (chat.adminId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only admins can remove users from the group" });
    }

    // Remove the user from the group
    await chat.removeChatUser(userId);

    // Fetch the updated chat with related users and admin
    const updatedChat = await Chat.findOne({
      where: { id: chatId },
      include: [
        {
          model: User,
          as: "ChatUsers",
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
export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
