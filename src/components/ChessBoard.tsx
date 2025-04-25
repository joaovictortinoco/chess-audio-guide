
import React from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

interface ChessBoardProps {
  position: string;
  boardWidth?: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ position, boardWidth = 400 }) => {
  // For customization of board colors
  const customBoardStyle = {
    borderRadius: "4px",
    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
  };

  const customSquareStyles = {
    background: "rgb(96, 96, 96)",
  };

  return (
    <div className="chess-board-container">
      <Chessboard
        id="chessboard"
        position={position}
        boardWidth={boardWidth}
        customBoardStyle={customBoardStyle}
        customDarkSquareStyle={{ backgroundColor: "#215586" }} // Dark blue squares
        customLightSquareStyle={{ backgroundColor: "#f0d9b5" }} // Light tan squares
      />
    </div>
  );
};

export default ChessBoard;
