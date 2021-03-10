  // probably make this part of board, since they scale to 0 if I dont populate them
  function Canvas(props){
    return (
      <div className="aaa">
         
        {props.children}
      </div>
    );
  }

  export default Canvas;