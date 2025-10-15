"use client";

import { useAuth } from "@clerk/react-router";
import { Navigate, Outlet } from "react-router";

export const Protected = () => {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) {
        return null;
    }

    if (!isSignedIn) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};
