import React from "react";
import Image from "next/image";

interface NPCImageProps {
    type: string,
    x: number,
    y: number,
    opacity: number
}

const NPCImage : React.FC<NPCImageProps> = ({type, x, y, opacity}) => {
    let imagesrc = type === "A" ? "/crowd-person1.webp" : "/crowd-person2.webp";
    
    return (
        <div style={{
            position: "absolute",
            bottom: y,
            left: x
        }}>
            <Image
                src={imagesrc}
                width={120}
                height={120}
                alt="crowd npc"
                style={{
                    opacity: opacity, // 👈 50% transparent
                }}
            />
        </div>
    );
}
 
export default NPCImage;