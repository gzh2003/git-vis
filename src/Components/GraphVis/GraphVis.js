/* eslint-disable default-case */
import { useState, useRef, useEffect } from "react";
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
import "./GraphVis.css";

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

function GraphVis() {
  const [termHist, setTermHist] = useState([]);
  const termHistRef = useRef(termHist);
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

  return (
    <div className="graphvis-container flex-container">
      <div className="terminal-container">
        <TerminalDisplay termHist={termHist} />
        <CommandEntry handleKeyUp={handleCommandEntryKeypress} />
      </div>
      <div className="gitgraph-container">
        <Gitgraph
          options={{
            author: "Your Name <you@example.com>",
            mode: null,
            orientation: "vertical-reverse",
            template: templateExtend("metro", {
              colors: ["#b0bec5", "#b39ddb", "#4fc3f7", "#ffa726", "#d4e157"],
            }),
          }}
        >
          {(gitgraph) => {
            initDefaults(gitgraph);
            cmdCommit("Initial Commit");
            cmdCommit("Initial Commit");
            cmdCommit("Initial Commit");
            cmdAddBranch("a");
            cmdCheckout("a");
            cmdCommit("Initial Commit");
            cmdAddBranch("b");
            cmdCheckout("b");
            cmdCommit("Initial Commit");
            cmdAddBranch("c");
            cmdCheckout("c");
            cmdCommit("Initial Commit");
            cmdAddBranch("d");
            cmdCheckout("d");
            cmdCommit("Initial Commit");
            cmdCheckout("main");
            cmdCommit("Initial Commit");
            cmdCommit("Initial Commit");
            cmdCommit("Initial Commit");
          }}
        </Gitgraph>
      </div>
    </div>
  );
}

export default GraphVis;
