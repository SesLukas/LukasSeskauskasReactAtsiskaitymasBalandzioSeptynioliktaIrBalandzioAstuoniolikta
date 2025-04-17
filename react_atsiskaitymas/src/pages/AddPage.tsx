import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { useAuth } from "../../src/contexts/AuthContext";

const addCardSchema = Yup.object({
  title: Yup.string().required("Privalomas pavadinimas"),
  description: Yup.string().required("Privalomas aprašymas"),
  image: Yup.string().url("Turi būti tinkamas URL adresas").optional(),
});

export const AddPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Reikia būti prisijungusiam!</h1>
      </section>
    );
  }

  const handleAddCard = async (values: { title: string; description: string; image?: string }) => {
    try {
      const newCard = {
        ...values,
        createdAt: new Date().toISOString(),
        userId: user.id,
      };

      await fetch("http://localhost:8080/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard),
      });

      navigate("/");
    } catch (error) {
      console.error("Klaida sukuriant kortelę:", error);
    }
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Pridėti Naują Kortelę</h1>
      <Formik
        initialValues={{ title: "", description: "", image: "" }}
        validationSchema={addCardSchema}
        onSubmit={handleAddCard}
      >
        {() => (
          <Form style={{ display: "flex", flexDirection: "column", maxWidth: "400px", gap: "1rem" }}>
            <label>Pavadinimas:</label>
            <Field name="title" />
            <ErrorMessage name="title" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Aprašymas:</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <label>Paveiksliuko URL (nebūtinas):</label>
            <Field name="image" />
            <ErrorMessage name="image" render={(msg) => <div style={{ color: "red" }}>{msg}</div>} />

            <button type="submit">Sukurti</button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
