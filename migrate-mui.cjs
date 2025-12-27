#!/usr/bin/env node

/**
 * Material-UI v4 to MUI v6 Migration Script
 * 
 * This script automates the migration of imports and API calls from
 * Material-UI v4 to MUI v6.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Track statistics
const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0,
};

// Define replacement patterns
const replacements = [
  // Import path replacements
  { from: /@material-ui\/core/g, to: '@mui/material' },
  { from: /@material-ui\/icons/g, to: '@mui/icons-material' },
  { from: /@material-ui\/lab/g, to: '@mui/lab' },
  { from: /@material-ui\/styles/g, to: '@mui/styles' },
  
  // API changes
  { from: /createMuiTheme/g, to: 'createTheme' },
  { from: /MuiThemeProvider/g, to: 'ThemeProvider' },
  
  // Color imports - these stay the same but the import path changes
  // (already handled by the core replacement above)
];

// Files to skip
const skipPatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.yarn/,
];

/**
 * Check if a file should be processed
 */
function shouldProcessFile(filePath) {
  // Only process TypeScript/JavaScript files
  if (!/\.(tsx?|jsx?)$/.test(filePath)) {
    return false;
  }
  
  // Skip files matching skip patterns
  for (const pattern of skipPatterns) {
    if (pattern.test(filePath)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  stats.filesProcessed++;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileReplacements = 0;
  
  // Apply all replacements
  for (const { from, to } of replacements) {
    const matches = content.match(from);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(from, to);
    }
  }
  
  // Only write if content changed
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    stats.totalReplacements += fileReplacements;
    console.log(`✓ ${filePath} (${fileReplacements} replacements)`);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip directories matching skip patterns
      if (!skipPatterns.some(pattern => pattern.test(fullPath))) {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (shouldProcessFile(fullPath)) {
        processFile(fullPath);
      }
    }
  }
}

/**
 * Main execution
 */
function main() {
  console.log('Starting Material-UI v4 to MUI v6 migration...\n');
  
  const webSrcPath = path.join(__dirname, 'web', 'src');
  
  if (!fs.existsSync(webSrcPath)) {
    console.error('Error: web/src directory not found!');
    process.exit(1);
  }
  
  processDirectory(webSrcPath);
  
  console.log('\n' + '='.repeat(60));
  console.log('Migration Complete!');
  console.log('='.repeat(60));
  console.log(`Files processed: ${stats.filesProcessed}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Total replacements: ${stats.totalReplacements}`);
  console.log('\nNext steps:');
  console.log('1. Review the changes with: git diff');
  console.log('2. Check for any manual fixes needed (see UPGRADE_GUIDE.md)');
  console.log('3. Run tests: yarn test');
  console.log('4. Fix any remaining TypeScript errors: yarn tsc');
}

main();
