const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const execSyncWrapper = (command) => {
  try {
    return execSync(command).toString().trim();
  } catch (error) {
    console.error(`Error executing command "${command}":`, error.message);
    return null;
  }
};

const main = () => {
  let gitBranch = execSyncWrapper("git rev-parse --abbrev-ref HEAD");
  let gitCommitHash = execSyncWrapper("git rev-parse --short=7 HEAD");

  if (gitBranch === null || gitCommitHash === null) {
    console.error("Failed to retrieve Git information.");
    gitBranch = "unknown";
    gitCommitHash = "unknown";
  }

  const obj = {
    gitBranch,
    gitCommitHash,
  };

  const filePath = path.resolve(__dirname, "../../gitInfo.json");
  const fileContents = JSON.stringify(obj, null, 2);

  fs.writeFileSync(filePath, fileContents);
  console.log(`Wrote the following contents to ${filePath}\n${fileContents}`);
};

main();