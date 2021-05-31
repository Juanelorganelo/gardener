/**
 * A fancy-test plugin to write a Gardener configuration fixture.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import fs from "fs";
import path from "path";
import yaml from "yaml";

import type { FancyTypes } from "@oclif/test";
import type { Config } from "../../src/config";

/**
 * Context used by the write-config plugin.
 */
interface WriteConfigContext extends FancyTypes.Context {
  /**
   * The file path to the configuration.
   */
  file: string;
}

/**
 * A fancy-test plugin to write Gardener's configuration fixtures.
 * @param config The Gardener configuration to write.
 * @param file The path to the configuration file. Defaults to '.gardenerrc.yml' on PWD.
 * @return The fancy-test plugin.
 */
export function writeConfig(
  config: Partial<Config>,
  file = path.join(process.cwd(), ".gardenerrc.yml"),
): FancyTypes.Plugin<WriteConfigContext> {
  return {
    run(ctx: WriteConfigContext) {
      ctx.file = file;
      fs.writeFileSync(file, yaml.stringify(config));
    },
    finally(ctx: WriteConfigContext) {
      fs.unlinkSync(ctx.file);
      ctx.file = "";
    },
  };
}
