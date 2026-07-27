import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');

let count = 0;
files.forEach(file => {
    // Skip CompareModal completely
    if (file.includes('CompareModal')) {
        return;
    }
    
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // In Top10Properties, carefully avoid breaking the modal
    if (file.includes('Top10Properties')) {
        // Line 652: max-w-7xl -> w-full
        content = content.replace(/max-w-7xl px-5 sm:px-8/g, 'w-full px-5 sm:px-8');
        // Do NOT replace max-w-6xl here to preserve modal width
    } else {
        // Standard replacement for other files
        content = content.replace(/max-w-7xl/g, 'w-full');
        // Let's preserve max-w-6xl and others unless we specifically know they are main layout containers.
        // The user's screenshot specifically shows the max-w-7xl containers (Featured Properties).
        // Hero uses max-w-6xl, let's widen it to w-full as well, but only in components where it's a layout wrapper.
        // Actually, let's just widen max-w-6xl too, except in specific modals.
        if (!file.includes('Modal') && !file.includes('testimonials')) {
           content = content.replace(/max-w-6xl/g, 'w-full'); 
        }
    }
    
    if (original !== content) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
        console.log('Updated ' + file);
    }
});

console.log(`Updated ${count} files.`);
