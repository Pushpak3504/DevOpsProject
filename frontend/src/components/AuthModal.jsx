import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useAuth();

  const submit = async () => {
    if (mode === "signup") {
      await api.post("/signup", form);
    }
    const res = await api.post("/login", form);
    login(res.data);
    onClose();
  };

  return (
    <div className="overlay">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="glass auth-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
        >
          <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>

          {mode === "signup" && (
            <input
              placeholder="Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button onClick={submit}>
            {mode === "login" ? "Login" : "Sign Up"}
          </button>

          <p onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login"
              ? "New here? Create an account"
              : "Already have an account?"}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
