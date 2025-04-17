import { CardType } from "../../../types/CardType";

type CardItemProps = {
  card: CardType;
};

export const CardItem = ({ card }: CardItemProps) => {
  return (
    <div style={{ width: "300px", border: "1px solid #ccc", borderRadius: "8px", padding: "1rem" }}>
      <h3>{card.title}</h3>
      {card.image && (
        <img
          src={card.image}
          alt={card.title}
          style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }}
        />
      )}
      <p style={{ marginTop: "1rem" }}>{card.description}</p>
      <small>Sukurta: {new Date(card.createdAt).toLocaleDateString()}</small>
    </div>
  );
};