
import { Chess, Move } from "chess.js";
import { ChessMove, ChessStudy } from "../types/chess";

export class ChessService {
  private chess: Chess;

  constructor() {
    this.chess = new Chess();
  }

  resetGame(fen?: string): void {
    if (fen) {
      this.chess.load(fen);
    } else {
      this.chess.reset();
    }
  }

  makeMove(move: string): boolean {
    try {
      this.chess.move(move);
      return true;
    } catch (error) {
      console.error("Invalid move:", error);
      return false;
    }
  }

  undoMove(): Move | null {
    return this.chess.undo();
  }

  getFen(): string {
    return this.chess.fen();
  }

  getMoveHistory(): Move[] {
    return this.chess.history({ verbose: true });
  }

  loadStudy(study: ChessStudy, moveIndex: number = -1): string {
    // Load the starting position
    this.resetGame(study.fen);
    
    // Apply moves up to the specified index
    if (moveIndex >= 0) {
      for (let i = 0; i <= moveIndex && i < study.moves.length; i++) {
        this.makeMove(study.moves[i].move);
      }
    }
    
    return this.getFen();
  }
}

export const chessService = new ChessService();
