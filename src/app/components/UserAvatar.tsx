import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./UserAvatar.module.css";

interface UserAvatarProps {
    x: number,
    y: number,
    vote: string | null,
    onClick?: () => void
}

const UserAvatar : React.FC<UserAvatarProps> = ({x, y, vote, onClick}) => {
    const [isJumping, setIsJumping] = useState(false);
    const imagesrc = "/user-avatar.webp";
    
    const triggerJump = () => {
        if (isJumping) return;
        
        setIsJumping(true);
        
        // Reset animation after it completes
        setTimeout(() => {
            setIsJumping(false);
        }, 500); // Match animation duration w CSS animation
    };

    // Trigger jump whenever vote changes
    useEffect(() => {
        if (vote !== null) {
            triggerJump();
        }
    }, [vote]);

    const handleClick = () => {
        triggerJump();
        console.log('handleCLikc!!!')
        
        // // Call the parent's onClick handler if provided?
        // if (onClick) {
        //     onClick();
        // }
    };

    return (
        <div 
            className={`${styles.avatarContainer} ${isJumping ? styles.jumping : ''}`}
            style={{
                position: "absolute",
                bottom: y,
                left: x
            }}
            onClick={handleClick}
        >
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