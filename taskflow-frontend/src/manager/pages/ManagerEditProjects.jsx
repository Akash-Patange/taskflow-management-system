import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/managerEditProjects.css";

function ManagerEditProject(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState({
        name: "",
        description: "",
        status: "Planning",
        start_date: "",
        end_date: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        getProject();
    },[]);

    const getProject = async()=> {

        try
            {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `http://127.0.0.1:8000/projects/${id}`,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                const data = response.data;
                setProject({
                    name: data.name || "",
                    description: data.description || "",
                    status: data.status || "Planning",
                    start_date: data.start_date || "",
                    end_date: data.end_date || ""
                    }
                );
            }

        catch(error) 
            {
                console.log(error);
                alert("Unable to load project");
            }
    };

    const handleChange= (e)=> {
        setProject({
            ...project,
            [e.target.name]:e.target.value
        });
    };

    const updateProject = async(e)=> {

        e.preventDefault();

        try
            {
                setLoading(true);
                const token = localStorage.getItem("token");
                await axios.put(
                    `http://127.0.0.1:8000/projects/${id}`,
                    project,
                    {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }
                );
            
                alert("Project updated successfully");
                navigate("/manager/projects");
            }

        catch(error) 
            {
                console.log(error);
                alert(error.response?.data?.detail || "Project update failed");
            }

        finally 
            {
                setLoading(false);
            }
    };


    return(

        <div className= "manager-page">

            <h1>Edit Project</h1>

            <form
                className= "project-form"
                onSubmit= {updateProject}
            >
    
                <div className= "form-group">

                    <label>Project Name</label>
                    <input
                        type= "text"
                        name= "name"
                        value= {project.name}
                        onChange= {handleChange}
                        required
                    />
                </div>

                <div className= "form-group">

                    <label>Description</label>
                    <textarea
                        name= "description"
                        value= {project.description}
                        onChange= {handleChange}
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

                <div className= "date-container">
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
                        loading ? "Updating..." : "Update Project"
                    }
                </button>
            </form>
        </div>
    );
}

export default ManagerEditProject;