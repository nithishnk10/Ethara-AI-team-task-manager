import { Navigate } from "react-router-dom";

function ProtectedRoute({
    children,
    allowedRole
}) {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Not logged in
    if (!user) {

        return <Navigate to="/login" />;

    }

    // Wrong role
    if (user.role !== allowedRole) {

        return (
            <Navigate
                to={
                    user.role === "admin"
                        ? "/admin"
                        : "/member"
                }
            />
        );

    }

    return children;

}

export default ProtectedRoute;