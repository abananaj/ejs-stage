const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

// Define your data
const data = {
    title: 'My EJS Project',
    subtitle: 'Building HTML with Node.js and EJS',
    isDevelopment: true,
    items: [
        { name: 'Learn EJS', description: 'Understand template syntax and variables' },
        { name: 'Render Templates', description: 'Convert EJS templates to HTML' },
        { name: 'Build Static Sites', description: 'Generate static HTML files' }
    ]
};

// Step 1: Render the page template
console.log('📄 Rendering page template...');
const pageTemplatePath = path.join(__dirname, 'templates', 'page.ejs');
const pageContent = ejs.render(
    fs.readFileSync(pageTemplatePath, 'utf8'),
    data
);

// Step 2: Render the layout template with the page content
console.log('🎨 Rendering layout with page content...');
const layoutTemplatePath = path.join(__dirname, 'templates', 'layout.ejs');
const htmlContent = ejs.render(
    fs.readFileSync(layoutTemplatePath, 'utf8'),
    { ...data, content: pageContent }
);

// Step 3: Write the output to a file
const outputPath = path.join(__dirname, 'output', 'index.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log(`✅ HTML file generated: ${outputPath}`);
console.log(`\n--- First 500 characters of output ---\n${htmlContent.substring(0, 500)}...`);
