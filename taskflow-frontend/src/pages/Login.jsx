import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../styles/login.css";

function Login(){
    
    const navigate= useNavigate();
    const {login}= useContext(AuthContext);
    
    const [formData, setFormData]= useState(
        {
            email: "",
            password: ""
        }
    );
    
    const [error, setError]= useState("");
    
    const handleChange=(e)=> {
        setFormData(
            {
                ...formData,
                [e.target.name]: e.target.value
            }
        );
    };
    
    const handleSubmit= async(e)=> {
        
        e.preventDefault();
        setError("");
        
        try 
            {
                const data= await login(formData);
    
                if (data.user.role=== "Admin"){
                    navigate("/admin");
                }

                else if (data.user.role=== "Manager"){
                    navigate("/manager");
                }

                else{
                    navigate("/member");
                }
            } 

        catch (err)
            {
                setError(   err.response?.data?.detail ||   "Invalid email or password.");
            }
    };



    return (

        <div className= "login-container">
        
            <form
                className= "login-form"
                onSubmit= {handleSubmit}
            >

                <h2>Login</h2>
                {
                    error && (
                        <p className= "error">{error}</p>
                    )
                }

                <input 
                    type= "email"
                    name= "email"
                    placeholder= "email"
                    value= {formData.email}
                    onChange= {handleChange}
                    required
                />

                <input
                    type= "password"
                    name= "password"
                    placeholder= "password"
                    value= {formData.password}
                    onChange= {handleChange}
                    required
                />

                <button type= "submit">
                    Login
                </button>

                <p> Don't have an account?  {" "}   <Link to= "/register">  Register    </Link> </p>
            </form>
        </div>
    );
}

export default Login;