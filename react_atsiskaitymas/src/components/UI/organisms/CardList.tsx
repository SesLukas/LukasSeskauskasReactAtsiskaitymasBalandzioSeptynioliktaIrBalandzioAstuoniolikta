import { CardType } from "../../../types/CardType";
import { CardItem } from "../molecules/CardItem"; 

type Props = {
  cards: CardType[];
};

export const CardList = ({ cards }: Props) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
      {cards.map((card) => (
        <CardItem key={card.id} card={card} />
      ))}
    </div>
  );
};
