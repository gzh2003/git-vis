import { Flex, Box    } from "@chakra-ui/react";
import { useEffect, useState, useRef, createRef } from "react";
import { Gitgraph, templateExtend } from "@gitgraph/react";
import cmdLib from "../../utils/cmdLib";
import TerminalDisplay from "../TerminalDisplay/TerminalDisplay";
import CommandEntry from "../CommandEntry/CommandEntry";
import initDefaults, {
  cmdConfigGlobalName,
  cmdConfigGlobalEmail,
  cmdCommit,
  cmdAddBranch,
  cmdMergeBranch,
  cmdDeleteBranch,
  cmdCheckout,
  cmdAddTag,
  cmdBranch,
  cmdTag,
  cmdLog,
} from "../../utils/cmds";
import CommandError from "../../utils/CommandError";

const getTokens = (string) => {
  const quotedString = string.match(/(["'`].*["'`])/g);
  string = string.replace(/ +(["'`].*["'`])/g, "");
  string = string.trim();
  let tokens = string.split(/ +/);
  if (quotedString) {
    tokens.push(quotedString[0].replace(/["'`]/g, ""));
  }
  return tokens;
};
const getCmd = (command, cmdLib) => {
  const tokens = getTokens(command);
  if (!tokens.length) return;
  if (!(tokens.length in cmdLib)) {
    throw new CommandError(
      `'${command}' is not a valid gitVis command. See 'gitVis --help'.`
    );
  }
  for (let i = 0; i < cmdLib[tokens.length].length; ++i) {
    let j;
    const cmd = cmdLib[tokens.length][i];
    for (j = 0; j < tokens.length; ++j) {
      if (!(tokens[j] === cmd.tokens[j] || cmd.tokens[j] === "[]")) {
        break;
      }
    }
    if (j === tokens.length) {
      switch (cmd.key) {
        case "configGlobalName":
          return cmdConfigGlobalName(tokens[4]);
        case "configGlobalEmail":
          return cmdConfigGlobalEmail(tokens[4]);
        case "commit":
          return cmdCommit(tokens[3]);
        case "addBranch":
          return cmdAddBranch(tokens[2]);
        case "mergeBranch":
          return cmdMergeBranch(tokens[2]);
        case "deleteBranch":
          return cmdDeleteBranch(tokens[3]);
        case "checkout":
          return cmdCheckout(tokens[2]);
        case "addTag":
          return cmdAddTag(tokens[2]);
        case "branch":
          return cmdBranch();
        case "tag":
          return cmdTag();
        case "log":
          return cmdLog();
      }
    }
  }
  throw new CommandError(
    `'${command}' is not a valid gitVis command. See 'gitVis --help'.`
  );
};

const useScale = (wrapper, container) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (wrapper.current && container.current) {
      const wrapperBoundingRect = wrapper.current.getBoundingClientRect();
      const containerBoundingRect = container.current.getBoundingClientRect();

      const { width: wrapperWidth, height: wrapperHeight } =
        wrapperBoundingRect;
      const { width: containerWidth, height: containerHeight } =
        containerBoundingRect;
      const bufferZoneWidth = 100;
      const bufferZoneHeight = 100;
      if (containerWidth >= wrapperWidth - bufferZoneWidth) {
        console.log("reached");
        const resizeZone = 200;
        const currentTransform = scale;
        const newTransform =
          (wrapperWidth - resizeZone) / (containerWidth / currentTransform);
        setScale(newTransform);
      } else if (containerHeight >= wrapperHeight - bufferZoneHeight) {
        console.log("reached height");
        const resizeZone = 200;
        const currentTransform = scale;
        const newTransform =
          (wrapperHeight - resizeZone) / (containerHeight / currentTransform);
        setScale(newTransform);
      }
    }
  }, [wrapper, container, scale]);
  return scale;
};

function GraphVis() {
  const [termHist, setTermHist] = useState([
    { type: "command", content: "git init" },
    { type: "command", content: 'git commit -m "Intial Commit"' },
  ]);
  const termHistRef = useRef(termHist);

  const graphContainerRef = createRef();
  const graphWrapperRef = createRef();
  let scale = useScale(graphWrapperRef, graphContainerRef);

  const handleCommandEntryKeypress = (e) => {
    if (!(e.key === "Enter")) return;
    if (e.target.value === "") return;
    termHistRef.current.push({ type: "command", content: e.target.value });
    try {
      const lines = getCmd(e.target.value, cmdLib);
      if (lines) {
        for (const line of lines) {
          termHistRef.current.push({ type: "standard", content: line });
        }
      }
    } catch (err) {
      termHistRef.current.push({ type: "error", content: err.toString() });
    }
    setTermHist([...termHistRef.current]);
  };

  useEffect(() => {
    function handleResize() {
      //Force rerender
      setTermHist([...termHist]);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <Flex
      h="100vh"
      w="100vw"
      justify="space-between"
      p={{ base: "10px", lg: "50px" }}
      direction={{ base: "column-reverse", lg: "row" }}
      overflow="auto"
    >
      <Flex
        direction="column"
        w={{ base: "100%", lg: "300px", xl: "400px", "2xl": "500px" }}
        h={{ base: "400px", lg: "100%" }}
        minH={{ base: "400px", lg: "100%" }}
      >
        <Box flexGrow={1} overflowX={"hidden"} overflowY="auto">
          <TerminalDisplay termHist={termHist} />
        </Box>
        <CommandEntry handleKeyUp={handleCommandEntryKeypress} />
      </Flex>
      <Box
        ref={graphWrapperRef}
        minH={{ base: "300px", lg: "100%" }}
        w={{ base: "100%", lg: "650px", xl: "750px", "2xl": "950px" }}
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          ref={graphContainerRef}
          display="flex"
          justifyContent={"center"}
          alignItems={"flex-start"}
          transform={`scale(${scale})`}
        >
          <Gitgraph
            options={{
              author: "Your Name <you@example.com>",
              mode: "compact",
              orientation: "horizontal",
              template: templateExtend("metro", {
                colors: ["#b0bec5", "#b39ddb", "#4fc3f7", "#ffa726", "#d4e157"],
              }),
            }}
          >
            {(gitgraph) => {
              initDefaults(gitgraph);
              cmdCommit("First Commit");
            }}
          </Gitgraph>
        </Box>
      </Box>
    </Flex>
  );
}

export default GraphVis;
