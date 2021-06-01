import { expect } from "@oclif/test";
import { test } from "./support";
import Gardener from "../src";

describe("config", () => {
  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain(
        "Invalid branch name. GitFlow branches must match the following pattern <type>/<description>",
      );
    })
    .it("uses a git-flow preset by default");

  test
    .stdout()
    .do(() => Gardener.run(["foo", "--exclude", "foo"]))
    .it("skips the given branch from linting", (ctx) => {
      expect(ctx.stdout).to.contain("Branch foo configured as excluded, skipping");
    });

  test
    .stdout()
    .config({ exclude: ["foo"] })
    .do(() => Gardener.run(["foo"]))
    .it("uses the config defined in the rc file", (ctx) => {
      expect(ctx.stdout).to.contain("Branch foo configured as excluded, skipping");
    });

  test
    .stdout()
    .config({ preset: "foo" })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid preset");
    })
    .it("should throw on invalid preset names");

  test
    .stdout()
    .config({ exclude: ["foo"] })
    .do(() => Gardener.run(["bar", "--exclude", "bar"]))
    .it("overrides the exclude option with the --exclude flag", (ctx) => {
      expect(ctx.stdout).to.contain("Branch bar configured as excluded, skipping");
    });

  test
    .stdout()
    .config({
      preset: {
        name: "pattern",
        options: {
          pattern: "^\\w+$",
        },
      },
    })
    .do(() => Gardener.run(["feature/foo", "--preset", "git-flow"]))
    .it("overrides the preset option with the --preset flag", (ctx) => {
      expect(ctx.stdout).to.be.empty;
    });

  test
    .stdout()
    .config(
      {
        exclude: ["foo"],
      },
      { format: "js" },
    )
    .do(() => Gardener.run(["foo"]))
    .it("supports config files written in JavaScript", (ctx) => {
      expect(ctx.stdout).to.contain("Branch foo configured as excluded, skipping");
    });

  test
    .stdout()
    .config(
      {
        exclude: ["foo"],
      },
      { format: "json" },
    )
    .do(() => Gardener.run(["foo"]))
    .it("supports config files written in JSON", (ctx) => {
      expect(ctx.stdout).to.contain("Branch foo configured as excluded, skipping");
    });

  test
    .stdout()
    .config({
      foo: "bar",
      exclude: ["foo"],
    } as any)
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("should throw on configuration files with extra properties");

  test
    .stdout()
    .config({
      exclude: "foo",
    } as any)
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("throws if exclude property is not an array");

  test
    .stdout()
    .config({
      exclude: ["foo", true],
    } as any)
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("throws if exclude property has non-string values");

  test
    .stdout()
    .config({
      preset: {
        name: "git-flow",
      },
    })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("throws if preset is an object without an options property");

  test
    .stdout()
    .config({
      preset: {
        options: {},
      } as any,
    })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("throws if preset is an object without an name property");

  test
    .stdout()
    .config({
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      preset: 3,
    })
    .do(() => Gardener.run(["foo"]))
    .catch((error) => {
      expect(error.message).to.contain("Invalid configuration file");
    })
    .it("throws if preset is not an object nor a string");
});
