// import { cn } from "@/lib/utils";
// import { Message } from "ai/react";
// import { Loader2 } from "lucide-react";
// import React from "react";

// type Props = {
// //   isLoading: boolean;
//   messages: Message[];
// };

// const MessageList = ({ messages }: Props) => {
// //   if (isLoading) {
// //     return (
// //       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
// //         <Loader2 className="w-6 h-6 animate-spin" />
// //       </div>
// //     );
// //   }
//   if (!messages) return <></>;
//   return (
//     <div className="flex flex-col gap-2 px-4">
//       {messages.map((message) => {
//         return (
//           <div
//             key={message.id}
//             className={cn("flex", {
//               "justify-end pl-10": message.role === "user",
//               "justify-start pr-10": message.role === "assistant",
//             })}
//           >
//             <div
//               className={cn(
//                 "rounded-lg px-3 text-sm py-1 shadow-md ring-1 ring-gray-900/10",
//                 {
//                   "bg-blue-600 text-white": message.role === "user",
//                 }
//               )}
//             >
//               <p>{message.content}</p>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default MessageList;
import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  messages: Message[];
}

const MessageList = ({ messages }: Props) => {
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-lg shadow-inner">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`p-4 max-w-[80%] rounded-xl shadow-md transition-all duration-300 ease-in-out ${
            message.role === 'user'
              ? 'bg-blue-100 ml-auto hover:bg-blue-200'
              : 'bg-white mr-auto hover:bg-gray-100'
          }`}
        >
          <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
            {message.content}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default MessageList;