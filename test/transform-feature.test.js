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

test("should handle class fields", (t) => {
	const inputCode = `
    class Counter {
      count = 0;
      increment() {
        this.count++;
      }
    }
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should handle private class fields", (t) => {
	const inputCode = `
    class Counter {
      #count = 0;
      increment() {
        this.#count++;
      }
      getCount() {
        return this.#count;
      }
    }
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should handle nullish coalescing", (t) => {
	const inputCode = `
    const value = null ?? 'default';
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});
