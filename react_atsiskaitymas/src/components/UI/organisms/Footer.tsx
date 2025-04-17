export const Footer = () => {
    return (
      <footer style={{
        padding: "2rem",
        borderTop: "1px solid #ccc",
        textAlign: "center",
        fontSize: "0.9rem",
        backgroundColor: "#f8f8f8",
        marginTop: "2rem"
      }}>
        <div>
          <p>© {new Date().getFullYear()} Sukūrė Lukas Šeškauskas</p>
        </div>
  
        <div style={{ margin: "1rem 0", display: "flex", justifyContent: "center", gap: "1.5rem" }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" style={{ width: "24px", height: "24px" }} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" style={{ width: "24px", height: "24px" }} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg" alt="Twitter" style={{ width: "24px", height: "24px" }} />
          </a>
        </div>
  
        <div style={{ color: "#555" }}>
          <span style={{ margin: "0 0.5rem" }}>Cookies</span>|
          <span style={{ margin: "0 0.5rem" }}>Privacy Policy</span>|
          <span style={{ margin: "0 0.5rem" }}>Terms and Uses</span>
        </div>
      </footer>
    );
  };
  