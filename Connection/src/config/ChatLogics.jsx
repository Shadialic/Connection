
export const getSender=(loggedUser,users)=> {
  return users[0].id===loggedUser.id?users[1].userName:users[0].userName;
}

export const getSenderFull=(loggedUser,users)=> {
  return users[0].id===loggedUser.id?users[1]:users[0].userName;
}

