const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
            results.push(file);
        }
    });
    return results;
}

const files = walk('d:/INTERN/PATH4CAREER/src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalAmount = content;
    
    // Gradients to solid
    content = content.replace(/from-primary-\d{3}\s+to-primary-\d{3}/g, 'bg-primary');
    content = content.replace(/from-secondary-\d{3}\s+to-secondary-\d{3}/g, 'bg-secondary');
    
    // mixed gradients (e.g., from-secondary-500 to-green-600)
    content = content.replace(/from-secondary-\d{3}/g, 'from-secondary');
    content = content.replace(/to-secondary-\d{3}/g, 'to-secondary');
    content = content.replace(/from-primary-\d{3}/g, 'from-primary');
    content = content.replace(/to-primary-\d{3}/g, 'to-primary');
    
    // Replace text, bg, border, ring, shadow
    content = content.replace(/(text|bg|border|ring|shadow)-primary-\d{3}(\/\d+)?/g, '$1-primary$2');
    content = content.replace(/(text|bg|border|ring|shadow)-secondary-\d{3}(\/\d+)?/g, '$1-secondary$2');
    
    if (content !== originalAmount) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
