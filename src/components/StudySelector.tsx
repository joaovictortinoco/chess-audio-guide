
import React from "react";
import { ChessStudy } from "@/types/chess";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudySelectorProps {
  studies: ChessStudy[];
  currentStudyId: string;
  onStudyChange: (studyId: string) => void;
}

const StudySelector: React.FC<StudySelectorProps> = ({
  studies,
  currentStudyId,
  onStudyChange,
}) => {
  return (
    <div className="w-full">
      <Select value={currentStudyId} onValueChange={onStudyChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a study" />
        </SelectTrigger>
        <SelectContent>
          {studies.map((study) => (
            <SelectItem key={study.id} value={study.id}>
              {study.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StudySelector;
