import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './userModel.js'; // Import the User model

const Chat = sequelize.define('Chat', {
  chatName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  latestMessageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' });
Chat.belongsToMany(User, { through: 'ChatUsers', as: 'participants', foreignKey: 'ChatId' });
User.belongsToMany(Chat, { through: 'ChatUsers', as: 'chats', foreignKey: 'UserId' });

export default Chat;
