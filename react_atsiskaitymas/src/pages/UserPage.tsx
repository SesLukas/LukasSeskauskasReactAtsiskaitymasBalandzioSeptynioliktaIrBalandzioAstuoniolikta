import { useEffect, useState } from "react";
import { CardType } from "../../src/types/CardType";

export const UserPage = () => {
  const [savedCards, setSavedCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        const savedResponse = await fetch("http://localhost:8080/savedCards");
        const saved = await savedResponse.json();

        const cardIds = saved.map((item: { cardId: string }) => item.cardId);

        const cardsResponse = await fetch("http://localhost:8080/cards");
        const allCards = await cardsResponse.json();

        const filteredCards = allCards.filter((card: CardType) =>
          cardIds.includes(card.id)
        );

        setSavedCards(filteredCards);
      } catch (error) {
        console.error("Klaida gaunant išsaugotas korteles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedCards();
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <img
          src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
          alt="Kraunasi..."
          style={{ width: "100px" }}
        />
      </div>
    );
  }

  if (savedCards.length === 0) {
    return (
      <section style={{ padding: "2rem", textAlign: "center" }}>
        <p>❌ Nėra išsaugotų įrašų.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "2rem" }}>
      <h1>Išsaugotos kortelės</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
        {savedCards.map((card) => (
          <div key={card.id} style={{ border: "1px solid #ccc", padding: "1rem", width: "300px" }}>
            <h3>{card.title}</h3>
            {card.image && (
              <img
                src={card.image}
                alt={card.title}
                style={{ width: "100%", objectFit: "cover", marginBottom: "0.5rem" }}
              />
            )}
            <p>{card.description}</p>
            <small>Sukurta: {new Date(card.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </section>
  );
};
