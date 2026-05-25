import React, { useState, useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Preloader from "./components/Preloader/Preloader";
import NotificationPopup from "./components/Notification/NotificationPopup";
import ActiveJobPanel from "./components/Notification/ActiveJobPanel";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        {loading && <Preloader />}
        <NotificationPopup />
        <ActiveJobPanel />
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;