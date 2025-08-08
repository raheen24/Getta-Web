import React from "react";
import profPic from "../assets/images/profpic.png";
const Message = ({
  name,
  time,
  text,
  image = profPic,
}: {
  name: string;
  time: string;
  text: string;
    image?: string;
}) => {
  return (
    <div className="messageBox">
      <div className="msg_image">
        <img src={image} alt="Profile" className="rounded-circle me-2" />  
      </div>
      <div className="msg_content">
        <h5 className="msg_title">{name}</h5>
        <p className="msg_text">{text}</p>
        <span className="msg_time">{time}</span>
      </div>
    </div>
  );
};

export default Message;
