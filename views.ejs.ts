import ejs from "ejs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── View Definitions ────────────────────────────────────────────────
/**
 * Each entry maps an EJS section template
 * to the data it needs and the output filename.
 *
 * - template: path relative to src/templates/sections/
 * - output:   filename written to src/views/ (the output dir)
 * - data:     variables passed into the template
 */

interface ViewDefinition {
	template: string;
	output: string;
	data: Record<string, unknown>;
}

const views: ViewDefinition[] = [
	// Home --> Center stage
	{
		template: "home.ejs",
		output: "center.html",
		data: {
			sectionTitle: "CenterStage",
		},
	},
	// About --> Up stage
	{
		template: "about.ejs",
		output: "up.html",
		data: {
			sectionTitle: "UpStage",
		},
	},
	// Projects --> Stage right
	{
		template: "projects.ejs",
		output: "right.html",
		data: {
			sectionTitle: "stageRight",
			items: [
				{
					title: "Project One",
					description: "Loremn ipsum, yadda yadda.",
					tags: ["design", "branding"],
				},
				{
					title: "Project Two",
					description: "Loremn ipsum, yadda yadda.",
					tags: ["development", "frontend"],
				},
				{
					title: "Project Three",
					description: "Loremn ipsum, yadda yadda.",
					tags: ["design", "print"],
				},
			],
		},
	},
	// Contact --> Down stage
	{
		template: "contact.ejs",
		output: "down.html",
		data: {
			sectionTitle: "DownStage",
		},
	},
	// Services --> Stage left
	{
		template: "services.ejs",
		output: "left.html",
		data: {
			sectionTitle: "stageLeft",
		},
	},
];

// ── Builder ─────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewsTemplateDir = path.join(__dirname, "src", "templates", "sections");
const outputDir = path.join(__dirname, "src", "views");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`\n🔧 Building ${views.length} view(s)...\n`);

for (const view of views) {
	const templatePath = path.join(viewsTemplateDir, view.template);
	const outputPath = path.join(outputDir, view.output);

	try {
		const template = fs.readFileSync(templatePath, "utf8");

		// The `filename` option tells EJS where the template lives,
		// which is required for <%- include() %> to resolve relative paths.
		const html = ejs.render(template, view.data, { filename: templatePath });

		fs.writeFileSync(outputPath, html, "utf8");
		console.log(`  ✅ ${view.template} → views/${view.output}`);
	} catch (err) {
		console.error(`  ❌ ${view.template} failed:`, (err as Error).message);
	}
}

console.log(`\n📁 Output written to: ${outputDir}\n`);

