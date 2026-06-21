import os
import re

directories = ['app', 'src']
for root_dir in directories:
    for dirpath, _, filenames in os.walk(root_dir):
        if 'tw' in dirpath:
            continue
        for f in filenames:
            if not f.endswith('.tsx'):
                continue
            path = os.path.join(dirpath, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Find: import { ..., View, Text, Pressable, ScrollView, ... } from 'react-native';
            # It's easier to just replace <View, <Text, <Pressable, <ScrollView with tw equivalents
            # But we must ensure imports are correct.
            
            # Calculate relative path to src/tw
            # dirpath could be 'app\(auth)' -> depth is 2
            # depth of 'app' is 1
            rel = os.path.relpath('src/tw', dirpath)
            # convert backslashes to forward slashes
            rel = rel.replace('\\\\', '/')
            if not rel.startswith('.'):
                rel = './' + rel
                
            # Replace 'react-native' imports
            # We will use regex to find react-native imports and move View, Text, Pressable, ScrollView, TextInput, TouchableHighlight to src/tw
            
            components = ['View', 'Text', 'Pressable', 'ScrollView', 'TextInput', 'TouchableHighlight']
            
            new_content = content
            needs_tw_import = False
            for comp in components:
                # If comp is imported from react-native
                if re.search(r'import\s+{.*?\b' + comp + r'\b.*?}?\s+from\s+[\'"]react-native[\'"]', new_content):
                    needs_tw_import = True
                    # Remove comp from react-native import
                    new_content = re.sub(r'(import\s+{.*?)\b' + comp + r'\b\s*,?\s*(.*?}?\s+from\s+[\'"]react-native[\'"])', r'\1\2', new_content)
                    
            if needs_tw_import:
                # Add import { ... } from rel
                # Find what components are actually used
                used_comps = []
                for comp in components:
                    if re.search(r'<' + comp + r'\b', new_content) or re.search(r'</' + comp + r'>', new_content):
                        used_comps.append(comp)
                
                if used_comps:
                    import_statement = f"import {{ {', '.join(used_comps)} }} from '{rel}';\n"
                    # Add after the last import
                    last_import_idx = new_content.rfind('import ')
                    if last_import_idx != -1:
                        end_of_line = new_content.find('\n', last_import_idx)
                        new_content = new_content[:end_of_line+1] + import_statement + new_content[end_of_line+1:]
                    else:
                        new_content = import_statement + new_content
                        
            # Clean up empty react-native imports
            new_content = re.sub(r'import\s+{\s*}\s+from\s+[\'"]react-native[\'"];?\n?', '', new_content)
            # Also fix Image from expo-image -> src/tw/image
            if 'import { Image } from \'expo-image\'' in new_content or 'import { Image } from "expo-image"' in new_content:
                new_content = re.sub(r'import\s*{\s*Image\s*}\s*from\s*[\'"]expo-image[\'"];?\n?', '', new_content)
                img_rel = rel + '/image'
                import_img = f"import {{ Image }} from '{img_rel}';\n"
                
                last_import_idx = new_content.rfind('import ')
                if last_import_idx != -1:
                    end_of_line = new_content.find('\n', last_import_idx)
                    new_content = new_content[:end_of_line+1] + import_img + new_content[end_of_line+1:]
                else:
                    new_content = import_img + new_content
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {path}")
