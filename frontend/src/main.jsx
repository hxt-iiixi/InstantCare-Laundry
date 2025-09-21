import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import Home from './pages/Home';
import { motion } from 'framer-motion';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}><RegisterPage /></motion.div>} />
        <Route path="/login" element={<motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}><LoginPage /></motion.div>} />
        <Route
          path="/dashboard"
          render={() => (token ? <DashboardPage /> : <Redirect to="/login" />)}
        />
      </Routes>
    </Router>
  </StrictMode>
);
