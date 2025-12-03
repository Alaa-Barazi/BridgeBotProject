const ActionButton = (props) => {
  const regularStyle = {
    backgroundColor: props?.backgroundColor,
    color: "black",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const buttonStyleProp = props?.buttonStyle ? props.buttonStyle : regularStyle;

  return (
    <button
      className={buttonStyleProp}
      onClick={props.onClick}
      type={props?.type}
    >
      {props.text}
    </button>
  );
};

export default ActionButton;
