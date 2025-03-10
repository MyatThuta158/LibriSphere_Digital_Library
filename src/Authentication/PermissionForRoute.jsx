import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Auth";

function PermissionForRoute({ role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!role.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

PermissionForRoute.propTypes = {
  role: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PermissionForRoute;
