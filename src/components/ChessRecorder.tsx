import React, { useState, useRef, useEffect } from "react";
import ChessBoard from "./ChessBoard";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChessMatch } from "@/types/chess";
import { chessService } from "@/services/chessService";
import { useToast } from "@/components/ui/use-toast";
import { speechService } from "@/services/speechService";
import AudioControls from "./AudioControls";
import { Upload, Play, Pause } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
interface ChessJsonMove {
  move: string;
  commentary: string;
  conceitos?: string[];
  referencias?: string[];
}
const ChessRecorder: React.FC = () => {
  const [position, setPosition] = useState<string>("start");
  const [currentMove, setCurrentMove] = useState("");
  const [commentary, setcommentary] = useState("");
  const [match, setMatch] = useState<ChessMatch>({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    moves: []
  });
  const {
    toast
  } = useToast();
  const [jsonMoves, setJsonMoves] = useState<ChessJsonMove[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const jsonContent = JSON.parse(event.target?.result as string);
        // Handle both array format and single object format
        const movesArray = Array.isArray(jsonContent) ? jsonContent : [jsonContent];
        setJsonMoves(movesArray);

        // Reset the simulation
        resetGame();
        setCurrentMoveIndex(-1);
        toast({
          title: "JSON Loaded Successfully",
          description: `${movesArray.length} moves imported and ready for simulation`
        });
      } catch (error) {
        toast({
          title: "Error Loading JSON",
          description: "The file couldn't be parsed as valid JSON",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  // Simulate playing the match
  useEffect(() => {
    if (!isPlaying || currentMoveIndex >= jsonMoves.length - 1) return;
    const playNextMove = () => {
      const nextIndex = currentMoveIndex + 1;
      if (nextIndex < jsonMoves.length) {
        simulateMove(nextIndex);
      } else {
        setIsPlaying(false);
      }
    };
    const timer = setTimeout(playNextMove, 8000); // 8 seconds per move

    return () => clearTimeout(timer);
  }, [isPlaying, currentMoveIndex, jsonMoves]);
  const simulateMove = (moveIndex: number) => {
    if (moveIndex < 0 || moveIndex >= jsonMoves.length) return;
    const moveData = jsonMoves[moveIndex];
    if (!moveData || !moveData.move) return;

    // Extract individual moves from algebraic notation (like "1. e4 e5")
    const moveParts = moveData.move.replace(/\d+\.\s+/, '').split(' ');
    let moveSuccess = false;
    for (const move of moveParts) {
      if (move && move.trim()) {
        moveSuccess = chessService.makeMove(move.trim());
        if (!moveSuccess) {
          toast({
            title: "Invalid Move",
            description: `Move "${move}" is not valid`,
            variant: "destructive"
          });
          break;
        }
      }
    }
    if (moveSuccess) {
      const newPosition = chessService.getFen();
      setPosition(newPosition);

      // Extract move number from the notation
      const moveNumberMatch = moveData.move.match(/^(\d+)\./);
      const moveNumber = moveNumberMatch ? parseInt(moveNumberMatch[1]) : match.moves.length + 1;
      setMatch(prev => ({
        ...prev,
        moves: [...prev.moves, {
          moveNumber: moveNumber,
          notation: moveData.move,
          commentary: moveData.commentary
        }]
      }));

      // Speak the move and commentary
      const textToSpeak = `${moveData.commentary}`;
      speechService.speak(textToSpeak);

      // Update current move index
      setCurrentMoveIndex(moveIndex);
    }
  };
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      speechService.pause();
    } else {
      setIsPlaying(true);
      if (speechService.isPaused()) {
        speechService.resume();
      } else {
        simulateMove(currentMoveIndex + 1);
      }
    }
  };
  const handlePrevious = () => {
    if (currentMoveIndex > 0) {
      setIsPlaying(false);
      speechService.stop();

      // Reset the game and replay until the previous move
      resetGame(true);
      const newIndex = currentMoveIndex - 1;
      for (let i = 0; i <= newIndex; i++) {
        const moveData = jsonMoves[i];
        const moveParts = moveData.move.replace(/\d+\.\s+/, '').split(' ');
        for (const move of moveParts) {
          if (move && move.trim()) {
            chessService.makeMove(move.trim());
          }
        }
      }
      setPosition(chessService.getFen());
      setCurrentMoveIndex(newIndex);

      // Update match moves
      const updatedMoves = [];
      for (let i = 0; i <= newIndex; i++) {
        const moveData = jsonMoves[i];
        const moveNumberMatch = moveData.move.match(/^(\d+)\./);
        const moveNumber = moveNumberMatch ? parseInt(moveNumberMatch[1]) : i + 1;
        updatedMoves.push({
          moveNumber: moveNumber,
          notation: moveData.move,
          commentary: moveData.commentary
        });
      }
      setMatch(prev => ({
        ...prev,
        moves: updatedMoves
      }));
    }
  };
  const handleNext = () => {
    if (currentMoveIndex < jsonMoves.length - 1) {
      setIsPlaying(false);
      speechService.stop();
      simulateMove(currentMoveIndex + 1);
    }
  };
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    speechService.setVolume(newVolume);
  };
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
        moves: [...prev.moves, {
          moveNumber: prev.moves.length + 1,
          notation: currentMove,
          commentary: commentary.trim() || undefined
        }]
      }));
      setCurrentMove("");
      setcommentary("");
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
  const resetGame = (silent = false) => {
    chessService.resetGame();
    setPosition(chessService.getFen());
    setMatch({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      moves: []
    });
    setCurrentMove("");
    setcommentary("");
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
    speechService.stop();
    if (!silent) {
      toast({
        title: "New Game",
        description: "The board has been reset for a new game"
      });
    }
  };
  return <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="flex-1">
        <ChessBoard position={position} />
        
        {jsonMoves.length > 0 && <div className="mt-4">
            <AudioControls audioState={{
          isPlaying,
          currentMoveIndex
        }} totalMoves={jsonMoves.length} onPlay={handlePlayPause} onPause={handlePlayPause} onPrevious={handlePrevious} onNext={handleNext} onVolumeChange={handleVolumeChange} volume={volume} />
          </div>}
      </div>
      
      <div className="flex-1 space-y-4">
        <div className="p-4 border rounded-lg space-y-4">
          <div className="flex flex-col space-y-4">
            <div>
              <h3 className="font-medium mb-2">Upload Match</h3>
              <input type="file" ref={fileInputRef} accept=".json" onChange={handleFileUpload} className="hidden" />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Upload JSON File
              </Button>
            </div>

            {jsonMoves.length > 0 && <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle>JSON Loaded Successfully</AlertTitle>
                <AlertDescription>
                  {jsonMoves.length} moves loaded. Press Play to start the simulation.
                </AlertDescription>
              </Alert>}
            
            
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <h3 className="font-medium mb-2">Move History</h3>
          <div className="space-y-2">
            {match.moves.map(move => <div key={move.moveNumber} className="border-b pb-2">
                <div className="font-medium">
                  {Math.ceil(move.moveNumber / 2)}. 
                  {move.moveNumber % 2 === 1 ? ' ' : '... '}
                  {move.notation}
                </div>
                {move.commentary && <div className="text-sm text-gray-600 mt-1">{move.commentary}</div>}
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default ChessRecorder;