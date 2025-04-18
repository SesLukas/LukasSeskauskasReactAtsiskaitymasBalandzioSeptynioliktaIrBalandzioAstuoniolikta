import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { User } from "../types/User"; // pataisiau kelią

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  avatar?: string;
};

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "Vardas per trumpas!")
    .required("Vardas yra privalomas"),
  lastName: Yup.string()
    .min(2, "Pavardė per trumpa!")
    .required("Pavardė yra privaloma"),
  email: Yup.string()
    .email("Neteisingas el. pašto formatas")
    .required("El. paštas yra privalomas"),
  username: Yup.string()
    .min(3, "Vartotojo vardas per trumpas")
    .required("Vartotojo vardas yra privalomas"),
  birthDate: Yup.date()
    .min(new Date(1900, 0, 1), "Gimimo data negali būti ankstesnė nei 1900")
    .required("Gimimo data yra privaloma"),
  password: Yup.string()
    .min(8, "Slaptažodis turi būti bent 8 simbolių ilgumo")
    .matches(/[A-Z]/, "Bent viena didžioji raidė privaloma")
    .matches(/[a-z]/, "Bent viena mažoji raidė privaloma")
    .matches(/[0-9]/, "Bent vienas skaičius privalomas")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Bent vienas specialus simbolis privalomas")
    .required("Slaptažodis yra privalomas"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Slaptažiai nesutampa")
    .required("Būtina pakartoti slaptažodį"),
});

const handleRegister = async (
  values: RegisterFormValues,
  setError: (msg: string | null) => void,
  setSuccess: (msg: string | null) => void,
  login: (user: User) => void,
  navigate: (path: string) => void
) => {
  try {
    const response = await fetch("http://localhost:8080/users");
    const users: User[] = await response.json();

    const emailExists = users.some((user) => user.email.toLowerCase() === values.email.toLowerCase());
    const usernameExists = users.some((user) => user.username.toLowerCase() === values.username.toLowerCase());

    if (emailExists) {
      throw new Error("Toks el. paštas jau egzistuoja!");
    }
    if (usernameExists) {
      throw new Error("Toks vartotojo vardas jau egzistuoja!");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(values.password, salt);

    const newUser = {
      id: Date.now(),
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      username: values.username,
      birthDate: values.birthDate,
      avatar: values.avatar || "https://img.icons8.com/nolan/600w/user-default.png",
      password: values.password,
      passwordHash: hashedPassword,
    };

    const createUser = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!createUser.ok) {
      throw new Error("Nepavyko sukurti vartotojo!");
    }

    const createdUser = await createUser.json();
    login(createdUser);
    setSuccess("Registracija sėkminga!");
    setError(null);

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      setError(err.message || "Registracija nesėkminga!");
      setSuccess(null);
    } else {
      console.error(err);
      setError("Registracijos klaida. Bandykite vėliau.");
      setSuccess(null);
    }
  }
};

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <section style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Registracija</h2>

      {error && <div style={{ color: "red", marginBottom: "1rem", fontSize: "1.2rem" }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: "1rem", fontSize: "1.2rem" }}>{success}</div>}

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          birthDate: "",
          password: "",
          confirmPassword: "",
          avatar: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleRegister(values, setError, setSuccess, login, navigate)}
      >
        {({ validateForm, submitForm }) => (
          <Form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="firstName">Vardas</label>
              <Field id="firstName" name="firstName" />
              <ErrorMessage name="firstName" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="lastName">Pavardė</label>
              <Field id="lastName" name="lastName" />
              <ErrorMessage name="lastName" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="email">El. paštas</label>
              <Field id="email" name="email" type="email" />
              <ErrorMessage name="email" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="username">Vartotojo vardas</label>
              <Field id="username" name="username" />
              <ErrorMessage name="username" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="birthDate">Gimimo data</label>
              <Field id="birthDate" name="birthDate" type="date" />
              <ErrorMessage name="birthDate" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="password">Slaptažodis</label>
              <Field id="password" name="password" type="password" />
              <ErrorMessage name="password" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="confirmPassword">Pakartokite slaptažodį</label>
              <Field id="confirmPassword" name="confirmPassword" type="password" />
              <ErrorMessage name="confirmPassword" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />
            </div>
            <div>
              <label htmlFor="avatar">Avataro nuoroda (nebūtina)</label>
              <Field id="avatar" name="avatar" />
            </div>
            <button
              type="button"
              onClick={async () => {
                const errors = await validateForm();
                if (Object.keys(errors).length > 0) {
                  setError("Registracija nesėkminga!");
                  setSuccess(null);
                } else {
                  submitForm();
                }
              }}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Registruotis
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};