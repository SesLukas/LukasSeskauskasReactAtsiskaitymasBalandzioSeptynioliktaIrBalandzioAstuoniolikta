import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Kairė pusė - Logotipas ir Home */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/">Logo</Link>
          <Link to="/">Home</Link>
          {user && <Link to="/add">Add</Link>}
        </div>

        {/* Dešinė pusė - Vartotojo info arba Login/Register */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {user ? (
            <>
              <img
                src={user.avatar || "https://via.placeholder.com/40"}
                alt="User Avatar"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <span>{user.fullName}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
