import React from "react";
import Image from "next/image";
interface UserAvatarProps {
    x: number,
    y: number,
    vote: string | null
}

const UserAvatar : React.FC<UserAvatarProps> = ({x, y, vote}) => {
    let imagesrc = "/user-avatar.webp"
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
            />
        </div>
    );
}


 
export default UserAvatar;