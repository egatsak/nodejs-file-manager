const parseEnv = () => {
  const arr = Object.entries(process.env).filter((item) =>
    item[0].startsWith("RSS_")
  );
  arr.forEach((item) =>
    process.stdout.write(item[0] + "=" + item[1] + "\n")
  );
};

parseEnv();
