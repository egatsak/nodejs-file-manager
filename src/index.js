import * as readline from "readline/promises";
import os from "os";
import { stdin as input, stdout as output } from "process";
import CommandHandler from "./commandHandler.js";
import { parseArgs } from "./cli/args.js";

const args = parseArgs();
const username = args["username"];
let currentPath = os.homedir();

async function parseLine(line) {
  const parsedLine = line.split(" ");
  const [command, ...args] = parsedLine;

  try {
    switch (true) {
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
      default:
        throw new Error("Invalid input");
    }
  } catch (e) {
    console.log(e.message);
  }
}

const init = async () => {
  const rl = await readline.createInterface({ input, output });
  console.log(`Welcome to the File Manager, ${username}!`);
  //const answer = await rl.question("What do you think of Node.js? ");

  //console.log(`Thank you for your valuable feedback: ${answer}`);

  console.log(`You are currently in ${currentPath}`);

  rl.on("line", async (data) => {
    if (data.trim() === ".exit") {
      rl.close();
      return;
    }
    const readData = await parseLine(data);
    // console.log(readData);
    if (readData) {
      console.log(readData);
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
