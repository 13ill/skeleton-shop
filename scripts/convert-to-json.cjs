const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../public/Product');

// แปลง data.txt เป็น product.json
function convertDataTxtToJson(dataTxtPath, folderName) {
  const content = fs.readFileSync(dataTxtPath, 'utf8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  const product = {
    id: folderName,
    name: lines[0],
    category: 'ring',
    price: null,
    description: lines[0],
    fullDescription: content,
    material: '',
    materials: [],
    specifications: {}
  };
  
  // พยายามดึงข้อมูลจากเนื้อหา
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // ตรวจหาราคา (รูปแบบ: ราคา 25,000 บาท หรือ 25,000 ฿)
    if (line.match(/ราคา\s*[\d,]+/i) || line.match(/[\d,]+\s*(บาท|฿)/)) {
      const priceMatch = line.match(/[\d,]+/);
      if (priceMatch) {
        product.price = parseInt(priceMatch[0].replace(/,/g, ''));
      }
    }
    // ตรวจหา bullet points สำหรับ materials (รองรับทั้ง ? - •)
    else if (line.match(/^[?\-\•]\s*/)) {
      const material = line.replace(/^[?\-\•]\s*/, '').trim();
      if (material) {
        product.materials.push(material);
      }
    } 
    // ตรวจหาขนาด
    else if (line.toLowerCase().includes('mm') || line.toLowerCase().includes('ขนาด')) {
      product.specifications.size = line;
    }
  }
  
  // รวม materials เป็น string
  if (product.materials.length > 0) {
    product.material = product.materials.join(', ');
  }
  
  // ลบ specifications ถ้าว่าง
  if (Object.keys(product.specifications).length === 0) {
    delete product.specifications;
  }
  
  // ลบ materials array ถ้าว่าง
  if (product.materials.length === 0) {
    delete product.materials;
  }
  
  return product;
}

// แปลงทั้งหมด
function convertAll() {
  const folders = fs.readdirSync(productDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  let converted = 0;
  let errors = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(productDir, folder);
    const dataTxtPath = path.join(folderPath, 'data.txt');
    const productJsonPath = path.join(folderPath, 'product.json');
    
    if (fs.existsSync(dataTxtPath)) {
      try {
        const productData = convertDataTxtToJson(dataTxtPath, folder);
        
        if (productData) {
          // เขียน product.json
          fs.writeFileSync(productJsonPath, JSON.stringify(productData, null, 2), 'utf8');
          
          // เปลี่ยนชื่อ data.txt เป็น data.txt.backup
          const backupPath = path.join(folderPath, 'data.txt.backup');
          fs.renameSync(dataTxtPath, backupPath);
          
          console.log(`? Converted ${folder}`);
          converted++;
        } else {
          console.log(`??  Skipped ${folder} (empty data)`);
        }
      } catch (e) {
        console.error(`? Error converting ${folder}:`, e.message);
        errors++;
      }
    } else {
      console.log(`??  No data.txt in ${folder} (already converted or no data)`);
    }
  }
  
  console.log(`\n?? Summary: ${converted} converted, ${errors} errors`);
}

// รัน script
if (require.main === module) {
  convertAll();
}

module.exports = { convertDataTxtToJson, convertAll };
