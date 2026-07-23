import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/managerCreateProject.css";

function ManagerCreateProject(){

    const navigate = useNavigate();
    const [project, setProject] = useState({
        name:"",
        description:"",
        status:"Planning",
        start_date:"",
        end_date:""
    });

    const [loading,setLoading] = useState(false);

    const handleChange = (e)=> {
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e)=> {

        e.preventDefault();
        
        try
            {
                setLoading(true);
                const token = localStorage.getItem("token");
                await axios.post(
                    "http://127.0.0.1:8000/projects",
                    project,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                alert("Project created successfully");
                navigate("/manager/projects");
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Failed to create project");
            }

        finally {setLoading(false);}
    };


    return(

        <div className= "manager-page">

            <h1>Create Project</h1>

            <form 
                className= "project-form"
                onSubmit= {handleSubmit}
            >

                <div className= "form-group">
    
                    <label>Project Name</label>
                    <input
                        type= "text"
                        name= "name"
                        value= {project.name}
                        onChange= {handleChange}
                        placeholder= "Enter project name"
                        required
                    />
                </div>

                <div className= "form-group">
    
                    <label>Description</label>
                    <textarea
                        name= "description"
                        value= {project.description}
                        onChange= {handleChange}
                        placeholder= "Project description"
                    />
                </div>

                <div className= "form-group">
    
                    <label>Status</label>
                    <select
                        name= "status"
                        value= {project.status}
                        onChange= {handleChange}
                    >
                        <option value= "Planning">Planning</option>
                        <option value= "Active">Active</option>
                        <option value= "Completed">Completed</option>
                        <option value= "On Hold">On Hold</option>
                    </select>
                </div>

                <div className= "date-row">
                    <div className= "form-group">
    
                        <label>Start Date</label>
                        <input
                            type= "date"
                            name= "start_date"
                            value= {project.start_date}
                            onChange= {handleChange}
                        />
                    </div>

                    <div className= "form-group">
    
                        <label>End Date</label>
                        <input
                            type= "date"
                            name= "end_date"
                            value= {project.end_date}
                            onChange= {handleChange}
                        />
                    </div>
                </div>

                <button 
                    type= "submit"
                    disabled= {loading}
                >
                    {
                        loading ? "Creating..." : "Crete Project"
                    }
                </button>
            </form>
        </div>
    );
}

export default ManagerCreateProject;