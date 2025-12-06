const ActionButton = (props) => {
  // 1. Define your object styles for the default case
  const defaultStyles = {
    backgroundColor: props.backgroundColor || "CornflowerBlue", // specific default
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  // 2. Check if the user passed a Tailwind string (className)
  const isTailwind = typeof props.buttonStyle === "string";
  return (
    <button
      // If it's a string, use it as class. If not, use empty string.
      className={isTailwind ? props.buttonStyle : ""}
      // If it's NOT a string (and no class provided), use the object.
      style={!isTailwind ? defaultStyles : {}}
      onClick={props.onClick}
      type={props.type || "button"}
    >
      {props.text}
    </button>
  );
};

export default ActionButton;
