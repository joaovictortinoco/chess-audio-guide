
import React, { useEffect, useState, useCallback } from "react";
import { Chess } from "chess.js";
import ChessBoard from "./ChessBoard";
import AudioControls from "./AudioControls";
import StudyDetails from "./StudyDetails";
import StudySelector from "./StudySelector";
import { ChessStudy, AudioState } from "@/types/chess";
import { sampleStudies } from "@/data/sampleStudies";
import { speechService } from "@/services/speechService";
import { chessService } from "@/services/chessService";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/components/ui/use-toast";

const ChessStudyPlayer: React.FC = () => {
  const [selectedStudyId, setSelectedStudyId] = useState<string>(sampleStudies[0].id);
  const [currentStudy, setCurrentStudy] = useState<ChessStudy>(sampleStudies[0]);
  const [position, setPosition] = useState<string>("");
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentMoveIndex: -1,
  });
  const [volume, setVolume] = useState<number>(0.8);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get current move
  const currentMove = audioState.currentMoveIndex >= 0 
    ? currentStudy.moves[audioState.currentMoveIndex] 
    : null;

  // Load study when selected study changes
  useEffect(() => {
    const study = sampleStudies.find((s) => s.id === selectedStudyId);
    if (study) {
      setCurrentStudy(study);
      const newPosition = chessService.loadStudy(study);
      setPosition(newPosition);
      setAudioState({
        isPlaying: false,
        currentMoveIndex: -1,
      });
    }
  }, [selectedStudyId]);

  // Handle study change
  const handleStudyChange = (studyId: string) => {
    speechService.stop();
    setSelectedStudyId(studyId);
  };

  // Handle next move
  const goToNextMove = useCallback(() => {
    if (audioState.currentMoveIndex < currentStudy.moves.length - 1) {
      const nextIndex = audioState.currentMoveIndex + 1;
      const nextMove = currentStudy.moves[nextIndex];
      
      // Make the move on the board
      chessService.makeMove(nextMove.move);
      setPosition(chessService.getFen());
      
      // Update audio state
      setAudioState(prev => ({
        ...prev,
        currentMoveIndex: nextIndex,
      }));
      
      // Speak the commentary
      speechService.speak(`${nextMove.notation}. ${nextMove.commentary}`);
    } else {
      // End of study
      speechService.speak("End of study.");
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
      }));
    }
  }, [audioState.currentMoveIndex, currentStudy.moves]);

  // Handle previous move
  const goToPreviousMove = useCallback(() => {
    speechService.stop();
    
    if (audioState.currentMoveIndex > -1) {
      const prevIndex = audioState.currentMoveIndex - 1;
      
      // Reset to the proper position
      chessService.loadStudy(currentStudy, prevIndex);
      setPosition(chessService.getFen());
      
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        currentMoveIndex: prevIndex,
      }));
      
      if (prevIndex >= 0) {
        // Speak the previous commentary
        speechService.speak(`${currentStudy.moves[prevIndex].notation}. ${currentStudy.moves[prevIndex].commentary}`);
      } else {
        // Starting position
        speechService.speak("Starting position.");
      }
    }
  }, [audioState.currentMoveIndex, currentStudy]);

  // Handle play
  const handlePlay = useCallback(() => {
    if (!audioState.isPlaying) {
      // If at the starting position or end of study
      if (audioState.currentMoveIndex === -1 || 
          audioState.currentMoveIndex >= currentStudy.moves.length - 1) {
        // For the starting position, go to the first move
        if (audioState.currentMoveIndex === -1) {
          goToNextMove();
        }
      }
      
      setAudioState(prev => ({
        ...prev,
        isPlaying: true,
      }));
      
      toast({
        title: "Playback Started",
        description: "The audio narration has started."
      });
    } else {
      speechService.resume();
    }
  }, [audioState, currentStudy.moves, goToNextMove, toast]);

  // Handle pause
  const handlePause = useCallback(() => {
    speechService.pause();
    setAudioState(prev => ({
      ...prev,
      isPlaying: false,
    }));
    
    toast({
      title: "Playback Paused",
      description: "The audio narration has been paused."
    });
  }, [toast]);

  // Handle volume change
  const handleVolumeChange = useCallback((values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    speechService.setVolume(newVolume);
  }, []);

  // Auto-play next move when current one finishes
  useEffect(() => {
    if (audioState.isPlaying) {
      const onSpeechEnd = () => {
        if (audioState.currentMoveIndex < currentStudy.moves.length - 1) {
          setTimeout(() => {
            if (audioState.isPlaying) {
              goToNextMove();
            }
          }, 1000); // Small pause between moves
        } else {
          // End of study
          setAudioState(prev => ({
            ...prev,
            isPlaying: false,
          }));
        }
      };
      
      // Register the callback
      const utterance = new SpeechSynthesisUtterance();
      utterance.onend = onSpeechEnd;
      
      return () => {
        utterance.onend = null;
      };
    }
  }, [audioState.isPlaying, audioState.currentMoveIndex, currentStudy.moves.length, goToNextMove]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  return (
    <div className={`chess-study-player flex ${isMobile ? 'flex-col' : 'flex-row'} gap-6`}>
      <div className={`left-section ${isMobile ? 'w-full' : 'w-1/2'} flex flex-col gap-6`}>
        <StudySelector 
          studies={sampleStudies}
          currentStudyId={selectedStudyId}
          onStudyChange={handleStudyChange}
        />
        
        <div className="chess-board-wrapper flex justify-center">
          <ChessBoard 
            position={position} 
            boardWidth={isMobile ? 320 : 400}
          />
        </div>
      </div>
      
      <div className={`right-section ${isMobile ? 'w-full' : 'w-1/2'} flex flex-col gap-6`}>
        <StudyDetails 
          study={currentStudy}
          currentMove={currentMove}
        />
        
        <AudioControls 
          audioState={audioState}
          totalMoves={currentStudy.moves.length}
          onPlay={handlePlay}
          onPause={handlePause}
          onPrevious={goToPreviousMove}
          onNext={goToNextMove}
          onVolumeChange={handleVolumeChange}
          volume={volume}
        />
      </div>
    </div>
  );
};

export default ChessStudyPlayer;
