/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import fs from "fs";
import path from "path";
import yaml from "yaml";
import serializeJavaScript from "serialize-javascript";

import type { FancyTypes } from "@oclif/test";
import type { Config } from "../../src/config";

/**
 * Available configuration formats.
 */
type ConfigFormat = "yaml" | "json" | "js";

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
 * Options for the write-config plugin.
 */
interface WriteConfigOptions {
  /**
   * The path that the config will be created in.
   * Default depends on the configuration format.
   */
  file?: string;
  /**
   * The format that the config file will be written in.
   * Defaults to "yaml".
   */
  format?: ConfigFormat;
}

/**
 * A fancy-test plugin to write Gardener's configuration fixtures.
 * @param config The Gardener configuration to write.
 * @param file The path to the configuration file. Defaults to '.gardenerrc.yml' on PWD.
 * @return The fancy-test plugin.
 */
export function writeConfig(
  config: Partial<Config>,
  { file, format }: WriteConfigOptions = {},
): FancyTypes.Plugin<WriteConfigContext> {
  let content: string;
  switch (format) {
    case "js":
      content = `module.exports = ${serializeJavaScript(config)}`;
      break;
    case "yaml":
      content = yaml.stringify(config);
      break;
    default:
      content = JSON.stringify(config);
      break;
  }

  const f = file ?? resolveConfig(format);

  return {
    run(ctx: WriteConfigContext) {
      ctx.file = f;
      fs.writeFileSync(f, content);
    },
    finally(ctx: WriteConfigContext) {
      if (ctx.file) {
        fs.unlinkSync(ctx.file);
        ctx.file = "";
      }
    },
  };
}

/**
 * Get the path to a configuration file.
 * @param format The format of the configuration file.
 * @return The path to the configuration file.
 */
function resolveConfig(format?: ConfigFormat): string {
  return path.resolve(process.cwd(), format ? `.gardenerrc.${format}` : ".gardenerrc");
}
