import { useEffect, useState } from "react";
import { CardType } from "../../../types/CardType";
import { useAuth } from "../../../contexts/AuthContext";
import { User } from "../../../types/User";
import { Link } from "react-router";
import "./CardItem.css";

type CardItemProps = {
  card: CardType;
  onRemove?: (cardId: string) => void;
};

type SavedCard = {
  id: string;
  userId: string;
  cardId: string;
};

export const CardItem = ({ card, onRemove }: CardItemProps) => {
  const { loggedInUser } = useAuth();
  const [creator, setCreator] = useState<User | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`http://localhost:8080/users/${card.userId}`);
        if (!response.ok) throw new Error("Nepavyko gauti vartotojo duomenų");
        const userData: User = await response.json();
        setCreator(userData);
      } catch (error) {
        console.error("Klaida gaunant kūrėją:", error);
      }
    };

    const checkIfSaved = async () => {
      if (!loggedInUser) return;
      try {
        const response = await fetch("http://localhost:8080/savedCards");
        const savedCards: SavedCard[] = await response.json();
        const found = savedCards.find(
          (saved) => saved.userId === loggedInUser.id && saved.cardId === card.id
        );
        setIsSaved(!!found);
      } catch (error) {
        console.error("Klaida tikrinant ar kortelė išsaugota:", error);
      }
    };

    fetchCreator();
    checkIfSaved();
  }, [card.userId, card.id, loggedInUser]);

  const handleSave = async () => {
    if (!loggedInUser) return;
    try {
      const response = await fetch("http://localhost:8080/savedCards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: loggedInUser.id,
          cardId: card.id,
        }),
      });
      if (response.ok) {
        setIsSaved(true);
        alert("Kortelė išsaugota!");
      }
    } catch (error) {
      console.error("Klaida išsaugant kortelę:", error);
    }
  };

  const handleUnsave = async () => {
    if (!loggedInUser) return;
    try {
      const response = await fetch("http://localhost:8080/savedCards");
      const savedCards: SavedCard[] = await response.json();
      const savedCard = savedCards.find(
        (saved) => saved.userId === loggedInUser.id && saved.cardId === card.id
      );
      if (savedCard) {
        await fetch(`http://localhost:8080/savedCards/${savedCard.id}`, {
          method: "DELETE",
        });
        setIsSaved(false);
        if (onRemove) {
          onRemove(card.id);
        }
        alert("Kortelė pašalinta iš išsaugotų!");
      }
    } catch (error) {
      console.error("Klaida šalinant kortelę:", error);
    }
  };

  const handleDelete = async () => {
    if (!loggedInUser || loggedInUser.id !== card.userId) return;
    if (!window.confirm("Ar tikrai norite ištrinti kortelę?")) return;
    try {
      await fetch(`http://localhost:8080/cards/${card.id}`, {
        method: "DELETE",
      });
      window.location.reload();
    } catch (error) {
      console.error("Klaida trinant kortelę:", error);
    }
  };

  return (
    <div className="card-item">
      {creator && (
        <div className="card-header">
          <img src={creator.avatar} alt={`${creator.firstName} ${creator.lastName}`} className="creator-avatar" />
          <Link to={`/user/${creator.id}`} className="creator-name">
            {creator.firstName} {creator.lastName}
          </Link>
        </div>
      )}
      <div className="card-body">
        <small className="card-date">{new Date(card.createdAt).toLocaleString()}</small>
        <h3>{card.title}</h3>
        {card.image && <img src={card.image} alt={card.title} className="card-image" />}
        <p>{card.description}</p>
      </div>
      <div className="card-actions">
        {loggedInUser && (
          isSaved ? (
            <button onClick={handleUnsave} className="unsave-button">Unsave</button>
          ) : (
            <button onClick={handleSave} className="save-button">Save</button>
          )
        )}
        {loggedInUser && loggedInUser.id === card.userId && (
          <button onClick={handleDelete} className="delete-button">Delete</button>
        )}
      </div>
    </div>
  );
};
