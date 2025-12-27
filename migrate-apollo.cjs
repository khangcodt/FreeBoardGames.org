#!/usr/bin/env node

/**
 * Apollo Client Migration Script
 * 
 * Migrates from apollo-boost and @apollo/react-* packages to @apollo/client
 */

const fs = require('fs');
const path = require('path');

const stats = {
  filesProcessed: 0,
  filesModified: 0,
  totalReplacements: 0,
};

const replacements = [
  // Import path replacements
  { from: /from ['"]apollo-boost['"]/g, to: `from '@apollo/client'` },
  { from: /from ['"]@apollo\/react-hooks['"]/g, to: `from '@apollo/client'` },
  { from: /from ['"]@apollo\/react-components['"]/g, to: `from '@apollo/client'` },
  { from: /from ['"]@apollo\/react-testing['"]/g, to: `from '@apollo/client/testing'` },
];

const skipPatterns = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /dist/,
  /build/,
  /coverage/,
  /\.yarn/,
];

function shouldProcessFile(filePath) {
  if (!/\.(tsx?|jsx?)$/.test(filePath)) {
    return false;
  }
  
  for (const pattern of skipPatterns) {
    if (pattern.test(filePath)) {
      return false;
    }
  }
  
  return true;
}

function processFile(filePath) {
  stats.filesProcessed++;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileReplacements = 0;
  
  for (const { from, to } of replacements) {
    const matches = content.match(from);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(from, to);
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    stats.totalReplacements += fileReplacements;
    console.log(`✓ ${filePath} (${fileReplacements} replacements)`);
  }
}

function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
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

function main() {
  console.log('Starting Apollo Client migration...\n');
  
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
  console.log('2. Check for any manual fixes needed');
  console.log('3. Update Apollo Client setup in _app.tsx if needed');
}

main();
