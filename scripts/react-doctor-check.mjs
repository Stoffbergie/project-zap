import { spawnSync } from "node:child_process";

const result = spawnSync(
	"bun",
	[
		"react-doctor",
		"--json",
		"--no-score",
		"--no-warnings",
		"--no-dead-code",
		"--category",
		"Bugs",
		"--category",
		"Security",
		"--category",
		"Accessibility",
		"--yes",
	],
	{ encoding: "utf8" },
);

if (result.error) {
	console.error(result.error.message);
	process.exit(1);
}

let report;
try {
	report = JSON.parse(result.stdout);
} catch {
	process.stdout.write(result.stdout);
	process.stderr.write(result.stderr);
	process.exit(result.status ?? 1);
}

const diagnostics = report.diagnostics ?? [];
if (diagnostics.length === 0 && report.ok) {
	console.log("React Doctor passed.");
	process.exit(0);
}

for (const diagnostic of diagnostics) {
	const location = diagnostic.filePath
		? `${diagnostic.filePath}:${diagnostic.line ?? 1}`
		: "unknown";
	console.error(`${location} ${diagnostic.rule}: ${diagnostic.message}`);
}

process.exit(1);
