import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { join, parse } from "path";

import streamToString from "../helpers/streamToString.js";
import { pathResolver } from "../helpers/pathResolver.js";
import { errorHandler } from "../helpers/errorHandler.js";

export default class FsCommandHandler {
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
      errorHandler(e, "ENOENT");
    }
  }

  static async cd(currentPath, pathArg) {
    try {
      const newPath = pathResolver(currentPath, pathArg);
      await fs.access(newPath);
      return newPath;
    } catch (e) {
      errorHandler(e, "ENOENT");
    }
  }

  static async cat(currentPath, pathArg) {
    try {
      const path = pathResolver(currentPath, pathArg);
      const stream = createReadStream(path);
      console.log(await streamToString(stream));
    } catch (e) {
      errorHandler(e, "ENOENT");
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
      errorHandler(e, "EEXIST");
    }
  }

  static async rn(currentPath, sourceFilePath, targetFileName) {
    try {
      const oldFilePath = pathResolver(currentPath, sourceFilePath);
      const { dir } = parse(oldFilePath);
      const newFilePath = pathResolver(dir, targetFileName);
      const targetDirListing = await fs.readdir(dir);

      if (targetDirListing.includes(targetFileName)) {
        throw new Error("Operation failed. File already exists");
      }

      await fs.rename(oldFilePath, newFilePath);
      console.log("File successfully renamed");
    } catch (e) {
      errorHandler(e, "ENOENT");
    }
  }

  static async cp(currentPath, sourceFilePath, targetDirPath) {
    try {
      const oldFilePath = pathResolver(currentPath, sourceFilePath);
      const newDirPath = pathResolver(currentPath, targetDirPath);

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
      errorHandler(e, "ENOENT", "ENOTDIR");
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
      errorHandler(e, "ENOENT", "ENOTDIR");
    }
  }

  static async rm(currentPath, pathArg) {
    try {
      const path = pathResolver(currentPath, pathArg);
      await fs.rm(path);
      console.log("Source file successfully removed");
    } catch (e) {
      errorHandler(e, "ENOENT", "ENOTDIR");
    }
  }
}
