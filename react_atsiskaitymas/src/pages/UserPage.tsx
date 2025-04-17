import { useEffect, useState } from "react";
import { CardType } from "../../src/types/CardType";
import { useAuth } from "../../src/contexts/AuthContext";

export const UserPage = () => {
  const { user } = useAuth();
  const [savedCards, setSavedCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      if (!user) return;
      try {
        const response = await fetch(`http://localhost:8080/savedCards?userId=${user.id}`);
        const data = await response.json();
        setSavedCards(data);
      } catch (error) {
        console.error("Klaida gaunant išsaugotas korteles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedCards();
  }, [user]);

  if (!user) {
    return (
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Reikia būti prisijungusiam!</h1>
      </section>
    );
  }

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Mano Išsaugotos Kortelės</h1>

      {isLoading ? (
        <p>Kraunama...</p>
      ) : savedCards.length === 0 ? (
        <p>Neturite išsaugotų kortelių.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {savedCards.map((card) => (
            <div key={card.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
              <h3>{card.title}</h3>
              {card.image && <img src={card.image} alt={card.title} style={{ width: "100%" }} />}
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
