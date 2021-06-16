/**
 * Tests for the pattern preset.
 * @author Juan Manuel Garcia Junco Moreno
 * @copyright CourseKey Inc. All rights reserved
 */
import { expect } from "@oclif/test";
import Gardener from "../src";
import { test } from "./support";

describe("pattern", () => {
  test
    .stdout()
    .config({
      preset: {
        name: "pattern",
        options: {
          pattern: "^[\\w-]$",
        },
      },
    })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid branch name foo. Branch names must match regular expression ^[\\w-]$",
      );
    })
    .it("should ensure branch matches a regular expression");

  test
    .stdout()
    .stderr()
    .config({
      preset: {
        name: "pattern",
        options: {
          pattern: "^[\\w-]+$",
        },
      },
    })
    .do(() => Gardener.run(["foo-bar"]))
    .it("passes on branches that match the regular expression", (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .config({
      preset: {
        name: "pattern",
        options: {},
      },
    })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).contain("You must provide the `pattern` option");
    })
    .it("throws if the pattern option is not present");
});
