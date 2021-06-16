import { test as fancy } from "@oclif/test";
import { checkout, git } from "./git";
import { writeConfig } from "./write-config";

export const test = fancy
  .register("config", writeConfig)
  .register("git", git)
  .register("checkout", checkout);
