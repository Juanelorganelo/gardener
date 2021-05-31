/* eslint-disable @typescript-eslint/ban-types */
/**
 * The Preset type.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright Juan Manuel Garcia Junco Moreno. All rights reserved
 */
import type { Nullable } from "../types";

/**
 * The Preset class.
 * Presets are objects used to validate a branch name.
 */
export interface Preset {
  /**
   * The method used by the preset to ensure branch names are compliant.
   * Should return an error message if branch name is invalid and null otherwise.
   * @param branch The branch name to validate.
   * @return The error message if the branch name is invalid, null otherwise.
   */
  validate(branch: string): Nullable<string> | Promise<Nullable<string>>;
}

/**
 * The preset ID enumeration.
 * These are all of the available presets.
 */
export enum Presets {
  /**
   * The ID for the PatternPreset class.
   */
  PATTERN = "pattern",
  /**
   * The ID for the GitFlowPreset class.
   */
  GIT_FLOW = "git-flow",
}

/**
 * A type representing the constructor function for Preset objects.
 */
export interface PresetConstructor {
  /**
   * The constructor call signature.
   */
  new (options?: Object): Preset;
}
