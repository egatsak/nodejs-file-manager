import * as zlib from "zlib";
import * as fsPromises from "fs/promises";
import { join, parse } from "path";
import * as fs from "fs";

export const compress = async (
  currentPath,
  sourceFilePath,
  targetFilePath
) => {
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

    await fsPromises.access(oldFilePath);
    const { dir, base } = parse(newFilePath);

    const targetDirListing = await fsPromises.readdir(dir);
    if (targetDirListing.includes(base)) {
      throw new Error("Operation failed. File already exists");
    }

    const readStream = fs.createReadStream(oldFilePath);

    readStream
      .pipe(zlib.createBrotliCompress())
      .pipe(fs.createWriteStream(newFilePath))
      .on("finish", async () => {
        console.log("Compression done!");
      });
  } catch (e) {
    if (e.message.includes("ENOENT")) {
      console.log("Operation failed ;", e.message);
    } else {
      console.log(e.message);
    }
  }
};

export const decompress = async (
  currentPath,
  sourceFilePath,
  targetFilePath
) => {
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

    await fsPromises.access(oldFilePath);

    const { dir, base } = parse(newFilePath);
    const targetDirListing = await fsPromises.readdir(dir);

    if (targetDirListing.includes(base)) {
      throw new Error("Operation failed. File already exists");
    }
    fs.createReadStream(oldFilePath)
      .pipe(zlib.createBrotliDecompress())
      .pipe(fs.createWriteStream(newFilePath))
      .on("finish", async () => {
        console.log("Decompression done!");
      });
  } catch (e) {
    if (e.message.includes("ENOENT")) {
      console.log("Operation failed ;", e.message);
    } else {
      console.log(e.message);
    }
  }
};
