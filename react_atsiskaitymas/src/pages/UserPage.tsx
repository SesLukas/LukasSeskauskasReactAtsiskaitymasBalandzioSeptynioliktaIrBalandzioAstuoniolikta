import { useEffect, useState } from "react";
import { useAuth } from "../../src/contexts/AuthContext";
import { CardType } from "../../src/types/CardType";

export const UserPage = () => {
  const { user } = useAuth();
  const [savedCards, setSavedCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      if (!user) return;

      try {
        const savedResponse = await fetch(`http://localhost:8080/savedCards?userId=${user.id}`);
        const saved = await savedResponse.json();

        const cardIds = saved.map((item: { cardId: number }) => item.cardId);

        const cardsResponse = await fetch("http://localhost:8080/cards");
        const allCards = await cardsResponse.json();

        const filteredCards = allCards.filter((card: CardType) => cardIds.includes(card.id));

        setSavedCards(filteredCards);
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
      <h1>Mano išsaugotos kortelės</h1>

      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <img src="/loading.gif" alt="Kraunasi..." style={{ width: "50px" }} />
          <p>Kraunama...</p>
        </div>
      ) : savedCards.length === 0 ? (
        <p>❌ Nėra išsaugotų įrašų.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {savedCards.map((card) => (
            <div key={card.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
              <h3>{card.title}</h3>
              {card.image && <img src={card.image} alt={card.title} style={{ width: "100%" }} />}
              <p>{card.description}</p>
              <small>Sukurta: {new Date(card.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

