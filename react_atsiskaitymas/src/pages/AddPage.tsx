import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../src/contexts/AuthContext";
import { useNavigate } from "react-router";
import { CardType } from "../../src/types/CardType";
import "./AddPage.css";

export const AddPage = () => {
  const { loggedInUser } = useAuth();
  const navigate = useNavigate();

  if (!loggedInUser) {
    return (
      <section className="add-page">
        <h1>Reikia būti prisijungusiam!</h1>
      </section>
    );
  }

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, "Pavadinimas per trumpas")
      .required("Pavadinimas yra privalomas"),
    description: Yup.string()
      .min(5, "Aprašymas per trumpas")
      .required("Aprašymas yra privalomas"),
    image: Yup.string().url("Turi būti tinkamas URL"),
  });

  const handleAddCard = async (values: Omit<CardType, "id" | "createdAt" | "userId">) => {
    const newCard: CardType = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: loggedInUser.id,
      ...values,
    };

    await fetch("http://localhost:8080/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    });

    navigate("/");
  };

  return (
    <section className="add-page">
      <h2>Pridėti naują kortelę</h2>

      <Formik
        initialValues={{
          title: "",
          description: "",
          image: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddCard}
      >
        <Form className="add-form">
          <div>
            <label htmlFor="title">Pavadinimas</label>
            <Field name="title" placeholder="Pavadinimas" />
            <ErrorMessage name="title" component="div" className="error-message" />
          </div>

          <div>
            <label htmlFor="description">Aprašymas</label>
            <Field
              name="description"
              as="textarea"
              placeholder="Aprašymas"
              rows={5}
              className="description-field"
            />
            <ErrorMessage name="description" component="div" className="error-message" />
          </div>

          <div>
            <label htmlFor="image">Nuotraukos nuoroda (nebūtina)</label>
            <Field name="image" placeholder="Nuotraukos URL" />
            <ErrorMessage name="image" component="div" className="error-message" />
          </div>

          <button type="submit" className="submit-button">
            Pridėti kortelę
          </button>
        </Form>
      </Formik>
    </section>
  );
};
