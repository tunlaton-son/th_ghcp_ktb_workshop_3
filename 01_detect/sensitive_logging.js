const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: "app.log" }),
    new winston.transports.Console(),
  ],
});

// ฟังก์ชันสำหรับซ่อนข้อมูลสำคัญ
function maskSensitiveData(data, type) {
  if (!data) return "[HIDDEN]";

  switch (type) {
    case "password":
      return "[PASSWORD_HIDDEN]";
    case "apiKey":
      return `${data.substring(0, 4)}...${data.substring(data.length - 4)}`;
    case "cardNumber":
      return `****-****-****-${data.substring(data.length - 4)}`;
    case "cvv":
      return "***";
    default:
      return data;
  }
}

function authenticateUser(username, password, apiKey) {
  // บันทึก log โดยไม่เปิดเผยข้อมูลสำคัญ
  logger.info(
    `Login attempt: username=${username}, password=${maskSensitiveData(
      password,
      "password"
    )}, apiKey=${maskSensitiveData(apiKey, "apiKey")}`
  );

  if (username === "admin" && password === "secret123") {
    logger.info(`User ${username} authenticated successfully`);
    return { success: true, token: "jwt-token-here" };
  }

  // ไม่บันทึกรหัสผ่านที่ผิด
  logger.warn(`Failed login attempt for user: ${username}`);
  return { success: false };
}

function processPayment(cardNumber, cvv, amount) {
  // ใช้ logger แทน console.log และซ่อนข้อมูลบัตร
  logger.info(
    `Processing payment: Card ${maskSensitiveData(
      cardNumber,
      "cardNumber"
    )}, CVV ${maskSensitiveData(cvv, "cvv")}, Amount $${amount}`
  );

  // Simulate payment processing
  if (cardNumber.length === 16) {
    logger.info(
      `Payment successful: Card ending ${cardNumber.substring(
        cardNumber.length - 4
      )} charged $${amount}`
    );
    return { status: "success", transactionId: "12345" };
  }

  // ไม่บันทึกข้อมูลบัตรที่ล้มเหลว
  logger.error(
    `Payment failed for card ending: ${cardNumber.substring(
      cardNumber.length - 4
    )}`
  );
  return { status: "failed" };
}

function debugUserSession(sessionData) {
  // สร้างข้อมูล session ที่ปลอดภัยสำหรับ debug
  const safeSessionData = {
    ...sessionData,
    password: undefined,
    apiKey: sessionData.apiKey
      ? maskSensitiveData(sessionData.apiKey, "apiKey")
      : undefined,
    cardNumber: sessionData.cardNumber
      ? maskSensitiveData(sessionData.cardNumber, "cardNumber")
      : undefined,
    cvv: undefined,
  };

  logger.debug(`Session details: ${JSON.stringify(safeSessionData)}`);
}

module.exports = { authenticateUser, processPayment, debugUserSession };
