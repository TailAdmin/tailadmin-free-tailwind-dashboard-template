import React from 'react';
import { Navigate } from 'react-router-dom';
import auth, { getUserRole } from '../utils/auth';
import { UserRole } from '../models/roles';

interface ProtectedRouteProps {
	children: React.ReactNode;
	requiredRole?: UserRole | string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
	if (!auth.isAuthenticated()) {
		return <Navigate to="/auth/login" replace />;
	}

	if (requiredRole) {
		const userRole = getUserRole();
		if (userRole !== requiredRole) {
			return <Navigate to="/dashboard" replace />;
		}
	}

	return <>{children}</>;
};

export default ProtectedRoute;
