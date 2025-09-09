const fs = require('fs');
const path = require('path');

function readUserFile(filename) {
  const filePath = `/uploads/${filename}`;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error('Error reading file:', error.message);
    return null;
  }
}

function saveUserData(filename, data) {
  const savePath = `./user_data/${filename}`;
  
  fs.writeFileSync(savePath, data, 'utf8');
  console.log(`Data saved to: ${savePath}`);
}

function serveStaticFile(requestedFile) {
  const staticPath = `/var/www/static/${requestedFile}`;
  
  if (fs.existsSync(staticPath)) {
    return fs.readFileSync(staticPath);
  } else {
    throw new Error('File not found');
  }
}

function downloadFile(userPath) {
  const fullPath = path.join('./downloads/', userPath);
  return fs.readFileSync(fullPath);
}

module.exports = { readUserFile, saveUserData, serveStaticFile, downloadFile };
