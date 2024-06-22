import User from './userModel.js';
import Message from './messageModel.js';
import Chat from './chatModel.js';

// Define associations
Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId' });

Chat.belongsToMany(User, { through: 'ChatUsers', as: 'users' });
User.belongsToMany(Chat, { through: 'ChatUsers', as: 'chats' });

Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
Chat.belongsTo(Message, { as: 'latestMessage', foreignKey: 'latestMessageId' });
Message.hasOne(Chat, { foreignKey: 'latestMessageId' });

export default {
  User,
  Message,
  Chat
};
