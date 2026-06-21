const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'app/index.tsx',
  'app/(auth)/login.tsx',
  'app/(tabs)/wardrobe/index.tsx',
  'app/(tabs)/wardrobe/upload.tsx',
  'app/(tabs)/outfits/index.tsx',
  'src/features/wardrobe/components/WardrobeCard.tsx',
  'src/features/wardrobe/components/CategoryFilter.tsx'
];

filesToUpdate.forEach(filePath => {
  const absolutePath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(absolutePath)) return;
  
  let content = fs.readFileSync(absolutePath, 'utf8');
  
  // Replace react-native imports
  const components = ['View', 'Text', 'Pressable', 'ScrollView', 'TextInput', 'TouchableHighlight'];
  let importedComps = [];
  
  const rnImportMatch = content.match(/import\s+{([^}]*)}\s+from\s+['"]react-native['"]/);
  if (rnImportMatch) {
    const imports = rnImportMatch[1].split(',').map(s => s.trim());
    const remainingImports = imports.filter(i => {
      if (components.includes(i)) {
        importedComps.push(i);
        return false;
      }
      return true;
    });
    
    if (remainingImports.length > 0) {
      content = content.replace(rnImportMatch[0], `import { ${remainingImports.join(', ')} } from 'react-native'`);
    } else {
      content = content.replace(rnImportMatch[0] + ';\n', '').replace(rnImportMatch[0] + '\n', '');
    }
  }
  
  let twRelPath = path.relative(path.dirname(absolutePath), path.resolve(process.cwd(), 'src/tw')).replace(/\\/g, '/');
  if (!twRelPath.startsWith('.')) twRelPath = './' + twRelPath;
  
  if (importedComps.length > 0) {
    const importStr = `import { ${importedComps.join(', ')} } from '${twRelPath}';\n`;
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + importStr + content.slice(endOfLine + 1);
    } else {
      content = importStr + content;
    }
  }
  
  // Replace expo-image
  if (content.includes("from 'expo-image'") || content.includes('from "expo-image"')) {
    content = content.replace(/import\s+{\s*Image\s*}\s+from\s+['"]expo-image['"];?\n?/, '');
    const imgImportStr = `import { Image } from '${twRelPath}/image';\n`;
    
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLine = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLine + 1) + imgImportStr + content.slice(endOfLine + 1);
    } else {
      content = imgImportStr + content;
    }
  }
  
  fs.writeFileSync(absolutePath, content);
  console.log('Updated', filePath);
});
