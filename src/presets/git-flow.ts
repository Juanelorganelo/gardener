/**
 * Copyright (c) Juan Manuel Garcia Junco Moreno.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Preset, Presets } from "./preset";
import type { Nullable } from "../types";

const GIT_FLOW_BRANCH = /^(?<type>[\w-]+)\/(?<descriptor>[\w\W\-_.[\]()]+)$/;

/**
 * Options for the git-flow preset.
 */
export interface GitFlowOptions {
  /**
   * A regular expression that all
   * branch description must match.
   */
  description?: string;
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

    if (this.options?.description) {
      const re = new RegExp(this.options.description);

      if (!re.test(groups.descriptor)) {
        return `Invalid branch description. Descriptions must match regular expression ${re.source}`;
      }
    }

    return null;
  }
}
