import * as readline from "node:readline/promises";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stdin as input, stdout as output } from "node:process";

import FsHandler from "./handlers/fsHandler.js";
import { parseArgs } from "./helpers/args.js";
import { osMethods } from "./handlers/osHandler.js";
import { calculateHash } from "./handlers/hashHandler.js";
import { compress, decompress } from "./handlers/zipHandler.js";

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
        await FsHandler.cat(__dirname, join("..", "HELP.txt"));
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
        await FsHandler.ls(currentPath);
        return;
      case command === "up":
        const upperPath = await FsHandler.cd(currentPath, "..");
        if (upperPath) {
          currentPath = upperPath;
        }
        return;
      case command === "cd":
        const newPath = await FsHandler.cd(currentPath, args[0]);
        if (newPath) {
          currentPath = newPath;
        }
        return;
      case command === "cat":
        const data = await FsHandler.cat(currentPath, args[0]);
        return data;
      case command === "add":
        await FsHandler.add(currentPath, args[0]);
        return;
      case command === "rn":
        await FsHandler.rn(currentPath, args[0], args[1]);
        return;
      case command === "cp":
        const cpData = await FsHandler.cp(
          currentPath,
          args[0],
          args[1]
        );
        return cpData;
      case command === "mv":
        await FsHandler.mv(currentPath, args[0], args[1]);
        return;
      case command === "rm":
        await FsHandler.rm(currentPath, args[0]);
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
