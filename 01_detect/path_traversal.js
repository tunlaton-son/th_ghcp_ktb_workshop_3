const fs = require("fs");
const path = require("path");

function readUserFile(filename) {
  // ตรวจสอบและทำความสะอาด filename
  const sanitizedFilename = path.basename(filename);
  const uploadsDir = "/uploads";
  const filePath = path.join(uploadsDir, sanitizedFilename);

  // ตรวจสอบว่าเส้นทางที่ได้อยู่ในโฟลเดอร์ที่อนุญาตหรือไม่
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(path.normalize(uploadsDir))) {
    throw new Error("Access denied: Invalid file path");
  }

  try {
    const content = fs.readFileSync(normalizedPath, "utf8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error.message);
    return null;
  }
}

function saveUserData(filename, data) {
  // ใช้ path.basename เพื่อป้องกัน path traversal
  const sanitizedFilename = path.basename(filename);
  const userDataDir = "./user_data";
  const savePath = path.join(userDataDir, sanitizedFilename);

  // ตรวจสอบว่าเส้นทางที่ได้อยู่ในโฟลเดอร์ที่อนุญาตหรือไม่
  const normalizedPath = path.normalize(savePath);
  if (!normalizedPath.startsWith(path.normalize(userDataDir))) {
    throw new Error("Access denied: Invalid save path");
  }

  fs.writeFileSync(normalizedPath, data, "utf8");
  console.log(`Data saved to: ${normalizedPath}`);
}

function serveStaticFile(requestedFile) {
  // ทำความสะอาด filename และตรวจสอบเส้นทาง
  const sanitizedFile = path.basename(requestedFile);
  const staticDir = "/var/www/static";
  const staticPath = path.join(staticDir, sanitizedFile);

  // ตรวจสอบว่าเส้นทางที่ได้อยู่ในโฟลเดอร์ที่อนุญาตหรือไม่
  const normalizedPath = path.normalize(staticPath);
  if (!normalizedPath.startsWith(path.normalize(staticDir))) {
    throw new Error("Access denied: Invalid file path");
  }

  if (fs.existsSync(normalizedPath)) {
    return fs.readFileSync(normalizedPath);
  } else {
    throw new Error("File not found");
  }
}

function downloadFile(userPath) {
  // ใช้ path.basename เพื่อป้องกัน path traversal
  const sanitizedPath = path.basename(userPath);
  const downloadDir = "./downloads";
  const fullPath = path.join(downloadDir, sanitizedPath);

  // ตรวจสอบว่าเส้นทางที่ได้อยู่ในโฟลเดอร์ที่อนุญาตหรือไม่
  const normalizedPath = path.normalize(fullPath);
  if (!normalizedPath.startsWith(path.normalize(downloadDir))) {
    throw new Error("Access denied: Invalid download path");
  }

  return fs.readFileSync(normalizedPath);
}

module.exports = { readUserFile, saveUserData, serveStaticFile, downloadFile };
