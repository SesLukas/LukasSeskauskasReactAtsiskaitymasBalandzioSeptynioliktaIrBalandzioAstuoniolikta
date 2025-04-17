import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { CardType } from "../../../types/CardType";
import { Link } from "react-router"; // naudok "react-router", kaip sakei

type Props = {
  card: CardType;
};

type UserType = {
  id: number;
  username: string;
  avatar: string;
};

export const CardItem = ({ card }: Props) => {
  const { user } = useAuth();
  const [cardCreator, setCardCreator] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!card.userId) return;
      try {
        const response = await fetch(`http://localhost:8080/users/${card.userId}`);
        if (!response.ok) {
          throw new Error("Kūrėjas nerastas");
        }
        const creator = await response.json();
        setCardCreator(creator);
      } catch (error) {
        console.error("Klaida gaunant kūrėją:", error);
      }
    };

    fetchCreator();
  }, [card.userId]);

  const handleDelete = async () => {
    if (!card.id) return;
    try {
      await fetch(`http://localhost:8080/cards/${card.id}`, {
        method: "DELETE",
      });
      window.location.reload(); // greitam efektui, vėliau galima patobulinti be reload
    } catch (error) {
      console.error("Klaida trinant kortelę:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const newSave = {
        userId: user.id,
        cardId: card.id,
      };
      await fetch(`http://localhost:8080/savedCards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSave),
      });
      alert("Kortelė išsaugota!");
    } catch (error) {
      console.error("Klaida saugant kortelę:", error);
    }
  };

  if (!cardCreator) {
    return <p>Kraunama...</p>;
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", width: "300px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <img
          src={cardCreator.avatar}
          alt={cardCreator.username}
          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "0.5rem" }}
        />
        <div>
          <Link to="/user" style={{ textDecoration: "none", color: "inherit" }}>
            {cardCreator.username}
          </Link>
          <br />
          <small>{new Date(card.createdAt).toLocaleDateString()}</small>
        </div>
      </div>

      <h3>{card.title}</h3>

      {card.image && (
        <img
          src={card.image}
          alt={card.title}
          style={{ width: "100%", height: "auto", objectFit: "cover", marginBottom: "0.5rem" }}
        />
      )}

      <p>{card.description}</p>

      <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        {user && (
          <button onClick={handleSave} style={{ padding: "0.5rem", fontSize: "0.8rem" }}>
            Save
          </button>
        )}
        {user && user.id === card.userId && (
          <button
            onClick={handleDelete}
            style={{
              padding: "0.5rem",
              fontSize: "0.8rem",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
