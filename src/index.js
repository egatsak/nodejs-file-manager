import * as readline from "readline/promises";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { stdin as input, stdout as output } from "process";

import FsCommandHandler from "./handlers/fsCommandHandler.js";
import { parseArgs } from "./helpers/args.js";
import { osMethods } from "./handlers/os.js";
import { calculateHash } from "./handlers/calcHash.js";
import { compress, decompress } from "./handlers/zip.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = parseArgs();
const username = args["username"];
let currentPath = os.homedir();

const init = async () => {
  const rl = readline.createInterface({ input, output });
  console.log(`Welcome to the File Manager, ${username}!`);
  console.log(`You are currently in ${currentPath}`);

  rl.on("line", async (data) => {
    if (data.trim() === ".exit") {
      rl.close();
      return;
    }
    const readData = await parseLine(data);

    if (readData === true) {
      console.log("Success!");
    }

    console.log(`You are currently in ${currentPath}`);
  });

  rl.on("close", () => {
    console.log(
      `Thank you for using File Manager, ${username}, goodbye!`
    );
  });
};

await init();

async function parseLine(line) {
  const parsedLine = line.split(" ");
  const [command, ...args] = parsedLine;

  try {
    switch (true) {
      case command === "help":
        await FsCommandHandler.cat(__dirname, join("..", "HELP.txt"));
        return;
      case command === "os":
        if (args.length !== 1 || !args[0].startsWith("--")) {
          throw new Error("Invalid input");
        }
        const arg = args[0].slice(2);
        const func = osMethods[arg];
        if (!func) {
          throw new Error("Invalid input");
        }
        func();
        return;
      case command === "hash":
        await calculateHash(currentPath, args[0]);
        return;
      case command === "ls":
        await FsCommandHandler.ls(currentPath);
        return;
      case command === "up":
        const upperPath = await FsCommandHandler.cd(
          currentPath,
          ".."
        );
        if (upperPath) {
          currentPath = upperPath;
        }
        return;
      case command === "cd":
        const newPath = await FsCommandHandler.cd(
          currentPath,
          args[0]
        );
        if (newPath) {
          currentPath = newPath;
        }
        return;
      case command === "cat":
        const data = await FsCommandHandler.cat(currentPath, args[0]);
        return data;
      case command === "add":
        await FsCommandHandler.add(currentPath, args[0]);
        return;
      case command === "rn":
        await FsCommandHandler.rn(currentPath, args[0], args[1]);
        return;
      case command === "cp":
        const cpData = await FsCommandHandler.cp(
          currentPath,
          args[0],
          args[1]
        );
        return cpData;
      case command === "mv":
        await FsCommandHandler.mv(currentPath, args[0], args[1]);
        return;
      case command === "rm":
        await FsCommandHandler.rm(currentPath, args[0]);
        return;
      case command === "compress":
        await compress(currentPath, args[0], args[1]);
        return;
      case command === "decompress":
        await decompress(currentPath, args[0], args[1]);
        return;
      default:
        throw new Error("Invalid input");
    }
  } catch (e) {
    console.log(e.message);
  }
}
