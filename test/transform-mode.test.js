const { test, snapshot } = require("node:test");
const { transformSync } = require("../dist/index.js");
const path = require("node:path");

// Set the path for the snapshots directory
snapshot.setResolveSnapshotPath((testPath) => {
	return path.join(
		__dirname,
		"snapshots",
		`${path.basename(testPath)}.snapshot`,
	);
});

test("should transform ES6 modules", (t) => {
	const inputCode = `
    import { add, subtract } from './math.js';
    const result = add(5, 3);
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should transform async/await", (t) => {
	const inputCode = `
    async function fetchData() {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      return data;
    }
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should handle optional chaining and nullish coalescing", (t) => {
	const inputCode = `
    const user = {
      name: 'Sila',
      preferences: {
        theme: 'dark'
      }
    };
    const theme = user?.preferences?.theme ?? 'light';
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});

test("should handle top-level await", (t) => {
	const inputCode = `
    const data = await fetchData();
  `;
	const { code } = transformSync(inputCode, {
		mode: "transform",
		sourceMaps: true,
	});
	t.assert.snapshot(code);
});
