import { Routes, Route } from "react-router-dom";

import AdminLayout from "../admin/layouts/AdminLayout";

import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminProjects from "../admin/pages/AdminProjects";
import AdminProjectDetails from "../admin/pages/AdminProjectsDetails";
import AdminUsers from "../admin/pages/AdminUsers";
import AdminTasks from "../admin/pages/AdminTasks";
import AdminComments from "../admin/pages/AdminComment";
import AdminProjectEdit from "../admin/pages/AdminProjectEdit";
import AdminTaskEdit from "../admin/pages/AdminTaskEdit";
import AdminSettings from "../admin/pages/AdminSettings";

function AdminRoutes(){

    return (

        <Routes>

            <Route 
                path= "/"
                element= {<AdminLayout />}
            >
            
                <Route
                    index
                    element= {<AdminDashboard />}
                />


                <Route
                    path= "projects"
                    element= {<AdminProjects />}
                />


                <Route
                    path= "projects/:id"
                    element= {<AdminProjectDetails />}
                />


                <Route
                    path= "projects/edit/:id"
                    element= {<AdminProjectEdit />}
                />


                <Route
                    path= "users"
                    element= {<AdminUsers />}
                /> 


                <Route
                    path= "tasks"
                    element= {<AdminTasks />}
                />


                <Route
                    path= "tasks/edit/:id"
                    element= {<AdminTaskEdit />}
                />


                <Route
                    path= "comments"
                    element= {<AdminComments />}
                />


                <Route
                    path= "settings"
                    element= {<AdminSettings />}
                />
            </Route>
        </Routes>
    );
}

export default AdminRoutes;