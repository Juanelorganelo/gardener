import { expect } from "@oclif/test";
import path from "path";
import Gardener from "../src";
import { test } from "./support";

describe("git", () => {
  const repo = test.git(path.join(__dirname, "fixtures", "repo"));

  repo
    .stdout()
    .config({
      exclude: ["foo"],
    })
    .checkout("foo", { b: true })
    .do(() => Gardener.run([]))
    .it("lints the current branch", (ctx) => {
      expect(ctx.stdout).to.contain("Branch foo configured as excluded, skipping");
    });
});
