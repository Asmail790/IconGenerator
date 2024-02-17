import { glob } from "glob";
import path from "node:path";

const paths = await (async function () {
  const jsfiles = (
    await glob("src/app/**/page.tsx", { ignore: "node_modules/**" })
  ).map((srcfile) =>
   "/"+ path.relative("src/app/", srcfile).replace("page.tsx", "")
  )
  return jsfiles;
})();


export function checkPath(path:string){
  if (! paths.includes(path)){
    throw Error("faulty path")
  }

  return path
}