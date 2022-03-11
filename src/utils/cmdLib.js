const cmdLib = {
  2: [
    { tokens: ["git", "branch"], key: "branch" },
    { tokens: ["git", "tag"], key: "tag" },
    { tokens: ["git", "log"], key: "log" },
    {tokens:["gitVis","--help"], key: "gitVisHelp"}
  ],
  3: [
    { tokens: ["git", "branch", "[]"], key: "addBranch" },
    { tokens: ["git", "merge", "[]"], key: "mergeBranch" },
    { tokens: ["git", "checkout", "[]"], key: "checkout" },
    { tokens: ["git", "tag", "[]"], key: "addTag" },
  ],
  4: [
    { tokens: ["git", "commit", "-m", "[]"], key: "commit" },
    { tokens: ["git", "branch", "-d", "[]"], key: "deleteBranch" },
  ],
  5: [
    {
      tokens: ["git", "config", "--global", "user.name", "[]"],
      key: "configGlobalName",
    },
    {
      tokens: ["git", "config", "--global", "user.email", "[]"],
      key: "configGlobalEmail",
    },
  ],
};

export default cmdLib;
