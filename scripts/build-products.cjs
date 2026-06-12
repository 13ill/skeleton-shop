const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, '../public/Product');
const outputDir = path.join(__dirname, '../src/app/data');
const outputFile = path.join(outputDir, 'products-generated.json');

// อ่านโฟลเดอร์สินค้าทั้งหมด
function buildProducts() {
  const products = [];
  
  // อ่านโฟลเดอร์ทั้งหมดใน Product (ยกเว้น .template)
  const folders = fs.readdirSync(productDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);
  
  for (const folder of folders) {
    const folderPath = path.join(productDir, folder);
    const productJsonPath = path.join(folderPath, 'product.json');
    const dataTxtPath = path.join(folderPath, 'data.txt');
    
    let productData = null;
    
    // พยายามอ่าน product.json ก่อน
    if (fs.existsSync(productJsonPath)) {
      try {
        productData = JSON.parse(fs.readFileSync(productJsonPath, 'utf8'));
      } catch (e) {
        console.error(`Error reading ${productJsonPath}:`, e.message);
      }
    }
    
    // ถ้าไม่มี product.json ให้พยายามอ่านจาก data.txt
    if (!productData && fs.existsSync(dataTxtPath)) {
      productData = parseDataTxt(dataTxtPath, folder);
    }
    
    if (productData) {
      // หารูปภาพทั้งหมดในโฟลเดอร์
      const images = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file))
        .sort();
      
      // ใช้รูปแรกเป็นรูปหลัก ถ้าไม่ได้ระบุในข้อมูล
      if (!productData.image && images.length > 0) {
        // ใช้ path สัมพัทธ์สำหรับการ import
        productData.image = `/Product/${folder}/${images[0]}`;
      }
      
      // เพิ่มรายการรูปภาพทั้งหมด
      if (!productData.images || productData.images.length === 0) {
        productData.images = images.map(img => `/Product/${folder}/${img}`);
      }
      
      // ตั้งค่า default หากขาดข้อมูล
      productData.id = productData.id || folder;
      productData.name = productData.name || folder;
      productData.category = productData.category || 'แหวน';
      productData.price = productData.price || null; // เปลี่ยนเป็น null แทน 0
      productData.description = productData.description || productData.fullDescription?.substring(0, 100) || '';
      productData.material = productData.material || '';
      
      products.push(productData);
    }
  }
  
  // เขียนไฟล์ output
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2), 'utf8');
  console.log(`? Generated ${products.length} products to ${outputFile}`);
  
  return products;
}

// แปลง data.txt เป็น object
function parseDataTxt(filePath, folderName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  if (lines.length === 0) return null;
  
  const product = {
    id: folderName,
    name: lines[0],
    category: 'ring',
    price: null, // เปลี่ยนเป็น null แทน 0
    description: lines[0],
    fullDescription: content,
    material: '',
    materials: [],
    images: []
  };
  
  // พยายามดึงข้อมูลจากเนื้อหา
  let currentSection = '';
  let descriptionLines = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // ตรวจหาราคา (รูปแบบ: ราคา 25,000 บาท หรือ 25,000 ฿)
    if (line.match(/ราคา\s*[\d,]+/i) || line.match(/[\d,]+\s*(บาท|฿)/)) {
      const priceMatch = line.match(/[\d,]+/);
      if (priceMatch) {
        product.price = parseInt(priceMatch[0].replace(/,/g, ''));
      }
    }
    // ตรวจหา bullet points สำหรับ materials
    else if (line.startsWith('?') || line.startsWith('-') || line.startsWith('•')) {
      const material = line.replace(/^[?\-\•]\s*/, '').trim();
      if (material) {
        product.materials.push(material);
      }
    } 
    // ตรวจหาขนาด
    else if (line.toLowerCase().includes('mm') || line.toLowerCase().includes('ขนาด')) {
      if (!product.specifications) product.specifications = {};
      product.specifications.size = line;
    }
    // ส่วนอื่นๆ เป็นคำอธิบาย
    else {
      descriptionLines.push(line);
    }
  }
  
  // รวม materials เป็น string
  if (product.materials.length > 0) {
    product.material = product.materials.join(', ');
  }
  
  return product;
}

// รัน script
if (require.main === module) {
  buildProducts();
}

module.exports = { buildProducts };
