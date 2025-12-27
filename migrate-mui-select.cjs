#!/usr/bin/env node
/**
 * Migration script: MUI v6 Select onChange signature
 * 
 * Changes:
 * - Old: (event: React.ChangeEvent<{ value: T }>) => void
 * - New: (event: SelectChangeEvent<T>, child: ReactNode) => void
 * 
 * Also adds SelectChangeEvent import from @mui/material
 */

const fs = require('fs');
const path = require('path');

const files = [
  'web/src/games/bullsAndCows/customization.tsx',
  'web/src/games/checkers/customization.tsx',
];

let totalChanges = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let changes = 0;
  
  // Add SelectChangeEvent import if not present
  if (content.includes('@mui/material') && !content.includes('SelectChangeEvent')) {
    // Find the first @mui/material import and add SelectChangeEvent to it
    content = content.replace(
      /from ['"]@mui\/material['"]/,
      (match) => {
        // Check if there's already an import statement before this
        const importMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]@mui\/material['"]/);
        if (importMatch) {
          const imports = importMatch[1];
          if (!imports.includes('SelectChangeEvent')) {
            content = content.replace(
              /import\s+{([^}]+)}\s+from\s+['"]@mui\/material['"]/,
              `import { SelectChangeEvent,$1 } from '@mui/material'`
            );
            changes++;
          }
        }
        return match;
      }
    );
  }
  
  // Replace React.ChangeEvent<{ value: T }> with SelectChangeEvent<T>
  const oldPattern1 = /React\.ChangeEvent<\{\s*value:\s*(\w+);\s*}>/g;
  const newPattern1 = 'SelectChangeEvent<$1>';
  
  const before = content;
  content = content.replace(oldPattern1, newPattern1);
  const matches1 = (before.match(oldPattern1) || []).length;
  changes += matches1;
  
  // Also handle without React. prefix
  const oldPattern2 = /ChangeEvent<\{\s*value:\s*(\w+);\s*}>/g;
  const newPattern2 = 'SelectChangeEvent<$1>';
  
  const before2 = content;
  content = content.replace(oldPattern2, newPattern2);
  const matches2 = (before2.match(oldPattern2) || []).length;
  changes += matches2;
  
  if (changes > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ ${filePath}: ${changes} changes`);
    totalChanges += changes;
  } else {
    console.log(`⏭️  ${filePath}: no changes needed`);
  }
});

console.log(`\n📊 Total: ${totalChanges} changes across ${files.length} files`);
