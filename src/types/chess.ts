
export interface ChessMove {
  move: string;
  notation: string;
  commentary: string;
}

export interface ChessStudy {
  id: string;
  title: string;
  description: string;
  fen: string; // Starting position in FEN notation
  moves: ChessMove[];
}

export interface AudioState {
  isPlaying: boolean;
  currentMoveIndex: number;
}
