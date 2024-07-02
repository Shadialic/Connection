import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import { Op } from 'sequelize';
const sendMessae = async (req, res) => {
  try {
    const { content, chatId ,file} = req.body;
    console.log(req.body,'req.body');
    if (!content || !chatId) {
      console.log("Invalid Data");
      res.json({ message: "Invalid data passed" });
      return; // add return to prevent further execution
    }

    const newMessage = {
      senderId: req.userId,
      content: content,
      chatId: chatId,
      file:file
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
    
    console.log(newmessages, 'newmessages');
    
    // Fetch participants manually if needed
    if (newmessages.chat) {
      for (let chat of [newmessages.chat]) {
        const userIds = chat.users;
        const users = await User.findAll({
          where: {
            id: userIds,
          },
          attributes: { exclude: ["password"] },
        });
        chat.dataValues.participants = users;
      }
    }
    
    // Pass the message ID instead of the message object
    await Chat.update(
      {
        latestMessageId: message.id,
        updatedAt: new Date(),
      },
      {
        where: { id: chatId },
      }
    );
    
    res.json(newmessages);
  
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" }); 
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
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the message by ID and delete it
    const deleted = await Message.destroy({
      where: { id: id },
    });

    if (deleted === 0) {
      // If no rows were affected, return message indicating the message was not found
      return res.status(404).json({ message: 'Message not found' });
    }

    // Return success response
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete message' });
  }
};

const editMessage = async (req, res) => {
  try {
    console.log(req.body,'req.body');
    const { newContent, messageId } = req.body.data;

    // Update the message by ID
    const updatedMessage = await Message.update(
      { content: newContent },
      { where: { id: messageId } }
    );

    if (updatedMessage[0] === 0) {
      // If no rows were affected, return message indicating the message was not found
      return res.status(404).json({ message: 'Message not found' });
    }

    // Return success response
    res.json({ message: 'Message updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update message' });
  }
};



export { sendMessae, getAllMessages,deleteMessage,editMessage};
