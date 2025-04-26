
import React from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface ChessBoardProps {
  position: string;
  boardWidth?: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ position }) => {
  // For customization of board colors
  const customBoardStyle = {
    borderRadius: "4px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
  };

  return (
    <div className="chess-board-wrapper" style={{ width: "100%", maxWidth: "100vw" }}>
      <div className="chess-board-container" style={{ width: "100%", position: "relative" }}>
        <Chessboard
          id="chessboard"
          position={position}
          boardWidth={Math.min(window.innerWidth, 600)}
          customBoardStyle={customBoardStyle}
          customDarkSquareStyle={{ backgroundColor: "#215586" }}
          customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
        />
      </div>
      <div className="chess-board-content" style={{ marginTop: "20px" }}>
        {/* Add your content here */}
        <p>Conteúdo adicional abaixo do tabuleiro.</p>
      </div>
    </div>
  );
}

export default ChessBoard;
