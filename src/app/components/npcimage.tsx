import React from "react";
import Image from "next/image";

interface NPCImageProps {
    type: string,
    x: number,
    y: number,
    opacity: number
}

const NPCImage : React.FC<NPCImageProps> = ({type, x, y, opacity}) => {
    let imagesrc = ""
    if (type == "A") {
        imagesrc = "/crowd-person1.webp"
    } else {
        imagesrc = "/crowd-person2.webp"
    }
    return (
        <div style={{
            position: "absolute",
            top: `${y}px`,
            left: `${x}px`,
        }}>
            <Image
                src={imagesrc}
                width={300}
                height={300}
                alt="Picture of the author"
                style={{
                    opacity: opacity, // 👈 50% transparent
                }}
            />
        </div>
    );
}
 
export default NPCImage;