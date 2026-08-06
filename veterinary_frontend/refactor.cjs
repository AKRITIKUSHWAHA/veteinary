const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    if (file.includes('utils\\api.js') || file.includes('utils/api.js') || file.includes('App.jsx')) return;
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    if (content.includes('fetch(') || content.includes('fetch(`')) {
        // 1. Import apiFetch
        if (!content.includes("import { apiFetch } from")) {
            const importApi = `import { apiFetch } from '${path.relative(path.dirname(file), path.join(srcDir, 'utils', 'api')).replace(/\\/g, '/')}';\n`;
            content = importApi + content;
        }

        // 2. Replace 'fetch(' with 'apiFetch('
        // We only want to replace fetch calls that go to our API, which conveniently start with 'http://localhost:5000' in this codebase.
        // Actually, replacing all fetch with apiFetch is fine since apiFetch handles URLs.
        content = content.replace(/\bfetch\(/g, 'apiFetch(');

        // 3. Remove Authorization headers from options.
        // Match { headers: { 'Authorization': `Bearer ${token}` } } and similar.
        // This regex is slightly tricky, so we'll do some generic cleanups for the specific patterns used.
        content = content.replace(/headers:\s*\{\s*(?:'|")?Authorization(?:'|")?:\s*`Bearer \$\{token\}`\s*\}?/g, "");
        // Clean up empty objects if they result from the above
        content = content.replace(/,\s*\{\s*\}\s*\}/g, '}');
        content = content.replace(/,\s*\{\s*\}/g, '');
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});
console.log(`Changed ${changedFiles} files`);
