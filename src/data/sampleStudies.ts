
import { ChessStudy } from "../types/chess";

export const sampleStudies: ChessStudy[] = [
  {
    id: "kings-gambit",
    title: "King's Gambit",
    description: "A classic aggressive opening for White where they sacrifice a pawn for rapid development.",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Starting position
    moves: [
      {
        move: "e2e4",
        notation: "e4",
        commentary: "White opens with e4, controlling the center and opening lines for the bishop and queen."
      },
      {
        move: "e7e5",
        notation: "e5",
        commentary: "Black responds symmetrically, also fighting for the center."
      },
      {
        move: "f2f4",
        notation: "f4",
        commentary: "The King's Gambit begins! White sacrifices a pawn to divert Black's center pawn and open lines for attack."
      },
      {
        move: "e5f4",
        notation: "exf4",
        commentary: "Black accepts the gambit, taking the pawn."
      },
      {
        move: "g1f3",
        notation: "Nf3",
        commentary: "White develops the knight, threatening the f-pawn and preparing for kingside castling."
      },
      {
        move: "g7g5",
        notation: "g5",
        commentary: "The classical defense, protecting the extra pawn with another pawn."
      },
      {
        move: "h2h4",
        notation: "h4",
        commentary: "White immediately challenges the g5 pawn, trying to open lines against the Black kingside."
      },
      {
        move: "g5g4",
        notation: "g4",
        commentary: "Black pushes forward, driving away the knight."
      },
      {
        move: "f3e5",
        notation: "Ne5",
        commentary: "The knight retreats to a strong central square, threatening several tactical motifs."
      }
    ]
  },
  {
    id: "ruy-lopez",
    title: "Ruy Lopez Opening",
    description: "One of the oldest and most popular chess openings, known for its deep strategic possibilities.",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    moves: [
      {
        move: "e2e4",
        notation: "e4",
        commentary: "White begins with the King's Pawn opening, claiming the center and freeing the bishop and queen."
      },
      {
        move: "e7e5",
        notation: "e5",
        commentary: "Black responds in kind, also staking a claim in the center."
      },
      {
        move: "g1f3",
        notation: "Nf3",
        commentary: "White develops the king's knight, attacking Black's e-pawn and preparing to castle."
      },
      {
        move: "b8c6",
        notation: "Nc6",
        commentary: "Black defends the e-pawn with the knight and develops a piece naturally."
      },
      {
        move: "f1b5",
        notation: "Bb5",
        commentary: "The characteristic move of the Ruy Lopez. White pins the knight, indirectly attacking the e5 pawn again."
      },
      {
        move: "a7a6",
        notation: "a6",
        commentary: "The Morphy Defense, most popular at high levels. Black questions the bishop's placement."
      },
      {
        move: "b5a4",
        notation: "Ba4",
        commentary: "White retreats the bishop, maintaining the pin on the knight."
      },
      {
        move: "g8f6",
        notation: "Nf6",
        commentary: "Black develops the kingside knight, defending e5 again and preparing to castle."
      },
      {
        move: "e1g1",
        notation: "O-O",
        commentary: "White castles kingside, bringing the king to safety and connecting the rooks."
      }
    ]
  }
];
