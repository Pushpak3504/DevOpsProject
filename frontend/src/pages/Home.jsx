import { useState } from "react";
import { motion } from "framer-motion";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      {/* Top-right login button */}
  <div className="top-right">
    {!user ? (
      <button onClick={() => setOpen(true)}>
        Login / Signup
      </button>
    ) : (
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Logout
      </button>
    )}
  </div>

      {/* Center hero */}
      <div className="center">
        <motion.div
          className="glass hero"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <h1>
            {user
              ? `${greeting()}, ${user.name} 👋`
              : "Welcome ✨"}
          </h1>

          <p>
            {user
              ? "You’re securely logged in. 🚀 CI/CD working!"
              : "Experience a modern authentication flow. 🚀 CI/CD working!"}
          </p>
        </motion.div>
      </div>

      {/* Auth modal */}
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
