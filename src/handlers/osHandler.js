import os from "node:os";

export const osMethods = {
  EOL: () => {
    console.log(os.EOL);
  },
  cpus: () => {
    console.table(
      os.cpus().map(cpu => {
        return {
          "CPU model": cpu.model,
          "Speed, GHz": process.platform === "win32" ? cpu.speed / 1000 : cpu.speed // translate MHz to GHz
        };
      })
    );
    console.log(`${os.cpus().length} logical cores totally`);
    console.log(`Available parallelism for applications is ${os.availableParallelism()}`);
  },
  homedir: () => {
    console.log(os.userInfo().homedir);
  },
  username: () => {
    console.log(os.userInfo().username);
  },
  architecture: () => {
    console.log(os.arch());
  }
};
