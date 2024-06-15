import React from "react";
import notification from "../../../public/icons/icons8-notification-24.png";

function ChatBox() {
  return (
    <div className="w-[70%] mx-auto"> {/* Centering the content with mx-auto */}
    <div className="h-14 bg-blue-gray-300 flex justify-between items-center px-4"> {/* Added px-4 for padding */}
      <h1 className="font-prompt-semibold text-black text-2xl">
        Connections
      </h1>
      <div className="flex items-center"> {/* Aligning items to the right */}
        <img src={notification} alt="Notification" className="mr-2" /> {/* Adding margin-right */}
        <span className="mr-4">Shadil</span> {/* Adding margin-right */}
      </div>
    </div>
  </div>
  
  );
}

export default ChatBox;
