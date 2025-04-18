import { Link, useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";

export const Navbar = () => {
  const { loggedInUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/">
            <img
              src="https://w7.pngwing.com/pngs/241/817/png-transparent-weather-forecasting-wet-season-weather-text-hand-logo.png"
              alt="Logo"
              style={{ height: "40px" }}
            />
          </Link>
          <Link to="/">Home</Link>
          {loggedInUser && <Link to="/add">Add</Link>}
          {loggedInUser && <Link to="/user">Saved</Link>}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {loggedInUser ? (
            <>
              <Link to="/user" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "inherit" }}>
                <img
                  src={loggedInUser.avatar || "https://img.icons8.com/nolan/600w/user-default.png"}
                  alt="User Avatar"
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <span>{loggedInUser.firstName} {loggedInUser.lastName}</span>
              </Link>
              <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>
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
