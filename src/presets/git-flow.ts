/**
 * The GitFlow preset.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import { Preset, Presets } from "./preset";
import type { Nullable } from "../types";

const GIT_FLOW_BRANCH = /^(?<type>[\w-]+)\/(?<descriptor>[\w\W\-_.[\]()]+)$/;

/**
 * Options for the git-flow preset.
 */
export interface GitFlowOptions {
  /**
   * Issue number options.
   * If present, the preset will verify that
   * an issue number is present at the descriptor part of the branch.
   */
  issueNumber?: {
    /**
     * Issue number pattern.
     */
    pattern: string;
    /**
     * True if the issue number is not required.
     */
    optional?: boolean;
    /**
     * True if the issue number appears as a suffix to the description.
     * If both suffix and prefix are present issue number maybe at any of those locations.
     */
    suffix?: boolean;
    /**
     * True if the issue number appears as a prefix to the description.
     * If both suffix and prefix are present issue number maybe at any of those locations.
     */
    prefix?: boolean;
  };
  /**
   * A list of additional branch types.
   */
  additionalBranchTypes?: string[];
}

const BRANCH_TYPES = ["feature", "release", "bugfix", "hotfix"];
const SPECIAL_BRANCHES = ["master", "main", "develop"];

/**
 * The GitFlow preset.
 * This validates that the branch is a GitFlow compliant branch.
 * For more information on GitFlow checkout https://datasift.github.io/gitflow/IntroducingGitFlow.html.
 */
export class GitFlowPreset implements Preset {
  public static readonly id = Presets.GIT_FLOW;

  /**
   * Create a GitFlowPreset instance
   * @param options An object containing preset options.
   */
  constructor(private options?: GitFlowOptions) {}

  /**
   * Verefies that branch follows the GitFlow naming convention.
   * @param branch The branch to verify.
   * @return Null if branch follows GitFlow's naming convention, otherwise a string containing the validation error message.
   */
  public validate(branch: string): Nullable<string> {
    if (SPECIAL_BRANCHES.includes(branch)) {
      return null;
    }

    const matches = GIT_FLOW_BRANCH.exec(branch);

    if (!matches) {
      return "Invalid branch name. GitFlow branches must match the following pattern <type>/<description>";
    }

    const groups = matches.groups as { type: string; descriptor: string };
    const branchTypes = this.options?.additionalBranchTypes
      ? BRANCH_TYPES.concat(this.options.additionalBranchTypes)
      : BRANCH_TYPES;

    if (!branchTypes.includes(groups.type)) {
      return `Invalid GitFlow branch type ${groups.type}`;
    }

    if (this.options?.issueNumber) {
      const pattern = new RegExp(this.options.issueNumber.pattern, "g");
      const matches = pattern.exec(groups.descriptor);

      if (!matches) {
        if (!this.options.issueNumber.optional) {
          return "Invalid branch description. Missing issue number";
        }
        return null;
      }

      if (matches.length > 0) {
        return "Invalid branch description. Multiple issue numbers detected";
      }

      if (this.options.issueNumber.suffix) {
        const end = matches.index + matches[0].length;

        if (end !== groups.descriptor.length) {
          return "Invalid issue number. Must be a suffix";
        }
      }
      if (this.options.issueNumber.prefix && matches.index !== 0) {
        return "Invalid issue number. Must be a prefix";
      }
    }

    return null;
  }
}
