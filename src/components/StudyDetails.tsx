
import React from "react";
import { ChessStudy, ChessMove } from "@/types/chess";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StudyDetailsProps {
  study: ChessStudy;
  currentMove: ChessMove | null;
}

const StudyDetails: React.FC<StudyDetailsProps> = ({ study, currentMove }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{study.title}</CardTitle>
        <CardDescription>{study.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Current Move</h3>
            <p className="text-lg font-bold">{currentMove ? currentMove.notation : "Starting Position"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Commentary</h3>
            <p className="text-base">{currentMove ? currentMove.commentary : "Game starting position. Ready to begin the study."}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyDetails;
