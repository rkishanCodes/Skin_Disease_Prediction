import React from "react";
import { Volume2 } from "lucide-react";

const TextToSpeech = ({ text }) => {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <Volume2 className="w-4 h-4 mr-2" />
      Listen
    </button>
  );
};

export default TextToSpeech;
