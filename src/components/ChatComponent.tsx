// "use client";
// import React from "react";
// import { Input } from "./ui/input";
// import { useChat } from "ai/react";
// import { Button } from "./ui/button";
// import { Send } from "lucide-react";
// import MessageList from "./MessageList";
// import axios from "axios";

// type Props = {
//   chatId: number;
// };

// const messages =  [{
//     role: String,
//     content  :String

// }]

// const ChatComponent = ({ chatId }: Props) => {
  
//   // const { input, handleInputChange, handleSubmit, messages } = useChat({
//   //   api: "/api/chat",
//   //   body: {
//   //     chatId,
//   //   },
//   // });
//   // console.log(input,messages);


//   const chatResponse = async () => {
//     try {
//       const responce = await axios.post(`http://localhost:3000/api/chat`,{messages,chatId})
//       console.log(responce)
//     } catch (error) {
//       console.log(error)
//     }
//   }


//   React.useEffect(() => {
//     const messageContainer = document.getElementById("message-container");
//     if (messageContainer) {
//       messageContainer.scrollTo({
//         top: messageContainer.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);
//   return (
//     <div className="relative max-h-screen overflow-auto" id='message-container'>
//       <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
//         <h3 className="text-xl font-bold">Chat</h3>
//       </div>

//       {/* 
//         message list */}

//       <MessageList messages={messages} />
     
//       <form
//         onSubmit={chatResponse}
//         className=" flex flex-row first-sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
//       >
//         <Input
          
//           placeholder="Ask any question..."
//           className="w-full"
//         />
//         <Button className="bg-blue-800 ml-2" >
//           <Send className="h-4 w-4" />
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default ChatComponent;

"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import axios from "axios";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    setIsLoading(true);

    // Create new user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    // Immediately add user message to UI
    setMessages(prev => [...prev, newMessage]);
    
    try {
      const response = await axios.post(`http://localhost:3000/api/chat`, {
        messages: [...messages, newMessage],
        chatId
      });

      // Extract the assistant's message from the response
      if (response.data.messages && response.data.messages.length > 0) {
        // Get the last message from the response (assistant's message)
        const assistantResponse = response.data.messages[response.data.messages.length - 1];
        
        if (assistantResponse.content) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: assistantResponse.content.trim() // Remove any extra whitespace
          };
          
          setMessages(prev => [...prev, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative max-h-screen overflow-auto" id="message-container">
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit">
        <h3 className="text-xl font-bold">Chat</h3>
      </div>

      <MessageList messages={messages} />

      <form
        onSubmit={chatResponse}
        className="sticky bottom-0 inset-x-0 px-2 py-4 bg-white"
      >
        <div className="flex flex-row">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask any question..."
            className="w-full"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="bg-blue-800 ml-2"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;