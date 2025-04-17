import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { CardType } from "../../../types/CardType";
import { Link } from "react-router";

type Props = {
  card: CardType;
};

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string;
};

export const CardItem = ({ card }: Props) => {
  const { user } = useAuth();
  const [cardCreator, setCardCreator] = useState<UserType | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      if (!card.userId) return;
      try {
        const response = await fetch(`http://localhost:8080/users/${card.userId}`);
        const creator = await response.json();
        setCardCreator(creator);
      } catch (error) {
        console.error("Klaida gaunant kūrėją:", error);
      }
    };

    const checkIfSaved = async () => {
      if (!user) return;
      const res = await fetch(`http://localhost:8080/savedCards?userId=${user.id}&cardId=${card.id}`);
      const data = await res.json();
      setIsSaved(data.length > 0);
    };

    fetchCreator();
    checkIfSaved();
  }, [card.userId, card.id, user]);

  const handleSaveOrUnsave = async () => {
    if (!user) return;

    if (isSaved) {
      const response = await fetch(`http://localhost:8080/savedCards?userId=${user.id}&cardId=${card.id}`);
      const saved = await response.json();
      if (saved.length > 0) {
        await fetch(`http://localhost:8080/savedCards/${saved[0].id}`, { method: "DELETE" });
        setIsSaved(false);
        setNotification("Kortelė pašalinta iš išsaugotų!");
      }
    } else {
      await fetch(`http://localhost:8080/savedCards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, cardId: card.id }),
      });
      setIsSaved(true);
      setNotification("Kortelė išsaugota!");
    }

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  if (!cardCreator) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <img
          src="https://raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator_large.gif"
          alt="Kraunama..."
          style={{ width: "80px" }}
        />
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", width: "300px", position: "relative" }}>
      {notification && (
        <div style={{ backgroundColor: "#e0ffe0", color: "green", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "8px", textAlign: "center", fontWeight: "bold" }}>
          {notification}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <img
          src={cardCreator.avatar}
          alt={`${cardCreator.firstName} ${cardCreator.lastName}`}
          style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "0.5rem" }}
        />
        <div>
          <Link to="/user" style={{ textDecoration: "none", color: "inherit" }}>
            {cardCreator.firstName} {cardCreator.lastName}
          </Link>
          <br />
          <small>
  {new Date(card.createdAt).toLocaleString("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}
</small>
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
          <button onClick={handleSaveOrUnsave} style={{ padding: "0.5rem", fontSize: "0.8rem", cursor: "pointer" }}>
            {isSaved ? "Unsave" : "Save"}
          </button>
        )}
        {user && user.id === card.userId && (
          <button
            onClick={async () => {
              await fetch(`http://localhost:8080/cards/${card.id}`, { method: "DELETE" });
              window.location.reload();
            }}
            style={{
              padding: "0.5rem",
              fontSize: "0.8rem",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};