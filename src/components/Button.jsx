import React from "react";

const Button = ({
  text,
  onClick,
  disabled = false,
  icon = null,
  bgColor = "#4B1AD4",
  textColor = "#FFFFFF",
  height = "48px"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center rounded-[20px] text-lg font-bold transition-all duration-200 ${disabled
          ? "bg-gray-300 cursor-not-allowed"
          : `hover:opacity-90 cursor-pointer`
        }`}
      style={{
        backgroundColor: disabled ? "#D3D3D3" : bgColor,
        color: textColor,
        height: height,
      }}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {text}
    </button>
  );
};

export default Button;
