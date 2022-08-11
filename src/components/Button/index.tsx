import React from "react";
import "./style.scss";

interface ButtonProps {
  test?: string;
}

export const Button = (buttonProps: ButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("event object", e);
  };

  return (
    <button className="button" onClick={handleClick}>
      Send
    </button>
  );
};
