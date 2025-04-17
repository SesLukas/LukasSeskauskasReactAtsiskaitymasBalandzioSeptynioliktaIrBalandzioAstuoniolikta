import { CardType } from "../../../types/CardType";
import { CardItem } from "../../../../src/components/UI/molecules/CardItem";

type CardListProps = {
  cards: CardType[];
};

export const CardList = ({ cards }: CardListProps) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "2rem" }}>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};
