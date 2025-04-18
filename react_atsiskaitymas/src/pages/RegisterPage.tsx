import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import bcrypt from "bcryptjs";
import { useAuth } from "../../src/contexts/AuthContext";
import { useNavigate } from "react-router";
import { User } from "../../src/types/User";
import { RegisterFormValues } from "../../src/types/RegisterFormValues";
import "./RegisterPage.css";

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
    .oneOf([Yup.ref("password")], "Slaptažodžių nesutapimas")
    .required("Būtina pakartoti slaptažodį"),
});

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (values: RegisterFormValues) => {
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

      const newUser: User = {
        id: Date.now().toString(),
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
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setError("Registracija nesėkminga!");
      setSuccess(null);
    }
  };

  return (
    <section className="register-page">
      <h2 className="register-title">Registracija</h2>

      {error && <div className="notification error">{error}</div>}
      {success && <div className="notification success">{success}</div>}

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
        onSubmit={() => {}}
      >
        {(formik) => (
          <Form noValidate className="register-form">
            {/* Laukai */}
            <label htmlFor="firstName">Vardas</label>
            <Field name="firstName" placeholder="Vardas" />
            <ErrorMessage name="firstName" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="lastName">Pavardė</label>
            <Field name="lastName" placeholder="Pavardė" />
            <ErrorMessage name="lastName" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="email">El. paštas</label>
            <Field name="email" placeholder="El. paštas" type="email" />
            <ErrorMessage name="email" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="username">Vartotojo vardas</label>
            <Field name="username" placeholder="Vartotojo vardas" />
            <ErrorMessage name="username" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="birthDate">Gimimo data</label>
            <Field name="birthDate" type="date" />
            <ErrorMessage name="birthDate" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="password">Slaptažodis</label>
            <Field name="password" placeholder="Slaptažodis" type="password" />
            <ErrorMessage name="password" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="confirmPassword">Pakartokite slaptažodį</label>
            <Field name="confirmPassword" placeholder="Pakartokite slaptažodį" type="password" />
            <ErrorMessage name="confirmPassword" render={(msg) => <div className="error-message">{msg}</div>} />

            <label htmlFor="avatar">Avataro nuoroda (nebūtina)</label>
            <Field name="avatar" placeholder="Avataro URL (nebūtinas)" />

            <button
              type="button"
              className="register-button"
              onClick={async () => {
                const errors = await formik.validateForm();
                if (Object.keys(errors).length > 0) {
                  setError("Registracija nesėkminga!");
                  setSuccess(null);
                  return;
                }
                handleRegister(formik.values);
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
