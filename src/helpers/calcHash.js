import * as crypto from "crypto";
import * as fs from "fs/promises";
import { join } from "path";

export const calculateHash = async (currentPath, pathArg) => {
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
    const data = await fs.readFile(path);
    const hashSum = crypto.createHash("sha256");
    hashSum.update(data);
    const hex = hashSum.digest("hex");
    console.log(hex);
  } catch (e) {
    console.log("Operation failed");
  }
};
