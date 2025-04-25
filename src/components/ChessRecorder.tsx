
import React, { useState } from "react";
import ChessBoard from "./ChessBoard";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChessMatch } from "@/types/chess";
import { chessService } from "@/services/chessService";
import { useToast } from "@/components/ui/use-toast";

const ChessRecorder: React.FC = () => {
  const [position, setPosition] = useState<string>("start");
  const [currentMove, setCurrentMove] = useState("");
  const [comment, setComment] = useState("");
  const [match, setMatch] = useState<ChessMatch>({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    moves: []
  });
  const { toast } = useToast();

  const handleMakeMove = () => {
    if (!currentMove.trim()) {
      toast({
        title: "Invalid Move",
        description: "Please enter a chess move in algebraic notation (e.g., 'e4', 'Nf3')"
      });
      return;
    }

    const success = chessService.makeMove(currentMove);
    if (success) {
      const newPosition = chessService.getFen();
      setPosition(newPosition);
      
      setMatch(prev => ({
        ...prev,
        moves: [
          ...prev.moves,
          {
            moveNumber: prev.moves.length + 1,
            notation: currentMove,
            comment: comment.trim() || undefined
          }
        ]
      }));

      setCurrentMove("");
      setComment("");
      
      toast({
        title: "Move Recorded",
        description: `Move ${currentMove} has been recorded`
      });
    } else {
      toast({
        title: "Invalid Move",
        description: "The move you entered is not valid",
        variant: "destructive"
      });
    }
  };

  const resetGame = () => {
    chessService.resetGame();
    setPosition(chessService.getFen());
    setMatch({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      moves: []
    });
    setCurrentMove("");
    setComment("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="flex-1">
        <ChessBoard position={position} />
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="p-4 border rounded-lg space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Enter Move (algebraic notation)</label>
            <input
              type="text"
              value={currentMove}
              onChange={(e) => setCurrentMove(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="e4, Nf3, etc."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Comment (optional)</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your analysis here..."
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleMakeMove}>Make Move</Button>
            <Button variant="outline" onClick={resetGame}>New Game</Button>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Move History</h3>
          <div className="space-y-2">
            {match.moves.map((move) => (
              <div key={move.moveNumber} className="border-b pb-2">
                <div className="font-medium">
                  {Math.ceil(move.moveNumber / 2)}. 
                  {move.moveNumber % 2 === 1 ? ' ' : '... '}
                  {move.notation}
                </div>
                {move.comment && (
                  <div className="text-sm text-gray-600 mt-1">{move.comment}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessRecorder;
