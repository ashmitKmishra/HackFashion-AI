import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    isAuthenticated && (
      <motion.div 
        className="profile-container"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={user.picture} alt={user.name} className="profile-avatar" />
        <div className="profile-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      </motion.div>
    )
  );
};

export default Profile;
