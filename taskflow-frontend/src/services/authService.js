import api from "./api";


// Register User

export const registerUser= async(UserData)=> {
    const response= await api.post("/auth/register", UserData);

    return response.data;
};



//Login User

export const loginUser= async(credentials)=> {
    const response= await api.post("/auth/login", credentials);

    return response.data;
};



// Logout User

export const logoutUser= ()=> {
    localStorage.removeItem("token");
};


// Get Current User

export const getCurrentUser= async()=> {
    const response= await api.get("/auth/me");

    return response.data;
};