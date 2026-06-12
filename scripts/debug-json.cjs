const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../public/Product');

// Debug script with character code check
function debugJson() {
  const folders = fs.readdirSync(productDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  for (const folder of folders) {
    const folderPath = path.join(productDir, folder);
    const productJsonPath = path.join(folderPath, 'product.json');
    
    if (fs.existsSync(productJsonPath)) {
      try {
        const productData = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
        
        console.log(`\n=== ${folder} ===`);
        if (productData.fullDescription) {
          const lines = productData.fullDescription.split('\n');
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // ตรวจสอบ character code ของตัวอักษรแรก
            if (trimmedLine.length > 0) {
              const firstChar = trimmedLine[0];
              const charCode = firstChar.charCodeAt(0);
              console.log(`Line ${i}: "${firstChar}" (${charCode}) - ${trimmedLine.substring(0, 30)}`);
              
              // ? character code is 9642
              if (charCode === 9642 || charCode === 8226) {
                console.log(`  -> Found bullet point!`);
              }
            }
          }
        }
      } catch (e) {
        console.error(`Error in ${folder}:`, e.message);
      }
    }
  }
}

if (require.main === module) {
  debugJson();
}
