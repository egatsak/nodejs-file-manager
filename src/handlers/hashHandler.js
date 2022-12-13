import * as crypto from "node:crypto";
import * as fs from "node:fs/promises";

import { pathResolver } from "../helpers/pathResolver.js";
import { errorHandler } from "../helpers/errorHandler.js";

export const calculateHash = async (currentPath, pathArg) => {
  try {
    const path = pathResolver(currentPath, pathArg);
    const data = await fs.readFile(path);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(data);
    const hex = hashSum.digest("hex");
    console.log(hex);
  } catch (e) {
    errorHandler(e, "ENOENT");
  }
};
