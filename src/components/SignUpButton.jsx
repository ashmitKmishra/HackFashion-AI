import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { motion } from "framer-motion";

const SignUpButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <motion.button 
      className="btn-auth btn-signup"
      onClick={() => loginWithRedirect({ 
        authorizationParams: {
          screen_hint: "signup",
        }
      })}
      whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6, 182, 212, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      Sign Up
    </motion.button>
  );
};

export default SignUpButton;
