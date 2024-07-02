import userInterseption from "../utils/intreceptors/User";
const UserApi = userInterseption;

export async function UserData(userData, image) {
  try {
    const formData = new FormData();
    formData.append("userName", userData.userName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("image", image);

    const response = await UserApi.post("/Signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function otpVerification(otp) {
  try {
    const response = await UserApi.post("/otp", otp, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw err;
  }
}
export async function userSigninGoogle(userData) {
  try {
    const response = await UserApi.post("/userSigninWithGoole", userData);
    return response;
  } catch (error) {
    console.log(error);
  }
}

export async function LoginData(userData) {
  try {
    const response = await UserApi.post("/login", userData);
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function LoadUser(userId) {
  try {
    console.log(userId);
    const response = await UserApi.post(
      "/chat/users",
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function SearchUsers(searchQuery) {
  try {
    const response = await UserApi.get(
      `/searchUsers?search=${encodeURIComponent(searchQuery)}`
    );
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function getAllUsers() {
  try {
    const response = await UserApi.get("/getAllUsers/");
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}

export async function fetchingChats() {
  try {
    const response = await UserApi.get("/chat");
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function CreateGroup(data) {
  try {
    const response = await UserApi.post("/chat/group",data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function renameGroup(data) {
  try {
    const response = await UserApi.put("/chat/rename",data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function groupAdd(data) {
  try {
    const response = await UserApi.put("/chat/groupadd",data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function removeParticipant(data) {
  try {
    const response = await UserApi.put("/chat/groupremove",data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}

export async function sendNewMessage(data) {
  try {
    const response = await UserApi.post("/messages/",data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function getAllMessages(chatId) {
  try {
    const response = await UserApi.get(`/messages/${chatId}`);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function DeleteMessage(id) {
  try {
    const response = await UserApi.put(`/messages/delete/${id}`);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function EditingMessage(data) {
  try {
    const response = await UserApi.put(`/messages/edit`,{data});
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}





