const { test, snapshot } = require("node:test");
const { transformSync } = require("../dist/index.js");
const path = require("node:path");

snapshot.setResolveSnapshotPath((testPath) => {
	return path.join(
		__dirname,
		"snapshots",
		`${path.basename(testPath)}.snapshot`,
	);
});

test("should handle class decorators", (t) => {
	const inputCode = `
    @sealed
    class BugReport {
      type = "report";
      title: string;
      constructor(t: string) {
        this.title = t;
      }
    }

    function sealed(constructor: Function) {
      Object.seal(constructor);
      Object.seal(constructor.prototype);
    }
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should handle namespaces", (t) => {
	const inputCode = `
    namespace Validation {
      export interface StringValidator {
        isAcceptable(s: string): boolean;
      }
      const lettersRegexp = /^[A-Za-z]+$/;
      export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
          return lettersRegexp.test(s);
        }
      }
    }
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});
