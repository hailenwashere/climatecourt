/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

interface NPCImageProps {
  type: string;
  x: number;
  y: number;
  opacity: number;
  chatDirection: "left" | "right";
  displayChat: "yay" | "nay" | "none";
}

const NPCImage: React.FC<NPCImageProps> = ({
  type,
  x,
  y,
  opacity,
  chatDirection,
  displayChat,
}) => {
  const imagesrc = type === "A" ? "/crowd-person1.webp" : "/crowd-person2.webp";
  const [chatsrc, setChatsrc] = useState(`yay-${chatDirection}.png`);

  useEffect(() => {
    if (displayChat === "nay") {
      setChatsrc(`nay-${chatDirection}.png`);
    } else if (displayChat === "yay") {
      setChatsrc(`yay-${chatDirection}.png`);
    }
  }, [chatDirection, displayChat]);

  const bubbleClass =
    displayChat === "none" ? "vote-bubble-exit" : "vote-bubble-enter";

  const xOffset =
    chatDirection === "right" ? "right-[-100px]" : "left-[-100px]";

  const bubbleOpacity = displayChat === "none" ? "opacity-0" : "opacity-100";

  return (
    <div
      style={{
        position: "absolute",
        bottom: y,
        left: x,
      }}
    >
      <img
        src={imagesrc}
        width={120}
        height={120}
        alt="crowd npc"
        style={{
          opacity: opacity,
        }}
      />
      {
        <img
          src={chatsrc}
          width={200}
          alt={displayChat}
          className={`absolute z-10 max-w-none transform top-[-95px] ${xOffset} ${bubbleClass} ${bubbleOpacity} duration-300 z-40`}
        />
      }
    </div>
  );
};

export default NPCImage;
