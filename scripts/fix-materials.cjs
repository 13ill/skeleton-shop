const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../public/Product');

// แก้ไข product.json ที่มีอยู่ให้สมบูรณ์
function fixExistingJson() {
  const folders = fs.readdirSync(productDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  let fixed = 0;
  let errors = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(productDir, folder);
    const productJsonPath = path.join(folderPath, 'product.json');
    
    if (fs.existsSync(productJsonPath)) {
      try {
        const content = fs.readFileSync(productJsonPath, 'utf8');
        const productData = JSON.parse(content);
        
        // ดึง materials จาก fullDescription ถ้า materials array ว่าง
        if ((!productData.materials || productData.materials.length === 0) && productData.fullDescription) {
          const lines = productData.fullDescription.split('\n');
          const materials = [];
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            // ตรวจสอบ bullet points โดย character code (9642 = ?)
            if (trimmedLine.length > 0) {
              const firstChar = trimmedLine[0];
              const charCode = firstChar.charCodeAt(0);
              
              // ? (9642), • (8226), - (45)
              if (charCode === 9642 || charCode === 8226 || charCode === 45) {
                const material = trimmedLine.substring(1).trim();
                if (material && material.length > 0) {
                  materials.push(material);
                }
              }
            }
          }
          
          if (materials.length > 0) {
            productData.materials = materials;
            productData.material = materials.join(', ');
            
            // เขียนกลับ
            fs.writeFileSync(productJsonPath, JSON.stringify(productData, null, 2), 'utf8');
            console.log(`? Fixed ${folder} (${materials.length} materials)`);
            fixed++;
          } else {
            console.log(`??  ${folder} - no materials found in description`);
          }
        } else {
          console.log(`??  ${folder} already has materials`);
        }
      } catch (e) {
        console.error(`? Error fixing ${folder}:`, e.message);
        errors++;
      }
    } else {
      console.log(`??  No product.json in ${folder}`);
    }
  }
  
  console.log(`\n?? Summary: ${fixed} fixed, ${errors} errors`);
}

// รัน script
if (require.main === module) {
  fixExistingJson();
}

module.exports = { fixExistingJson };
