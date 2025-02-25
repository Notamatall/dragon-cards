import { getProviderGamePath } from "utils/index";
interface Card {
  id: number;
  value: string;
  img: string;
}
abstract class RngGames {
  static getDeck(): Card[] {
    return [
      { id: 1, value: "A", img: getProviderGamePath("cards", "fire.png") },
      { id: 2, value: "B", img: getProviderGamePath("cards", "frost.png") },
      { id: 3, value: "C", img: getProviderGamePath("cards", "shadow.png") },
      { id: 4, value: "D", img: getProviderGamePath("cards", "storm.png") },
      { id: 5, value: "E", img: getProviderGamePath("cards", "earth.png") },
      { id: 6, value: "F", img: getProviderGamePath("cards", "empty.png") },
    ];
  }

  static getRandom(results: number[]) {
    const deck = this.getDeck();

    for (let i = deck.length - 1; i > 0; i--) {
      const j = results[i];
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }
}

export default RngGames;
