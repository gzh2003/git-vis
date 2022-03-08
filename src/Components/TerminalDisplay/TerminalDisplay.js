import { useRef, useEffect } from "react";
import "./TerminalDisplay.css";
function TerminalDisplay(props) {
  const { termHist } = props;
  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behaviour: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [termHist]);

  const terminalEndRef = useRef(null);
  return (
    <div className="terminal-display-container">
      {termHist.map((line, i) => {
        if (line.type === "command") {
          return (
            <div key={i} className="command">
              <p className="command-symbol">&gt;</p>
              {line.content}
            </div>
          );
        } else if (line.type === "error") {
          return (
            <div key={i} className="error">
              {line.content}
            </div>
          );
        } else {
          return (
            <div key={i} className="standard">
              {line.content}
            </div>
          );
        }
      })}
      <div ref={terminalEndRef}></div>
    </div>
  );
}

export default TerminalDisplay;
