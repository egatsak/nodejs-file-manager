import { join, sep } from "path";

export const pathResolver = (currentPath, pathArg) => {
  if (!pathArg) {
    throw new Error("Invalid input");
  }

  let path = "";

  if (pathArg.search(/^[a-zA-Z][:]/gm) === 0) {
    path = pathArg;
    if (pathArg.endsWith(":")) {
      path = pathArg + sep;
    }
  } else {
    path = join(currentPath, pathArg);
  }

  return path;
};
