import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

import "../styles/register.css";


function Register(){

    const navigate = useNavigate();

    const [formData,setFormData] = useState({
        username:"",
        email:"",
        password:"",
        role:"Member"
    });

    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");

    const handleChange = (e)=> {
        setFormData(
            {
                ...formData,
                [e.target.name]:e.target.value
            }
        );
    };

    const handleSubmit = async(e)=> {
        e.preventDefault();
        setError("");
        setSuccess("");

        try
            {
                await registerUser(formData);
                setSuccess("Registration Successful! Redirecting to login...");
            
                setTimeout(()=> {
                    navigate("/login");
                }, 1500);
            }

        catch(err)
            {
                console.log(err);
            
                setError(   err.response?.data?.detail ||  "Registration failed.");
            }
    };



    return(

        <div className= "register-container">

            <form 
                className= "register-form"
                onSubmit= {handleSubmit}
            >

                <h2>Create Account</h2>
                {
                    error && (
                        <p className= "error-message">{error}</p>
                    )
                }

                {
                    success && (
                        <p className= "success-message">{success}</p>
                    )
                }

                <input
                    className= "register-input"
                    type= "text"
                    name= "username"
                    placeholder= "Username"
                    value= {formData.username}
                    onChange= {handleChange}
                    required
                />

                <input
                    className= "register-input"
                    type= "email"
                    name= "email"
                    placeholder= "Email"
                    value= {formData.email}
                    onChange= {handleChange}
                    required
                />

                <input
                    className= "register-input"
                    type= "password"
                    name= "password"
                    placeholder= "Password"
                    value= {formData.password}
                    onChange= {handleChange}
                    required
                />

                <select
                    className= "register-select"
                    name= "role"
                    value= {formData.role}
                    onChange= {handleChange}
                >
                    <option value= "Member">Member</option>
                </select>

                <button
                    className= "register-btn"
                    type= "submit"
                >
                    Register
                </button>

                <p className= "login-link">
                    Already have an account?
                    {" "}
                    <Link to= "/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Register;