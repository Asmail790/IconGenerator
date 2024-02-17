import { afterAll, beforeAll, test } from "@jest/globals";
import { execSync } from "child_process";
import config from "./drizzle.test.config"
import {file} from "./drizzle.test.config"

beforeAll(() => {
  execSync(`npm run`,{input:`generate  --  --config ${file}`});
});

afterAll(() => {
  execSync(`rm -rf ${config.out}`);

test("1", () => {});
