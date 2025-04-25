
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { AudioState } from "@/types/chess";

interface AudioControlsProps {
  audioState: AudioState;
  totalMoves: number;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onVolumeChange: (value: number[]) => void;
  volume: number;
}

const AudioControls: React.FC<AudioControlsProps> = ({
  audioState,
  totalMoves,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  onVolumeChange,
  volume,
}) => {
  return (
    <div className="flex flex-col w-full gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onPrevious}
            disabled={audioState.currentMoveIndex <= 0}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          {audioState.isPlaying ? (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onPause}
            >
              <Pause className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="icon"
              onClick={onPlay}
              disabled={audioState.currentMoveIndex >= totalMoves - 1}
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={onNext}
            disabled={audioState.currentMoveIndex >= totalMoves - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-500" />
          <Slider 
            defaultValue={[volume]} 
            max={1} 
            step={0.1} 
            onValueChange={onVolumeChange}
            className="w-24"
          />
        </div>
      </div>
      
      <div className="text-sm text-center text-gray-500">
        Move {audioState.currentMoveIndex + 1} of {totalMoves}
      </div>
    </div>
  );
};

export default AudioControls;
