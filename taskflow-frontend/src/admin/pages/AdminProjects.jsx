import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../styles/adminProjects.css";


function AdminProjects(){

    const [projects,setProjects] = useState([]);
    const [search,setSearch] = useState("");

    const [pagination,setPagination] = useState({
        page:1,
        total_pages:1,
        total:0
    });

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    const fetchProjects = async(page= 1)=> {

        try
            {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/projects/",
                    {
                        params:{
                            page:page,
                            limit:10,
                            search:search
                        }
                    }
                );

                const data = response.data;
                setProjects(data.projects);
                setPagination(
                    {
                        page:data.page,
                        total_pages:data.total_pages,
                        total:data.total
                    }
                );
            }

        catch(err)
            {
                console.log(err);
                setError("Failed to fetch projects");
            }

        finally
            {
                setLoading(false);
            }
    };


    useEffect(()=> {
        const timer = setTimeout(()=> {
            fetchProjects(1);
        },500);

        return ()=> clearTimeout(timer);
    },[search]);

    useEffect(()=> {
        fetchProjects(1);
    },[]);



    return(

        <div className= "admin-projects">
            <div className= "projects-header">
                <div>

                    <h1>Projects</h1>
                    <p>Manage all projects</p>
                </div>

                <Link to= "/admin/projects/create" className= "create-btn">
                    + New Project
                </Link>
            </div>

            {
                error && <p className= "error">{error}</p>
            }

            <div className= "projects-toolbar">
                
                <input
                    type= "text"
                    placeholder= "Search projects..."
                    value= {search}
                    onChange= {(e)=> setSearch(e.target.value)}
                />
            </div>

            {
                loading ?
                (
                    <h3>Loading projects...</h3>
                ):(
                    <div className="project-grid">
                        {
                            projects.length === 0 ?
                            (
                                <p>No projects found</p>
                            ): projects.map(
                                project=> (
                                    <div
                                        className= "project-card"
                                        key= {project.id}
                                    >
                                    
                                        <h2>
                                            <Link to= {`/admin/projects/${project.id}`}>
                                                {project.name}
                                            </Link>
                                        </h2>
                                        <p>{project.description}</p>
                                        <span className= "status">{project.status}</span>

                                        <div className= "project-date">

                                            <p>Start:{" "} {project.start_date}</p>
                                            <p>End:{" "} {project.end_date}</p>
                                        </div>

                                        <div className= "actions">

                                            <Link to= {`/admin/projects/${project.id}`}>View Details</Link>
                                            <Link to= {`/admin/projects/edit/${project.id}`}>Edit</Link>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                )
            }

            <div className= "pagination">

                <button
                    disabled= {pagination.page === 1}
                    onClick= {()=> fetchProjects(pagination.page - 1)}
                >
                    Previous
                </button>

                <span> Page {pagination.page} {" "} of {" "} {pagination.total_pages}</span>

                <button 
                    disabled= {pagination.page === pagination.total_pages}
                    onClick= {()=> fetchProjects(pagination.page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}


export default AdminProjects;