/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable @typescript-eslint/no-use-before-define */
import fs from "fs";
import AJV from "ajv";
import path from "path";
import yaml from "yaml";
import configSchema from "./config-schema.json";

import type { GardenerFlags } from ".";

// List of configuration file names.
// File names are resolved in order.
const files = [
  ".gardenerrc.yml",
  ".gardenerrc.yaml",
  ".gardenerrc.json",
  ".gardenerrc.jsonc",
  ".gardenerrc.js",
  ".gardenerrc",
];

/**
 * Configuration for the linting presets.
 */
export interface PresetConfig<T = Record<string, unknown>> {
  /**
   * The name of the preset to use.
   */
  name: string;
  /**
   * Preset options.
   */
  options?: T;
}

/**
 * Main configuration.
 */
export interface Config {
  /**
   * The linter preset to use.
   */
  preset: string | PresetConfig;
  /**
   * A list of branches to exclude from linting.
   */
  exclude?: string[];
}

const ajv = new AJV();

/**
 * Load the Gardener configuration.
 * This will parse configuration the file.
 * @param flags Flags passed to the gardener command
 * @return The loaded configuration.
 */
export async function load(flags: GardenerFlags): Promise<Partial<Config>> {
  let config: Record<string, unknown>;

  const pkg = findPackageJson();

  if (pkg.gardener) {
    config = pkg.gardener as Record<string, unknown>;
  } else {
    const file = findUpstream(files);

    if (file) {
      config = parse(file);
    } else {
      config = {};
    }
  }

  // Override config using CLI options
  if (flags.preset) {
    config.preset = flags.preset;
  }
  if (flags.exclude) {
    config.exclude = flags.exclude;
  }

  if (!ajv.validate(configSchema, config)) {
    throw new Error("Invalid configuration file");
  }

  return config as unknown as Config;
}

function parse(file: string): Record<string, unknown> {
  const ext = path.extname(file);

  switch (ext) {
    case ".yml":
    case ".yaml":
      return yaml.parse(fs.readFileSync(file, { encoding: "utf-8" }));
    case ".json":
    case ".jsonc":
      return JSON.parse(fs.readFileSync(file, { encoding: "utf-8" }));
    case ".js":
      return require(file);
    default:
      return JSON.parse(fs.readFileSync(file, { encoding: "utf-8" }));
  }
}

function findUpstream(files: string[], cwd = process.cwd(), maxDepth = 7): string {
  let depth = 0;
  let currentDir = cwd;

  while (depth < maxDepth) {
    for (const file of files) {
      const currentPath = path.join(currentDir, file);

      if (fs.existsSync(currentPath)) {
        return currentPath;
      }
    }

    currentDir = path.resolve(currentDir, "..");
    depth++;
  }

  return "";
}

function findPackageJson(cwd?: string, maxDepth?: number): Record<string, unknown> {
  const file = findUpstream(["package.json"], cwd, maxDepth);
  return JSON.parse(fs.readFileSync(file, { encoding: "utf8" }));
}
