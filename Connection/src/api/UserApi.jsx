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
  console.log(searchQuery, "searchQuery");
  try {
    const response = await UserApi.get(
      `/searchUsers?search=${encodeURIComponent(searchQuery)}`
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}

export async function fetchingChats() {
  try {
    const response = await UserApi.get("/chat");
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error in UserData:", err);
    throw err;
  }
}
export async function CreateGroup(data) {
  console.log(data,'-3-3-3-3');
  try {
    const response = await UserApi.post("/chat/group",data, {
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
