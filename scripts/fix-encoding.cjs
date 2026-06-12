const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// ฟังก์ชันตรวจสอบและแก้ไข encoding
function fixEncoding(directory) {
  const files = getAllFiles(directory, ['.tsx', '.ts', '.jsx', '.js']);
  
  let fixed = 0;
  let checked = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      checked++;
      
      // ตรวจสอบว่ามีภาษาไทยหรือไม่
      const hasThai = /[\u0E00-\u0E7F]/.test(content);
      
      if (hasThai) {
        // บันทึกใหม่เป็น UTF-8
        fs.writeFileSync(file, content, 'utf8');
        console.log(`? Fixed: ${path.relative(srcDir, file)}`);
        fixed++;
      }
    } catch (e) {
      console.error(`? Error: ${file}`, e.message);
    }
  }
  
  console.log(`\n?? Summary: ${fixed} fixed, ${checked} checked`);
}

// ฟังก์ชันดึงไฟล์ทั้งหมด
function getAllFiles(dir, extensions = []) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        // ข้าม node_modules และ .git
        if (!item.name.includes('node_modules') && !item.name.includes('.git')) {
          traverse(fullPath);
        }
      } else if (item.isFile()) {
        // ตรวจสอบ extension
        if (extensions.length === 0 || extensions.some(ext => item.name.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    }
  }
  
  traverse(dir);
  return files;
}

// รัน script
if (require.main === module) {
  console.log('?? Fixing encoding for all source files...\n');
  fixEncoding(srcDir);
}

module.exports = { fixEncoding, getAllFiles };
