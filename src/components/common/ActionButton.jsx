const ActionButton = (props) => {
  const regularStyle = {
    backgroundColor: props?.backgroundColor,
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };
  const buttonStyle = props?.buttonStyle ? props.buttonStyle : regularStyle;

  return (
    <button className={buttonStyle} onClick={props.onClick} type={props?.type}>
      {props.text}
    </button>
  );
};

export default ActionButton;
