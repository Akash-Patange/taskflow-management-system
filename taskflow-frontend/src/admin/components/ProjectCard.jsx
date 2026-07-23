import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import "../styles/ProjectCard";


function ProjectCard({project}) {


    return (

        <div className= "project-card">

            <div className= "project-header">

                <h3>{project.name}</h3>
                <StatusBadge status= {project.status}/>
            </div>

            <div className= "project-info">

                <p><strong>Manager:</strong>{" "}{project.manager || "Not Assigned"}</p>
                <p><strong>Start:</strong>{" "}{project.start_date || "-"}</p>
                <p><strong>End:</strong>{" "}{project.end_date || "-"}</p>
            </div>

            <div className= "card-actions">
                
                <Link
                    className= "view-btn"
                    to= {`/admin/projects/${project.id}`}
                >
                    View
                </Link>

                <button 
                    className= "edit-btn"
                >
                    Edit
                </button>

                <button 
                    className= "delete-btn"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;