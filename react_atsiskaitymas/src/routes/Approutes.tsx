import { Routes, Route, Navigate } from "react-router";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AddPage } from "../pages/AddPage";
import { UserPage } from "../pages/UserPage";
import { useAuth } from "../contexts/AuthContext";

export const AppRoutes = () => {
  const { loggedInUser  } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {loggedInUser && (
        <>
          <Route path="/add" element={<AddPage />} />
          <Route path="/user" element={<UserPage />} />
        </>
      )}
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
