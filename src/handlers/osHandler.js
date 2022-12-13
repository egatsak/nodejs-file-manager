import os from "node:os";

export const osMethods = {
  EOL: () => {
    console.log(os.EOL);
  },
  cpus: () => {
    console.log(os.cpus());
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
