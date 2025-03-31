import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { loadMe } from "../../lib/UserService"; 

interface ProtectedRouteAdminProps {
    children: React.ReactNode;
}

const ProtectedRouteAdmin: React.FC<ProtectedRouteAdminProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const userData = await loadMe();

            if (!userData || !userData.roles?.includes("ROLE_ADMIN")) {
                setIsAuthorized(false);
                return;
            }

            setIsAuthorized(true);
        };

        checkAdmin();
    }, []);

    if (isAuthorized === null) {
        return <p className="text-center mt-4">Vérification en cours...</p>;
    }

    if (!isAuthorized) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRouteAdmin;