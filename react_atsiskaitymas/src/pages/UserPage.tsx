import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { CardItem } from "../components/UI/molecules/CardItem";
import { CardType } from "../types/CardType";
import { SavedCard } from "../types/SavedCard";
import "./UserPage.css";

export const UserPage = () => {
  const { loggedInUser } = useAuth();
  const [savedCards, setSavedCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedCards = async () => {
      if (!loggedInUser) return;
      try {
        const savedResponse = await fetch("http://localhost:8080/savedCards");
        const savedList: SavedCard[] = await savedResponse.json();

        const userSaved = savedList.filter(
          (item) => item.userId === loggedInUser.id
        );

        const cardIds = userSaved.map((saved) => saved.cardId);

        const cardsResponse = await fetch("http://localhost:8080/cards");
        const allCards: CardType[] = await cardsResponse.json();

        const filteredCards = allCards.filter((card) => cardIds.includes(card.id));
        setSavedCards(filteredCards);
      } catch (error) {
        console.error("Klaida kraunant išsaugotas korteles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCards();
  }, [loggedInUser]);

  const handleRemoveSavedCard = (cardId: string) => {
    setSavedCards((prevCards) => prevCards.filter((card) => card.id !== cardId));
  };

  if (loading) {
    return (
      <div className="user-loading">
        <img
          src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
          alt="Kraunasi..."
          className="user-loading-gif"
        />
      </div>
    );
  }

  return (
    <section className="user-page">
      <h2 className="user-page-title">Išsaugotos kortelės</h2>
      <div className="user-card-list">
        {savedCards.length > 0 ? (
          savedCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onRemove={handleRemoveSavedCard}
            />
          ))
        ) : (
          <p className="no-saved-cards">Neturite išsaugotų kortelių.</p>
        )}
      </div>
    </section>
  );
};