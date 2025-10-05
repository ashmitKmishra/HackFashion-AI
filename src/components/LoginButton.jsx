import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { motion } from "framer-motion";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <motion.button 
      className="btn-auth btn-login"
      onClick={() => loginWithRedirect()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Log In
    </motion.button>
  );
};

export default LoginButton;
