import React from "react";
import ActionButton from "./ActionButton";

const ReplyBox = () => {
  const saveReply = () => {
    console.log("Reply was saved successfully");
  };

  return (
    <div>
      <input type="text" placeholder="type your reply" />
      <ActionButton onClick={() => saveReply()} text="Save" />
      <ActionButton onClick={() => {}} text="Clear" type="clear" />
    </div>
  );
};

export default ReplyBox;
