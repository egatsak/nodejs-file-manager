export const parseArgs = () => {
  const args = process.argv.slice(2);

  const argsMap = args.reduce((acc, curr) => {
    if (curr.startsWith("--")) {
      const currArgs = curr.slice(2).split("=");
      const currKey = currArgs[0];
      const currValue = currArgs[1];
      acc[currKey] = currValue;
      return acc;
    }
  }, {});

  return argsMap;
};

//reduce!
