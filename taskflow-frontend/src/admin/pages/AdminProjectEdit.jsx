import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../styles/adminProjectEdit.css";


function AdminProjectEdit(){

    const { id } = useParams();
    const navigate = useNavigate();

    const [project,setProject] = useState({
        name:"",
        description:"",
        status:"Planning",
        start_date:"",
        end_date:""
        }
    );

    const [loading,setLoading] = useState(true);

    useEffect(()=> {
        fetchProject();
    },[]);


    const fetchProject = async()=> {

        try
            {
                const response = await api.get(`/projects/${id}`);
            
                setProject(
                    {
                        name: response.data.name,
                        description: response.data.description || "",
                        status: response.data.status,
                        start_date: response.data.start_date || "",
                        end_date: response.data.end_date || ""
                    }
                );
            }

        catch(error)
            {
                console.log(error);
                alert("Failed to load project");
            }
        
        finally
            {
                setLoading(false);
            }
    };

    const handleChange= (e)=> {

        setProject(
            {
                ...project,
                [e.target.name]:
                e.target.value
            }
        );
    };

    const updateProject= async(e)=> {

        e.preventDefault();

        try
            {
                await api.put(`/projects/${id}`,
                    {
                        name:project.name,
                        description:project.description,
                        status:project.status,
                        start_date:project.start_date || null,
                        end_date:project.end_date || null
                    }
                );

                alert("Project updated successfully");
                navigate(`/admin/projects/${id}`);
            }

        catch(error)
            {
                console.log(error);
                alert( error.response?.data?.detail || "Update failed");
            }
    };

    if(loading)
        {
            return <h2>Loading...</h2>;
        }


    return(

        <div className= "project-edit-page">
            <div className= "edit-header">
 
                <h1>Edit Project</h1>
            </div>

            <form 
                className= "project-edit-form"
                onSubmit= {updateProject}
            >
                <label>Project Name</label>
                <input
                    type= "text"
                    name= "name"
                    value= {project.name}
                    onChange= {handleChange}
                    required
                />

                <label>Description</label>
                <textarea
                    name= "description"
                    value= {project.description}
                    onChange= {handleChange}
                    rows= "5"
                />

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

                <label>Start Date</label>
                <input
                    type= "date"
                    name= "start_date"
                    value= {project.start_date}
                    onChange= {handleChange}
                />

                <label>End Date</label>
                <input
                    type= "date"
                    name= "end_date"
                    value= {project.end_date}
                    onChange= {handleChange}
                />

                <div className= "edit-actions">

                    <button 
                        type= "submit"
                        className= "save-btn"
                    >
                        Save Changes
                    </button>

                    <button
                        type= "button"
                        className= "cancel-btn"
                        onClick= {()=> navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminProjectEdit;