const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../public/Product');

// แก้ไข encoding ของไฟล์ JSON ทั้งหมดใน Product folder
function fixProductJsonEncoding() {
  const folders = fs.readdirSync(productDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  let fixed = 0;
  
  for (const folder of folders) {
    const productJsonPath = path.join(productDir, folder, 'product.json');
    
    if (fs.existsSync(productJsonPath)) {
      try {
        const content = fs.readFileSync(productJsonPath, 'utf8');
        const data = JSON.parse(content);
        
        // บันทึกใหม่เป็น UTF-8
        fs.writeFileSync(productJsonPath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`? Fixed: ${folder}/product.json`);
        fixed++;
      } catch (e) {
        console.error(`? Error: ${folder}/product.json`, e.message);
      }
    }
  }
  
  console.log(`\n?? Summary: ${fixed} fixed`);
}

// รัน script
if (require.main === module) {
  console.log('?? Fixing encoding for product JSON files...\n');
  fixProductJsonEncoding();
}

module.exports = { fixProductJsonEncoding };
