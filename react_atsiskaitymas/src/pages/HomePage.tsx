import { useEffect, useState } from "react";
import { CardList } from "../../../react_atsiskaitymas/src/components/UI/organisms/CardList";
import { Loader } from "../../src/components/UI/atoms/Loader";
import { CardType } from "../../src/types/CardType";

export const HomePage = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:8080/cards");
        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error("Klaida gaunant korteles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  return (
    <section style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Visos Kortelės</h1>

      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Loader />
        </div>
      ) : cards.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p>Šiuo metu nėra jokių kortelių.</p>
        </div>
      ) : (
        <CardList cards={cards} />
      )}
    </section>
  );
};
