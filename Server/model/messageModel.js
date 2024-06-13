import { DataTypes } from 'sequelize';
import sequelize from './sequelize';
import User from './userModel';
import Chat from './chatModel';

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    }
  },
  chat:{
    type:DataTypes.STRING,
    references:{
        model:Chat,
        key:'id'
    }
  }
},{
    timestamps:true
});

export default Message;
