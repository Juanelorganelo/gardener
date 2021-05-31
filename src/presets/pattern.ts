/**
 * The PatternPreset class.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import { Minimatch } from "minimatch";

import type { Preset } from "./preset";
import type { Nullable } from "../types";

/**
 * Options for the pattern preset.
 */
export interface PatternPresetOptions {
  /**
   * A glob pattern used to validate the branch name.
   */
  glob?: string;
  /**
   * A RegExp pattern used to validate the branch name.
   */
  pattern?: string;
}

/**
 * A Gardener preset to ensure branch names comply with a glob pattern.
 */
export class PatternPreset implements Preset {
  /**
   * Create a PatternPreset instance.
   * @param options The preset options.
   */
  constructor(private options?: PatternPresetOptions) {
    if (options?.pattern && options?.glob) {
      throw new Error("Only one of the `glob` or `pattern` options must be provided");
    }
    if (options?.pattern && options?.glob) {
      throw new Error(
        "You must provide the `pattern` option or `glob` to the pattern preset but not both",
      );
    }
  }

  /**
   * Ensure that a branch name matches a regular expression or glob pattern.
   * @param branch The branch name.
   * @return An error message if branch name did not passed validation, otherwise null.
   */
  public validate(branch: string): Nullable<string> {
    const isGlob = typeof this.options?.glob !== "undefined";

    let isValid: boolean;
    if (isGlob) {
      const p = new Minimatch(this.options!.glob!);
      isValid = p.match(branch);
    } else {
      const p = new RegExp(this.options!.pattern!);
      isValid = p.test(branch);
    }

    return isValid
      ? null
      : `Invalid branch name ${branch}. Branch names must match ${
          isGlob ? "glob" : "regular expression"
        } ${isGlob ? this.options!.glob : this.options!.pattern}`;
  }
}
