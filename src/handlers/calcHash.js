import * as crypto from "crypto";
import * as fs from "fs/promises";

import { pathResolver } from "../helpers/pathResolver.js";

export const calculateHash = async (currentPath, pathArg) => {
  try {
    const path = pathResolver(currentPath, pathArg);
    const data = await fs.readFile(path);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(data);
    const hex = hashSum.digest("hex");
    console.log(hex);
  } catch (e) {
    console.log("Operation failed ; ", e.message);
  }
};
