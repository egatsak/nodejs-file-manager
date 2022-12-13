import * as readline from "readline/promises";
import os from "os";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { stdin as input, stdout as output } from "process";

import CommandHandler from "./commandHandler.js";
import { parseArgs } from "./helpers/args.js";
import { calculateHash } from "./helpers/calcHash.js";
import { compress, decompress } from "./helpers/zip.js";

const args = parseArgs();
const username = args["username"];
let currentPath = os.homedir();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const osMethods = {
  EOL: () => {
    console.log(os.EOL);
  },
  cpus: () => {
    console.log(os.cpus());
  },
  homedir: () => {
    console.log(os.userInfo().homedir);
  },
  username: () => {
    console.log(os.userInfo().username);
  },
  architecture: () => {
    console.log(os.arch());
  }
};

async function parseLine(line) {
  const parsedLine = line.split(" ");
  const [command, ...args] = parsedLine;

  try {
    switch (true) {
      case command === "help":
        await CommandHandler.cat(__dirname, join("..", "HELP.txt"));
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
        await CommandHandler.ls(currentPath);
        break;
      case command === "up":
        const upperPath = await CommandHandler.cd(currentPath, "..");
        if (upperPath) {
          currentPath = upperPath;
        }
        break;
      case command === "cd":
        const newPath = await CommandHandler.cd(currentPath, args[0]);
        if (newPath) {
          currentPath = newPath;
        }
        break;
      case command === "cat":
        const data = await CommandHandler.cat(currentPath, args[0]);
        return data;
      case command === "add":
        await CommandHandler.add(currentPath, args[0]);
        break;
      case command === "rn":
        await CommandHandler.rn(currentPath, args[0], args[1]);
        break;
      case command === "cp":
        const cpData = await CommandHandler.cp(
          currentPath,
          args[0],
          args[1]
        );
        return cpData;
      case command === "mv":
        await CommandHandler.mv(currentPath, args[0], args[1]);
        break;
      case command === "rm":
        await CommandHandler.rm(currentPath, args[0]);
        break;
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
    /*    
      await readData?.pipe(output);
    */
    console.log(`You are currently in ${currentPath}`);
  });

  rl.on("close", () => {
    console.log(
      `Thank you for using File Manager, ${username}, goodbye!`
    );
  });
};

await init();
