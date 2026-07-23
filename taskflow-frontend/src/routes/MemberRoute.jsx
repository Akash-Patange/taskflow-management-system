import { Routes, Route } from "react-router-dom";

import MemberLayout from "../member/layouts/MemberLayouts";

import MemberDashboard from "../member/pages/MemberDashboard";
import MemberTasks from "../member/pages/MemberTasks";
import MemberTaskDetails from "../member/pages/MemberTaskDetails";
import MemberProfile from "../member/pages/MemberProfile";


function MemberRoutes() {

    return (
    
    <Routes>

            <Route
                path= "/"
                element= {<MemberLayout />}
            >

                <Route
                    index
                    element= {<MemberDashboard />}
                />

                <Route
                    path= "tasks"
                    element= {<MemberTasks />}
                />

                <Route
                    path= "tasks/:id"
                    element= {<MemberTaskDetails />}
                />

                <Route
                    path= "profile"
                    element= {<MemberProfile />}
                />
            </Route>
        </Routes>
    );
}

export default MemberRoutes;