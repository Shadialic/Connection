import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './userModel.js';
import Chat from './chatModel.js';

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  chatId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Chats',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Message.belongsTo(Chat, { as: 'chat', foreignKey: 'chatId' });
export default Message;
