import React from "react";
import ChessRecorder from "@/components/ChessRecorder";
import { BookHeadphones } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-chess-dark/10 to-chess-light/30">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <BookHeadphones className="h-8 w-8 text-chess-dark" />
            <h1 className="text-3xl md:text-4xl font-bold text-chess-dark">Chess Audio Guide</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Record your chess matches with audio commentary. Your chess studies as an audiobook experience.
          </p>
        </header>
        
        <main className="bg-white p-6 rounded-lg shadow-lg">
          <ChessRecorder />
        </main>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Chess Audio Guide © 2025 - Record your chess matches with audio commentary</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
