export interface Card {
  id: string;
  title: string;
  description?: string;
  label?: string;
  metadata?: any;
}

export interface Lane {
  // key
  id: string;
  title?: string;
  label?: string;
  cards?: Array<Card>;
  disallowAddingCard?: boolean;
}

export interface Board {
  // key
  id: string;
  lanes: Array<Lane>;
  metadata?: {
    title?: string;
    description?: string;
  };
}

export interface BoardInterface {
  getBoard(): Promise<Board>;
  addCard(laneId: string, card: Card): Promise<void>;
  deleteCard(laneId: string, cardId: string): Promise<void>;
  updateCard(laneId: string, cardId: string, card: Card): Promise<void>;
}
