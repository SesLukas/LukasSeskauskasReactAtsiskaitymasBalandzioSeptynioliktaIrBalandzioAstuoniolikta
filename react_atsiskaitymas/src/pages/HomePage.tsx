import { useEffect, useState } from "react";
import { CardType } from "../types/CardType";
import { CardItem } from "../../src/components/UI/molecules/CardItem";

export const HomePage = () => {
    const [cards, setCards] = useState<CardType[]>([]); // ← čia!
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchCards = async () => {
        setLoading(true);
        try {
          const response = await fetch("http://localhost:8080/cards");
          const data = await response.json();
          setCards(data);
        } catch (error) {
          console.error("Klaida gaunant korteles:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCards();
    }, [location.pathname]);
  
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <img
            src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
            alt="Kraunama..."
            style={{ width: "100px" }}
          />
        </div>
      );
    }
  
    if (cards.length === 0) {
      return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Šiuo metu nėra įrašų.</p>
        </div>
      );
    }
  
    return (
      <section style={{ display: "flex", flexWrap: "wrap", gap: "1rem", padding: "2rem" }}>
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </section>
    );
  };