"use client";
import React from "react";

export interface ButtonProps {
    text: string;
    onClick: any;
    classes?: string;
};
  
const Button = (props: ButtonProps) => {
    const {classes, onClick, text} = props;
    
    return (
      <a className={classes != null ? classes : "bg-base-200 hover:bg-accent text-white text-3xl btn btn-ghost p-2 mx-2"} onClick={onClick}>{text}</a>
    )
};

export default Button;