import { isAbsolute, join, sep, parse } from "node:path";
import os from "node:os";

export const pathResolver = (currentPath, pathArg) => {
  if (!pathArg) {
    throw new Error("Invalid input");
  }

  if (pathArg.startsWith("~")) {
    return join(os.homedir(), pathArg.slice(1));
  }

  if (pathArg.match(/^[a-zA-Z]:$/gm)) {
    return pathArg + sep;
  }

  if (isAbsolute(pathArg)) {
    if (pathArg.startsWith(sep)) {
      const { root } = parse(currentPath);
      return join(root, pathArg);
    }
    return pathArg;
  }

  return join(currentPath, pathArg);
};
