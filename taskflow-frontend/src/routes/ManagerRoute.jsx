import { Routes, Route } from "react-router-dom";

import ManagerLayout from "../manager/layouts/ManagerLayout";

import ManagerDashboard from "../manager/pages/ManagerDashboard";
import ManagerProjects from "../manager/pages/ManagerProjects";
import ManagerCreateProject from "../manager/pages/ManagerCreateProject";
import ManagerEditProject from "../manager/pages/ManagerEditProjects";
import ManagerProjectDetails from "../manager/pages/ManagerProjectDetails";
import AssignMembers from "../manager/pages/AssignMembers"
import CreateTasks from "../manager/pages/CreateTasks";
import EditTask from "../manager/pages/EditTasks";
import MyTasks from "../manager/pages/MyTasks";
import ManagerTaskDetails from "../manager/pages/ManagerTaskDetails";

function ManagerRoutes() {

    return (
    
        <Routes>

            <Route
                path= "/"
                element= {<ManagerLayout />}
            >

                <Route
                    index
                    element= {<ManagerDashboard />}
                />

                <Route
                    path= "projects"
                    element= {<ManagerProjects />}
                />

                <Route
                    path= "projects/create"
                    element= {<ManagerCreateProject />}
                />

                <Route
                    path= "projects/edit/:id"
                    element= {<ManagerEditProject />}
                />

                <Route
                    path= "projects/:id"
                    element= {<ManagerProjectDetails />}
                />

                <Route
                    path= "projects/:id/members"
                    element= {<AssignMembers />}
                />

                <Route
                    path= "tasks"
                    element= {<MyTasks />}
                />

                <Route
                    path= "projects/:id/tasks/create"
                    element= {<CreateTasks />}
                />

                <Route
                    path= "tasks/edit/:id"
                    element= {<EditTask />}
                />

                <Route
                    path= "tasks/:id"
                    element= {<ManagerTaskDetails />}
                />
            </Route>
        </Routes>
    );
}

export default ManagerRoutes;