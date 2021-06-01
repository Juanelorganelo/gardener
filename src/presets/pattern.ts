/**
 * The PatternPreset class.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import type { Preset } from "./preset";
import type { Nullable } from "../types";

/**
 * Options for the pattern preset.
 */
export interface PatternPresetOptions {
  /**
   * A RegExp pattern used to validate the branch name.
   */
  pattern: string;
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
    if (!options?.pattern) {
      throw new Error("You must provide the `pattern` option");
    }
  }

  /**
   * Ensure that a branch name matches a regular expression or glob pattern.
   * @param branch The branch name.
   * @return An error message if branch name did not passed validation, otherwise null.
   */
  public validate(branch: string): Nullable<string> {
    const re = new RegExp(String.raw`${this.options!.pattern}`);
    return re.test(branch)
      ? null
      : `Invalid branch name ${branch}. Branch names must match regular expression ${
          this.options!.pattern
        }`;
  }
}
