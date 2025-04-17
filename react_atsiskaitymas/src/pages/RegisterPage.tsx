import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../src/contexts/AuthContext";
import { User } from "../../src/types/User";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDate: string;
  password: string;
  avatar?: string;
};

const registerSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Vardas turi būti bent 2 simboliai")
    .matches(/^[A-Za-zÀ-ž\s'-]+$/, "Vardas gali turėti tik raides")
    .required("Vardas būtinas"),
  lastName: Yup.string()
    .min(2, "Pavardė turi būti bent 2 simboliai")
    .matches(/^[A-Za-zÀ-ž\s'-]+$/, "Pavardė gali turėti tik raides")
    .required("Pavardė būtina"),
  email: Yup.string()
    .email("Netinkamas el. paštas")
    .required("El. paštas būtinas"),
  username: Yup.string()
    .min(3, "Vartotojo vardas turi būti bent 3 simboliai")
    .required("Vartotojo vardas būtinas"),
  birthDate: Yup.string()
    .required("Gimimo data būtina"),
  password: Yup.string()
    .required("Slaptažodis būtinas")
    .min(8, "Slaptažodis turi būti bent 8 simbolių")
    .matches(/[A-Z]/, "Turi būti bent viena didžioji raidė")
    .matches(/[a-z]/, "Turi būti bent viena mažoji raidė")
    .matches(/[0-9]/, "Turi būti bent vienas skaičius")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Turi būti bent vienas specialus simbolis"),
});

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const users: User[] = await response.json();

      const emailExists = users.some((u) => u.email === values.email);
      const usernameExists = users.some((u) => u.username === values.username);

      if (emailExists || usernameExists) {
        setError("Toks el. paštas arba vartotojo vardas jau užimtas.");
        return;
      }

      const newUser = {
        ...values,
        fullName: `${values.firstName} ${values.lastName}`,
        avatar: values.avatar || "https://img.icons8.com/nolan/600w/user-default.png", 
        passwordHash: values.password,
      };

      const createUser = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const createdUser = await createUser.json();
      login(createdUser);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Registracijos klaida. Bandykite vėliau.");
    }
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Registracija</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          birthDate: "",
          password: "",
          avatar: ""
        }}
        validationSchema={registerSchema}
        onSubmit={handleRegister}
      >
        {() => (
          <Form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
            <label>Vardas:</label>
            <Field name="firstName" />
            <ErrorMessage name="firstName" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Pavardė:</label>
            <Field name="lastName" />
            <ErrorMessage name="lastName" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>El. paštas:</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Vartotojo vardas:</label>
            <Field name="username" />
            <ErrorMessage name="username" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Gimimo data:</label>
            <Field name="birthDate" type="date" />
            <ErrorMessage name="birthDate" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Slaptažodis:</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Avataro URL (nebūtinas):</label>
            <Field name="avatar" />

            <button type="submit">Registruotis</button>

            {error && <div style={{ color: "red" }}>{error}</div>}
          </Form>
        )}
      </Formik>
    </section>
  );
};
