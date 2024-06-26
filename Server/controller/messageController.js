import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import { Op } from 'sequelize';
const sendMessae = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      console.log("Invalid Data");
      res.json({ message: "Invalid data passed" });
      return; // add return to prevent further execution
    }

    const newMessage = {
      senderId: req.userId,
      content: content,
      chatId: chatId,
    };
    const message = await Message.create(newMessage);

    const newmessages = await Message.findOne({
      where: { id: message.id },
      include: [
        {
          model: User,
          as: "sender",
          attributes: { exclude: ["password"] },
        },
        {
          model: Chat,
          as: "chat",
          include: [
            {
              model: User,
              as: "participants",
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
    });

    // Pass the message ID instead of the message object
    await Chat.update({ latestMessageId: message.id, updatedAt: new Date() }, { where: { id: chatId } });

    res.json(newmessages); // corrected to send the full message object
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" }); // Added proper error handling
  }
};


const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const numericChatId = Number(chatId);


    // Find the chat including participants
    const chat = await Chat.findOne({
      where: { id: chatId },
      include: {
        model: User,
        as: 'participants',
        attributes: ['id'],
      },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const participantIds = chat.participants.map((participant) => participant.id);

    // Find all messages for the chat and its participants
    const messages = await Message.findAll({
      where: {
        chatId: {
          [Op.or]: participantIds.map((id) => ({
            [Op.eq]: chatId, // chatId should match the current chat
          })),
        },
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: { exclude: ['password'] },
        },
        {
          model: Chat,
          as: 'chat',
          include: [
            {
              model: User,
              as: 'participants',
              attributes: { exclude: ['password'] },
              through: { attributes: [] },
            },
          ],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export { sendMessae, getAllMessages };
