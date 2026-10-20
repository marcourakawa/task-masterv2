import { Navigate, Outlet } from "react-router-dom";

function GuestRoute() {
    const accessToken = sessionStorage.getItem('access');

    if (accessToken) {
        return <Navigate to='/tasks' replace />;
    }

    return <Outlet />
}

export default GuestRoute;


