import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../src/contexts/AuthContext";
import { User } from "../../src/types/User";
import { useNavigate } from "react-router";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const loginSchema = Yup.object({
    email: Yup.string().email("Netinkamas el. paštas").required("El. paštas būtinas"),
    password: Yup.string().required("Slaptažodis būtinas"),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const users: User[] = await response.json();
  
      const foundUser = users.find(
        (u) => u.email === values.email && u.password === values.password
      );
  
      if (foundUser) {
        login(foundUser);
        setNotification({ message: "✅ Prisijungimas sėkmingas!", type: "success" });
  
        setTimeout(() => {
          navigate("/");
        }, 1500); 
      } else {
        setNotification({ message: "❌ Neteisingas el. paštas arba slaptažodis.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setNotification({ message: "❌ Įvyko klaida prisijungiant. Bandykite vėliau.", type: "error" });
    }
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Prisijungimas</h1>

      {notification && (
  <div
    style={{
      color: notification.type === "success" ? "green" : "red",
      marginBottom: "1rem",
    }}
  >
    {notification.message}
  </div>
)}
      <Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={loginSchema}
  onSubmit={handleLogin}
>
  {({ validateForm, submitForm }) => (
    <Form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <div>
        <label htmlFor="email">El. paštas</label>
        <Field id="email" name="email" type="email" />
        <ErrorMessage name="email">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
      </div>

      <div>
        <label htmlFor="password">Slaptažodis</label>
        <Field id="password" name="password" type="password" />
        <ErrorMessage name="password">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
      </div>

      <button
        type="button"
        onClick={async () => {
          const errors = await validateForm();
          if (Object.keys(errors).length > 0) {
            setNotification({ message: "❌ Nepavyko prisijungti!", type: "error" });
          } else {
            submitForm();
          }
        }}
      >
        Prisijungti
      </button>
    </Form>
  )}
</Formik>
    </section>
  );
};
