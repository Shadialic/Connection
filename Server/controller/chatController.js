import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";

const accessChat = async (req, res) => {
  const { userId } = req.body;
  console.log(userId, "userId");

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).json({ message: "userId not exist" });
  }

  try {
    const currentUserId = req.userId;
    console.log(currentUserId, "UscurrentUserId");

    let isChat = await Chat.findOne({
      where: {
        isGroupChat: false,
      },
      include: [
        {
          model: User,
          as: "admin",
          attributes: ["id", "userName", "email"],
          where: {
            id: currentUserId,
          },
          required: true,
        },
        {
          model: User,
          as: "participants",
          attributes: ["id", "userName", "email"],
          through: { attributes: [] },
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

      const createdChat = await Chat.create(chatData);
      await createdChat.addParticipants([currentUserId, userId]);
      console.log(createdChat, "createdChat");

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
      console.log(fullChat, "fullChat");

      return res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const fetchChats = async (req, res) => {
  try {
    console.log("ddddddddddddddddd");
    const currentUserId = req.userId; // Assuming req.user contains the authenticated user's information

    let chats = await Chat.findAll({
      include: [
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
          where: {
            id: currentUserId,
          },
        },
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
        },
        // Uncomment and adjust the following if you want to include the latest message
        // {
        //   model: Message,
        //   as: "latestMessage",
        //   include: [
        //     {
        //       model: User,
        //       as: "sender",
        //       attributes: ["name", "pic", "email"],
        //     },
        //   ],
        // },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const createGroupChat = async (req, res) => {
  console.log(req.body); // Ensure req.body is correctly received

  let users;
  try {
    users = JSON.parse(req.body.users); // Parse the array of user IDs from req.body.users
  } catch (error) {
    return res.status(400).send({ message: "Invalid users format" });
  }

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  // Add the current user (admin) to the users array
  users.push(req.userId);

  try {
    // Create the group chat
    const groupChat = await Chat.create({
      chatName: req.body.groupName,
      isGroupChat: true,
      adminId: req.userId,
    });

    // Add users to the group chat using the addParticipants method
    await groupChat.addParticipants(users);

    // Retrieve the full group chat with participants and admin populated
    const fullGroupChat = await Chat.findOne({
      where: { id: groupChat.id },
      include: [
        {
          model: User,
          as: "participants",
          attributes: { exclude: ["password"] },
          through: { attributes: [] }, // Exclude timestamps from join table
        },
        {
          model: User,
          as: "admin",
          attributes: { exclude: ["password"] },
        },
      ],
    });

    res.status(201).json(fullGroupChat); // Respond with the full group chat details
  } catch (error) {
    console.log(error, "333333333333333333333333333333");
    res.status(400).json({ message: error.message });
  }
};

const renameGroup = async (req, res) => {
  console.log(req.body, "req.body");
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
