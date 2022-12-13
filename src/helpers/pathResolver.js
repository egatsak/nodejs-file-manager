import { isAbsolute, join, sep, parse } from "path";
import os from "os";

export const pathResolver = (currentPath, pathArg) => {
  if (!pathArg) {
    throw new Error("Invalid input");
  }
  let path = "";

  if (pathArg.startsWith("~")) {
    return join(os.homedir(), pathArg.slice(1));
  }

  if (pathArg.match(/^[a-zA-Z]:$/gm)) {
    path = pathArg + sep;
    return path;
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
