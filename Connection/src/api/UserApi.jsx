import userInterseption from "../utils/intreceptors/User";
const UserApi = userInterseption;

export async function UserData(userData, image) {
  try {
    const formData = new FormData();
    formData.append("userName", userData.userName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("image", image);
    console.log(userData, "0303030");
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
    const response = await UserApi.post("/chat", userId, {
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

export async function fetchingChats(userId) {
    try {
      const response = await UserApi.get("/chat");
      console.log(response.data);
      return response.data;
    } catch (err) {
      console.error("Error in UserData:", err);
      throw err;
    }
  }
  