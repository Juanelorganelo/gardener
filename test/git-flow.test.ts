import { expect } from "@oclif/test";
import Gardener from "../src";
import { test } from "./support";

describe("git-flow", () => {
  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["feature/foo"]))
    .it("allows feature branches", (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["feature/foo"]))
    .it("allows bugfix branches", (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["feature/foo"]))
    .it("allows hotfix branches", (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["feature/foo"]))
    .it("allows release branches", (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["main"]))
    .it('doesnt error on "main" branches', (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["master"]))
    .it('doesnt error on "master" branches', (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });

  test
    .stdout()
    .stderr()
    .do(() => Gardener.run(["develop"]))
    .it('doesnt error on "develop" branches', (ctx) => {
      expect(ctx.stderr).to.be.empty;
    });
});
