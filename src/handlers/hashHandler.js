import * as crypto from "node:crypto";
import {createReadStream} from "node:fs";

import {pathResolver} from "../helpers/pathResolver.js";
import {errorHandler} from "../helpers/errorHandler.js";

export const calculateHash = async (currentPath, pathArg) => {
  try {
    const path = pathResolver(currentPath, pathArg);
    const dataStream = createReadStream(path);
    const hash = crypto.createHash("sha256");

    dataStream.pipe(hash).on("finish", () => {
      console.log(hash.digest("hex"));
    });
  } catch (e) {
    errorHandler(e, "ENOENT");
  }
};
