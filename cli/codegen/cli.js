import { decodeCsv, printErr } from "../util.js";
import { codegen } from "./codegen.js";

const USAGE = "Usage: yarn run codegen game1,game2";

function start() {
  const argv = process.argv;
  if (argv.length === 2) {
    codegen();
  } else if (argv.length === 3) {
    codegen(decodeCsv(argv[2]));
  } else {
    printErr(USAGE);
    process.exit(1);
  }
}
start();
