import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './userModel.js';
import Message from './messageModel.js';

const Chat = sequelize.define('Chat', {
  chatName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  adminId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  latestMessageId: {
    type: DataTypes.INTEGER,
    references: {
      model: Message,
      key: 'id'
    }
  }
},{
    timestamps:true
});

// Associations
Chat.belongsToMany(User, { through: 'ChatUsers', as: 'users' }); // Many-to-Many relationship with User
User.belongsToMany(Chat, { through: 'ChatUsers', as: 'chats' });

Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' }); // Admin reference
Chat.belongsTo(Message, { as: 'latestMessage', foreignKey: 'latestMessageId' });
Message.hasOne(Chat, { foreignKey: 'latestMessageId' });

export default Chat;
