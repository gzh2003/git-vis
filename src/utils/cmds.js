import CommandError from "./CommandError";

let global = { user: { name: "Your Name", email: "you@example.com" } };
let headPointer = "main";
// let workingDirectory = { unmodified: {}, staged: {}, modified: {} };
let branches = {};
let log = {};
let tags = [];

const initDefaults = (gitgraph) => {
  branches = { main: gitgraph.branch("main") };
  log["main"] = [];
};

const cmdConfigGlobalName = (name) => {
  global = { user: { name, email: global.user.email } };
};
const cmdConfigGlobalEmail = (email) => {
  global = { user: { name: global.user.name, email } };
};
const cmdCommit = (msg) => {
  if (!msg) {
    throw new CommandError("Aborting commit due to empty message.");
  }
  branches[headPointer].commit({
    subject: msg,
    author: `${global.user.name} <${global.user.email}>`,
  });
  const commit =
    branches[headPointer]._graph.commits[
      branches[headPointer]._graph.commits.length - 1
    ];
  log[headPointer].push({
    hash: commit.hash,
    name: commit.author.name,
    email: commit.author.email,
    time: commit.author.timestamp,
    msg,
  });
};

const cmdAddBranch = (branch) => {
  const isValidBranchName = branch.match(/^[\S]+$/);
  if (!isValidBranchName) {
    throw new CommandError(`'${branch}' is not a valid branch name.`);
  }
  if (branch in branches) {
    throw new CommandError(`A branch named '${branch}' already exists.`);
  }
  branches[branch] = branches[headPointer].branch(branch);
  log[branch] = [...log[headPointer]];
};
const cmdMergeBranch = (branch) => {
  if (!(branch in branches)) {
    throw new CommandError("test3 - not something we can merge");
  }
  if (headPointer === branch) {
    throw new CommandError("Already up to date.");
  }

  branches[headPointer].merge(branch);
  log[headPointer] = [...log[headPointer], ...log[branch]];
};
const cmdDeleteBranch = (branch) => {
  if (!(branch in branches)) {
    throw new CommandError(`branch '${branch}' not found.`);
  }
  if (headPointer === branch) {
    throw new CommandError(`Cannot delete checked out branch '${branch}'`);
  }
  branches[branch].delete();
  delete branches[branch];
  delete log[branch];
};
const cmdCheckout = (newCheckoutBranch) => {
  if (!(newCheckoutBranch in branches)) {
    throw new CommandError(
      `pathspec '${newCheckoutBranch}' did not match any file(s) known to git`
    );
  }
  if (headPointer === newCheckoutBranch) {
    throw new CommandError(`Already on '${newCheckoutBranch}'`);
  }
  branches[newCheckoutBranch].checkout();
  headPointer = newCheckoutBranch;
};
const cmdAddTag = (tag) => {
  const isValidTagName = tag.match(/^[\S]+$/);
  if (!isValidTagName) {
    throw new CommandError(`'${tag}' is not a valid tag name.`);
  }
  try {
    branches[headPointer].tag(tag);
    tags.push(tag);
  } catch (e) {
    if (e.toString() === `Error: The ref "${headPointer}" does not exist`) {
      throw new Error(
        "GitVis requires that a branch have a commit before adding a label."
      );
    } else {
      throw e;
    }
  }
};

const cmdBranch = () => {
  return Object.keys(branches);
};

const cmdTag = () => {
  return tags;
};

const cmdLog = () => {
  const lines = [];
  for (let commit of log[headPointer]) {
    lines.push(`Commit: ${commit.hash}`);
    lines.push(`Author: ${commit.name} ${commit.email}`);
    lines.push("Date:" + commit.time);
    lines.push(commit.msg);
  }
  return lines;
};

export default initDefaults;

export {
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
};
