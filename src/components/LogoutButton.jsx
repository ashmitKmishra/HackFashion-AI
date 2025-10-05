import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { motion } from "framer-motion";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <motion.button 
      className="btn-auth btn-logout"
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Log Out
    </motion.button>
  );
};

export default LogoutButton;
