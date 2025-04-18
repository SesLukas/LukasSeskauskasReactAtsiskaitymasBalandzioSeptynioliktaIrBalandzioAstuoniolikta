import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { User } from "../../src/types/User";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const users = await response.json();

      const user = users.find((user: User) => user.email.toLowerCase() === values.email.toLowerCase());

      if (!user) {
        throw new Error("Neteisingas el. paštas arba slaptažodis");
      }

      const isPasswordCorrect = values.password === user.password;

      if (!isPasswordCorrect) {
        throw new Error("Neteisingas el. paštas arba slaptažodis");
      }

      login(user);
      setSuccess("Sėkmingai prisijungėte!");
      setError(null);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Prisijungimas nesėkmingas. Neteisingas el. paštas arba slaptažodis");
      setSuccess(null);
    }
  };

  return (
    <section style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px",
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Prisijungimas</h2>

        {error && <div style={{ color: "red", marginBottom: "1rem", fontSize: "1.1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "1rem", fontSize: "1.1rem" }}>{success}</div>}

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            handleLogin(values);
          }}
        >
          {() => (
            <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label htmlFor="email">El. paštas</label>
                <Field id="email" name="email" type="email" style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }} />
                <ErrorMessage name="email" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
              </div>

              <div>
                <label htmlFor="password">Slaptažodis</label>
                <Field id="password" name="password" type="password" style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }} />
                <ErrorMessage name="password" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
              </div>

              <button type="submit" style={{
                marginTop: "1rem",
                padding: "0.5rem",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}>
                Prisijungti
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};
