// chatModel.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

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
  users: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers to hold user IDs
    allowNull: false,
    defaultValue: [],
  },
  latestMessageId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export default Chat;
