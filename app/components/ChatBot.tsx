"use client";

import { BotMessageSquare } from "lucide-react";

const ChatBot = () => {
  return (
    <a
      href="https://fc.catholic.ng/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="AI chatbot"
      title="AI chatbot"
      className="fixed bottom-[20vh] z-10 right-[5%] cursor-pointer w-14 h-14 bg-linear-to-br from-[#8A22A0] to-[#5E1479] rounded-full shadow-glow flex items-center justify-center text-white transform hover:scale-110 active:scale-95 transition-all duration-300 group animate-float ring-4 ring-[#89599E] dark:ring-background-dark ring-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
    >
      <span
        className="material-icons-outlined text-3xl transition-all"
        aria-hidden
      >
        <BotMessageSquare />
      </span>

      <span className="absolute top-1 right-[1] w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-background-dark rounded-full animate-pulse"></span>
    </a>
  );
};

export default ChatBot;
