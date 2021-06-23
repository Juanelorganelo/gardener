/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
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
