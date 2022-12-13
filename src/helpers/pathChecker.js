import * as fs from "node:fs/promises";
import { parse } from "node:path";

import { pathResolver } from "./pathResolver.js";

export const pathChecker = async (
  currentPath,
  sourceFilePath,
  targetFilePath
) => {
  const prevFilePath = pathResolver(currentPath, sourceFilePath);
  const newFilePath = pathResolver(currentPath, targetFilePath);

  await fs.access(prevFilePath);

  const { dir, base } = parse(newFilePath);
  const targetDirListing = await fs.readdir(dir);

  if (targetDirListing.includes(base)) {
    throw new Error("Operation failed. File already exists");
  }
  return { prevFilePath, newFilePath };
};
