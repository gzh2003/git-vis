import { Stack, Code } from "@chakra-ui/react";
import { useRef, useEffect } from "react";
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
    <Stack spacing="3">
      {termHist.map((line, i) => {
        if (line.type === "command") {
          return <Code key={i} colorScheme={"green"} variant="subtle">{line.content}</Code>;
        } else if (line.type === "error") {
          return <Code key={i} colorScheme={"red"} variant="subtle">{line.content}</Code>;
        } else {
          return <Code key={i} variant="subtle">{line.content}</Code>;
        }
      })}
      <div ref={terminalEndRef}></div>
    </Stack>
  );
}

export default TerminalDisplay;
