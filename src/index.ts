/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Command, flags } from "@oclif/command";

import { lint } from "./linter";
import { Config, load } from "./config";
import { getCurrentBranch } from "./git";

export interface GardenerFlags {
  help: void;
  version: void;
  preset?: string;
  exclude?: string[];
}

export default class Gardener extends Command {
  static description = "A simple linter for Git branches";

  static flags = {
    help: flags.help({ char: "h" }),
    version: flags.version({ char: "v" }),
    exclude: flags.string({
      char: "e",
      multiple: true,
    }),
    preset: flags.string({ char: "p" }),
  };

  static args = [
    {
      name: "branch",
    },
  ];

  async run() {
    const { args, flags } = this.parse(Gardener);

    const config = await load(flags);
    const currentBranch = args.branch ?? (await getCurrentBranch());

    if (!config.preset) {
      config.preset = "git-flow";
    }

    if (config.exclude && config.exclude.some((name) => currentBranch === name)) {
      this.log(`Branch ${currentBranch} configured as excluded, skipping`);
      return;
    }

    const errorMessage = await lint(currentBranch, config as Config);

    if (errorMessage) {
      this.error(errorMessage);
    }
  }
}
