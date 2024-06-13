import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './User';
import Message from './Message';

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
  }
},{
    timestamps:true
});

// Associations
Chat.belongsToMany(User, { through: 'ChatUsers' }); // Many-to-Many relationship with User
User.belongsToMany(Chat, { through: 'ChatUsers' });

Chat.belongsTo(User, { as: 'admin', foreignKey: 'adminId' }); // Admin reference
Chat.belongsTo(Message, { as: 'latestMessage', foreignKey: 'latestMessageId' });
Message.hasOne(Chat, { foreignKey: 'latestMessageId' });

export default Chat;
