import { MemoryRouter } from "react-router";
import { AppRoutes } from "./routes/Approutes";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/UI/organisms/NavBar";
import { Footer } from "./components/UI/organisms/Footer";

function App() {
  return (
    <AuthProvider>
      <MemoryRouter>
        <Navbar />
        <main>
          <AppRoutes />
        </main>
        <Footer />
      </MemoryRouter>
    </AuthProvider>
  );
}

export default App;
