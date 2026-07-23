import { Outlet } from "react-router-dom";

import MemberNavbar from "../components/MemberNavbar";

import "../styles/memberLayout.css";

function MemberLayout() {
    return (
        <>
            <MemberNavbar />
            <main className= "member-container">
                <Outlet />
            </main>
        </>
    );
}

export default MemberLayout;