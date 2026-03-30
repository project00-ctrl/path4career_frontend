const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/INTERN/PATH4CAREER/src/components');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalText = content;

    // Remove grid-bg
    content = content.replace(/min-h-screen\s+grid-bg/g, 'min-h-screen');
    // Remove specific dark gradients
    content = content.replace(/bg-gradient-to-br\s+from-gray-950\s+via-slate-900\s+to-gray-950/g, '');

    // Clean up excessive spaces
    content = content.replace(/className="min-h-screen\s+"/g, 'className="min-h-screen"');
    content = content.replace(/className="min-h-screen\s+flex/g, 'className="min-h-screen flex');
    content = content.replace(/className="min-h-screen\s+pt-24/g, 'className="min-h-screen pt-24');
    content = content.replace(/\s+"/g, '"');

    if (content !== originalText) {
        fs.writeFileSync(file, content);
        console.log(`Cleaned backgrounds in ${file}`);
    }
});
