export const getSender = (loggedUser, users) => {
  return (users[0].id === loggedUser.id ? users[1].userName : users[0].userName)
}
export const getSenderImage = (loggedUser, users) => {
  return (users[0].id === loggedUser.id ? users[1].picture : users[0].picture)
}


export const getSenderFull=(loggedUser,users)=> {
  return users[0].id===loggedUser.id?users[1]:users[0].userName;
}

export const isSameSender = (messages, m, i, userId) => {
  // console.log(messages,'kkkkkkkkkkkkk');
  // console.log(m,'mmmmmmmmmm');
  // console.log(i,'iiiiiiiiiiiii');
  // console.log(userId,'userId');

  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender.id !== m.sender.id ||
      messages[i + 1].sender.id === undefined) &&
    messages[i].sender.id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  // console.log(messages,'==============');
  // console.log(i,'==dddddddddddddd');

  // console.log( messages[messages.length - 1].sender.id,'== messages[messages.length - 1].sender.id');

  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender.id !== userId &&
    messages[messages.length - 1].sender.id
  );
};
export const getNotificationCount = (chat,notification,loggerUser) => {
  if (!notification) return 0; 

  const unreadCount = notification.filter(
    (notif) =>
      notif.chatId === chat.id &&
      notif.senderId !== loggerUser.id &&
      !notif.readBy?.includes(loggerUser.id)
  ).length;

  return unreadCount;
};

