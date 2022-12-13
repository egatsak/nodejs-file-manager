import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { join, sep, parse } from "path";
import streamToString from "./stream/streamToString.js";

export default class CommandHandler {
  static async ls(currentPath) {
    try {
      const data = await fs.readdir(currentPath, {
        withFileTypes: true
      });

      const output = data.map((item) => {
        const type =
          item[Object.getOwnPropertySymbols(item)[0]] === 2
            ? "directory"
            : "file";
        return {
          name: item.name,
          type
        };
      });
      console.table(
        output.sort((a, b) => a.type.localeCompare(b.type))
      );
    } catch (e) {
      console.log(e);
    }
  }

  static async cd(currentPath, pathArg) {
    try {
      if (!pathArg) {
        throw new Error("Invalid input");
      }
      let newPath = "";
      if (pathArg.search(/^[a-zA-Z][:]/gm) === 0) {
        newPath = pathArg;
        if (pathArg.endsWith(":")) {
          newPath = pathArg + sep;
        }
      } else {
        newPath = join(currentPath, pathArg);
      }
      await fs.access(newPath);
      return newPath;
    } catch (e) {
      if (e.message.includes("ENOENT")) {
        console.log("Operation failed");
      } else {
        console.log(e.message);
      }
    }
  }

  static async cat(currentPath, pathArg) {
    try {
      if (!pathArg) {
        throw new Error("Invalid input");
      }
      let path = "";
      if (pathArg.search(/^[a-zA-Z][:]/gm) === 0) {
        path = pathArg;
      } else {
        path = join(currentPath, pathArg);
      }
      const stream = createReadStream(path);
      console.log(await streamToString(stream));
    } catch (e) {
      if (e.message.includes("ENOENT")) {
        console.log("Operation failed");
      } else {
        console.log(e.message);
      }
    }
  }

  static async add(currentPath, fileName) {
    try {
      if (!fileName) {
        throw new Error("Invalid input");
      }
      await fs.appendFile(join(currentPath, fileName), "", {
        flag: "ax"
      });
      console.log("File successfully created");
    } catch (e) {
      if (e.message.includes("Invalid input")) {
        console.log(e.message);
      } else {
        console.log("Operation failed");
      }
    }
  }

  static async rn(currentPath, sourceFilePath, targetFilePath) {
    try {
      if (!sourceFilePath || !targetFilePath) {
        throw new Error("Invalid input");
      }
      let oldFilePath, newFilePath;
      if (sourceFilePath.search(/^[a-zA-Z][:]/gm) === 0) {
        oldFilePath = sourceFilePath;
      } else {
        oldFilePath = join(currentPath, sourceFilePath);
      }
      if (targetFilePath.search(/^[a-zA-Z][:]/gm) === 0) {
        newFilePath = targetFilePath;
      } else {
        newFilePath = join(currentPath, targetFilePath);
      }

      const { dir, base } = parse(newFilePath);
      const targetDirListing = await fs.readdir(dir);

      if (targetDirListing.includes(base)) {
        throw new Error("Operation failed. File already exists");
      }
      await fs.rename(oldFilePath, newFilePath);
      console.log("File successfully renamed");
    } catch (e) {
      if (e.message.includes("ENOENT")) {
        console.log("Operation failed ;", e.message);
      } else {
        console.log(e.message);
      }
    }
  }

  static async cp(currentPath, sourceFilePath, targetDirPath) {
    try {
      if (!sourceFilePath || !targetDirPath) {
        throw new Error("Invalid input");
      }

      let oldFilePath, newDirPath;
      if (sourceFilePath.search(/^[a-zA-Z][:]/gm) === 0) {
        oldFilePath = sourceFilePath;
      } else {
        oldFilePath = join(currentPath, sourceFilePath);
      }
      if (targetDirPath.search(/^[a-zA-Z][:]/gm) === 0) {
        newDirPath = targetDirPath;
      } else {
        newDirPath = join(currentPath, targetDirPath);
      }

      await fs.access(oldFilePath);

      const { base: sourceBase } = parse(oldFilePath);

      const targetDirListing = await fs.readdir(newDirPath);
      if (targetDirListing.includes(sourceBase)) {
        throw new Error("Operation failed. File already exists");
      }

      const inputStream = createReadStream(oldFilePath);
      const outputStream = createWriteStream(
        join(newDirPath, sourceBase)
      );

      inputStream.pipe(outputStream);

      return true;
    } catch (e) {
      if (e.message.includes("ENOENT")) {
        console.log("Operation failed ;", e.message);
      } else {
        console.log(e.message);
      }
    }
  }

  static async mv(currentPath, sourceFilePath, targetDirPath) {
    try {
      const isCopied = await this.cp(
        currentPath,
        sourceFilePath,
        targetDirPath
      );

      if (isCopied) {
        await this.rm(currentPath, sourceFilePath);
        console.log("File successfully moved");
      }
    } catch (e) {
      console.log(e);
    }
  }

  static async rm(currentPath, pathArg) {
    try {
      if (!pathArg) {
        throw new Error("Invalid input");
      }
      let path = "";
      if (pathArg.search(/^[a-zA-Z][:]/gm) === 0) {
        path = pathArg;
      } else {
        path = join(currentPath, pathArg);
      }
      await fs.rm(path);
      /*       console.log("File successfully deleted"); */
    } catch (e) {
      console.log(e);
    }
  }
}
