import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../../src/contexts/AuthContext";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useState } from "react";
import { User } from "../../src/types/User";

const loginValidationSchema = Yup.object({
  email: Yup.string().email("Netinkamas el. paštas").required("Privaloma"),
  password: Yup.string().required("Privaloma"),
});

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const users: User[] = await response.json();

      const foundUser = users.find(
        (u) => u.email === values.email && u.password === values.password
      );

      if (foundUser) {
        login(foundUser);
        navigate("/");
      } else {
        setError("Neteisingas el. paštas arba slaptažodis.");
      }
    } catch (err) {
      console.error(err);
      setError("Įvyko klaida prisijungiant. Bandykite vėliau.");
    }
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Prisijungimas</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {() => (
          <Form style={{ display: "flex", flexDirection: "column", maxWidth: "300px", gap: "1rem" }}>
            <label>El. paštas:</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email"
            render={msg => <div style={{ color: "red" }}>{msg}</div>}
/>

            <label>Slaptažodis:</label>
            <Field name="password" type="password" />
            <ErrorMessage
  name="password"
  render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
/>

            <button type="submit">Prisijungti</button>

            {error && <div style={{ color: "red" }}>{error}</div>}
          </Form>
        )}
      </Formik>
    </section>
  );
};
