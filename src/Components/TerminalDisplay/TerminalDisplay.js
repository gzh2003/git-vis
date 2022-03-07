import "./TerminalDisplay.css";
function TerminalDisplay(props) {
  const { termHist } = props;
  return (
    <div>
      {
      termHist.map((line, i) => {
        if (line.type === "command") {
          return <div key={i} className="command">{line.content}</div>;
        } else if (line.type === "error") {
          return <div key={i} className="error">{line.content}</div>;
        } else {
          return <div key={i} className="standard">{line.content}</div>;
        }
      })}
    </div>
  );
}

export default TerminalDisplay;