import * as zlib from "node:zlib";
import * as fs from "node:fs";

import { errorHandler } from "../helpers/errorHandler.js";
import { pathChecker } from "../helpers/pathChecker.js";

export const compress = async (
  currentPath,
  sourceFilePath,
  targetFilePath
) => {
  try {
    const { prevFilePath, newFilePath } = await pathChecker(
      currentPath,
      sourceFilePath,
      targetFilePath
    );
    const readStream = fs.createReadStream(prevFilePath);

    readStream
      .pipe(zlib.createBrotliCompress())
      .pipe(fs.createWriteStream(newFilePath))
      .on("finish", async () => {
        console.log("Compression done!");
      });
  } catch (e) {
    errorHandler(e, "ENOENT");
  }
};

export const decompress = async (
  currentPath,
  sourceFilePath,
  targetFilePath
) => {
  try {
    const { prevFilePath, newFilePath } = await pathChecker(
      currentPath,
      sourceFilePath,
      targetFilePath
    );

    fs.createReadStream(prevFilePath)
      .pipe(zlib.createBrotliDecompress())
      .pipe(fs.createWriteStream(newFilePath))
      .on("finish", async () => {
        console.log("Decompression done!");
      });
  } catch (e) {
    errorHandler(e, "ENOENT");
  }
};
