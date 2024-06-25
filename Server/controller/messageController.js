import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import User from "../model/userModel.js";

const sendMessae = async (req, res) => {
  console.log(req.body, 'req.........');
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
    console.log(message.id, "messageee.................e");

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
    console.log(chatId, "chatId");

    const messages = await Message.findAll({
      where: { chatId: chatId },
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
              through: { attributes: [] }, // Ensure you include this to exclude the join table attributes
            },
          ],
        },
      ],
    });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

export { sendMessae, getAllMessages };
