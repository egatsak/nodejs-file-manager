export const errorHandler = (e, ...args) => {
  if (args?.includes(e.code)) {
    console.log("Operation failed. ", e.message);
  } else {
    console.log(e.message);
  }
};
