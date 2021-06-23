/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from "fs";
import path from "path";
import rimraf from "rimraf";
import { git as run } from "../../src/git";

import type { FancyTypes } from "fancy-test";

/**
 * Options for the git plugin.
 */
interface GitOptions {
  /**
   * Repository URL.
   * If a URL is not provided, an empty repo will be created instead.
   */
  url?: string;
}

/**
 * fancy-test context for the Git plugin.
 */
interface GitContext extends FancyTypes.Context {
  /**
   * The directory where the git repo was created.
   */
  dir: string;
  /**
   * The current working directory at the time of running the plugin.
   */
  cwd: string;
  /**
   * The repository URL.
   */
  url?: string;
}

/**
 * Git plugin for fancy-test.
 * This will create an empty repo on the given directory and add a commit to it.
 * @param dir The path to the repo's directory.
 * @param options Options object.
 * @return A fancy-test plugin object.
 */
export function git(dir: string, options?: GitOptions): FancyTypes.Plugin<GitContext> {
  return {
    async run(ctx) {
      ctx.cwd = process.cwd();
      ctx.dir = dir;
      ctx.url = options?.url;

      fs.mkdirSync(dir, { recursive: true });
      process.chdir(ctx.dir);

      await run("init");
      fs.writeFileSync(path.join(ctx.dir, ".gitkeep"), "");
      await run("add", { A: true });
      await run("commit", { m: "initial commit" });

      return ctx;
    },
    async finally(ctx) {
      process.chdir(ctx.cwd);
      rimraf.sync(ctx.dir);
    },
  };
}

interface CheckoutContext extends GitContext {
  branch: string;
}

interface CheckoutOptions {
  b?: boolean;
}

export function checkout(
  ref: string,
  flags: CheckoutOptions = {},
): FancyTypes.Plugin<CheckoutContext> {
  return {
    async run(ctx) {
      ctx.branch = ref;
      await run("checkout", flags as Record<string, unknown>, [ref]);

      return ctx;
    },
  };
}
