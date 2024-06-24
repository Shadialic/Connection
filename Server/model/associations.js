// import User from './userModel.js';
// import Message from './messageModel.js';
// import Chat from './chatModel.js';

// // Define associations for Message
// Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
// Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId' });

// // Define associations for Chat
// Chat.belongsToMany(User, { through: 'ChatUsers', as: 'participants' }); // Updated alias
// User.belongsToMany(Chat, { through: 'ChatUsers', as: 'userChats' }); // Updated alias

// Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
// Chat.belongsTo(Message, { as: 'latestMessage', foreignKey: 'latestMessageId' });

// // Export models with associations
// export {
//   User,
//   Message,
//   Chat
// };
