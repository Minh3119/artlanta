import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const CurrentUserProfilePage = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:9999/backend/api/current-user', {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                console.log("Response status:", response.status);
                
                const data = await response.json();
                console.log("Response data:", data);

                if (!response.ok) {
                    console.log("Response not ok:", response.status, data.error);
                    throw new Error(data.error || 'Not logged in');
                }

                if (data.error) {
                    console.log("Data contains error:", data.error);
                    throw new Error(data.error);
                }

                setCurrentUser(data.response);
            } catch (err) {
                console.log("Error caught:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    // Check for any error that indicates user is not logged in
    if (error === 'Not logged in' || error === 'No user logged in') {
        console.log("Redirecting to login due to:", error);
        return <Navigate to="/login" replace />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        console.log("No current user, redirecting to login");
        return <Navigate to="/login" replace />;
    }

    console.log("Redirecting to user profile:", currentUser.id);
    return <Navigate to={`/user/${currentUser.id}`} replace />;
};

export default CurrentUserProfilePage; 