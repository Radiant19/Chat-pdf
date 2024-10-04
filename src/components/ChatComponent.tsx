"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";

type Props = {};

const ChatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit,messages } = useChat({
    api:'http://localhost:3000/api/chat'
  });
  return (
    <div className="relative max-h-screen overflow-auto">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      {/* 
        message list */}
        
        <MessageList messages={messages}/>
      <form onSubmit={handleSubmit} className=" flex flex-row first-sticky bottom-0 inset-x-0 px-2 py-4 bg-white">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question..."
          className="w-full"
        />
        <Button className="bg-blue-800 ml-2">
            <Send className="h-4 w-4"/>
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
