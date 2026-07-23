import { useEffect, useState } from "react";
import axios from "axios";

import "../styles/memberProfile.css";

function MemberProfile() {

    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState(
        {
            username: "",
            email: "",
            role: "",
            created_at: ""
        }
    );

    const [password, setPassword] = useState(
        {
            old_password:"",
            new_password:""
        }
    );

    const [loading,setLoading] = useState(true);

    const config = {
        headers:{
                Authorization:`Bearer ${token}`
            }
    };

    useEffect(()=> {
        fetchProfile();
    }, []);

    const fetchProfile = async()=> {
        
        try
            {
                const response = await axios.get("http://127.0.0.1:8000/profile/me", config);
        
                setProfile(response.data);
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Unable to load profile");
            }

        finally 
            {
                setLoading(false);
            }
    };

    const updateProfile = async(e)=> {
        e.preventDefault();

        try 
            {
                await axios.put(
                    "http://127.0.0.1:8000/profile/username",
                    {
                        username:profile.username
                    },
                    config
                );

                alert("Profile updated successfully");
                fetchProfile();
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Profile update failed");
            }
    };

    const changePassword = async(e)=> {
        e.preventDefault();
    
        try 
            {
                await axios.put(
                    "http://127.0.0.1:8000/profile/change-password",
                    password,
                    config
                );

                alert("Password changed successfully");
                setPassword(
                    {
                        old_password:"",
                        new_password:""
                    }
                );
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Password change failed");
            }
    };


    if(loading) {
        return <h2>Loading Profile...</h2>;
    }



    return (

        <div className= "member-profile-page">

            <h1>My Profile</h1>

            <div className= "profile-card">

                <h2>Profile Information</h2>

                <form onSubmit= {updateProfile}>

                    <label>Username</label>
                    <input
                        type= "text"
                        value= {profile.username}
                        onChange= {(e)=>
                            setProfile(
                                {
                                    ...profile,
                                    username:e.target.value
                                }
                            )
                        }
                    />

                    <label>Email</label>
                    <input
                        type= "email"
                        value= {profile.email}
                        disabled
                    />

                    <label>Role</label>
                    <input
                        type= "text"
                        value= {profile.role}
                        disabled
                    />

                    <label>Joined Date</label>
                    <input
                        type= "text"
                        value= { profile.created_at ? new Date(profile.created_at).toLocaleDateString():""}
                        disabled
                    />

                    <button type= "submit">
                        Update Profile
                    </button>
                </form>
            </div>

            <div className= "profile-card">

                <h2>Change Password</h2>

                <form onSubmit= {changePassword}>

                    <label>Old Password</label>
                    <input
                        type= "password"
                        value= {password.old_password}
                        onChange= {(e)=>
                            setPassword(
                                {
                                    ...password,
                                    old_password:e.target.value
                                }
                            )
                        }
                        required
                    />

                    <label>New Password</label>
                    <input
                        type= "password"
                        value= {password.new_password}
                        onChange= {(e)=>
                            setPassword(
                                {
                                    ...password,
                                    new_password:e.target.value
                                }
                            )
                        }
                        required
                    />

                    <button type= "submit">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}


export default MemberProfile;