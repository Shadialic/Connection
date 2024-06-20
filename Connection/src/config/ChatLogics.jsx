
export const getSender=(loggedUser,users)=> {
  return users[0].id===loggedUser.id?users[1].userName:users[0].userName;
  
}

