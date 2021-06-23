/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { test as fancy } from "@oclif/test";
import { checkout, git } from "./git";
import { writeConfig } from "./write-config";

export const test = fancy
  .register("config", writeConfig)
  .register("git", git)
  .register("checkout", checkout);
