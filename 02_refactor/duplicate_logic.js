// Constants สำหรับค่าต่างๆ
const MEMBERSHIP_DISCOUNTS = {
  premium: 0.2,
  gold: 0.15,
  silver: 0.1,
};

const SHIPPING_MULTIPLIERS = {
  premium: 0, // Free shipping
  gold: 0.5,
  silver: 0.8,
};

const DISCOUNT_CONSTANTS = {
  LOYALTY_THRESHOLD_YEARS: 5,
  LOYALTY_BONUS: 0.05,
  ELECTRONICS_BONUS: 0.02,
  BULK_THRESHOLD: 10,
  BULK_BONUS: 0.03,
  MAX_DISCOUNT: 0.5,
  SHIPPING_RATE_PER_UNIT: 2.5,
};

// Helper functions เพื่อลดการซ้ำซ้อน
function validateUser(user) {
  if (!user || typeof user !== "object") {
    throw new Error("User object is required");
  }
  if (!user.membershipType) {
    throw new Error("User membership type is required");
  }
  if (typeof user.yearsActive !== "number" || user.yearsActive < 0) {
    throw new Error("User years active must be a non-negative number");
  }
}

function getMembershipDiscount(membershipType) {
  return MEMBERSHIP_DISCOUNTS[membershipType] || 0;
}

function getLoyaltyDiscount(yearsActive) {
  return yearsActive >= DISCOUNT_CONSTANTS.LOYALTY_THRESHOLD_YEARS
    ? DISCOUNT_CONSTANTS.LOYALTY_BONUS
    : 0;
}

function getBaseUserDiscount(user) {
  validateUser(user);
  return (
    getMembershipDiscount(user.membershipType) +
    getLoyaltyDiscount(user.yearsActive)
  );
}

function calculateUserDiscount(user, product) {
  if (!product || typeof product !== "object") {
    throw new Error("Product object is required");
  }

  let discount = getBaseUserDiscount(user);

  // เพิ่มส่วนลดสำหรับสินค้าอิเล็กทรอนิกส์
  if (product.category === "electronics") {
    discount += DISCOUNT_CONSTANTS.ELECTRONICS_BONUS;
  }

  return Math.min(discount, DISCOUNT_CONSTANTS.MAX_DISCOUNT);
}

function calculateBulkDiscount(user, items) {
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }

  let discount = getBaseUserDiscount(user);

  // เพิ่มส่วนลดสำหรับการซื้อจำนวนมาก
  if (items.length > DISCOUNT_CONSTANTS.BULK_THRESHOLD) {
    discount += DISCOUNT_CONSTANTS.BULK_BONUS;
  }

  return Math.min(discount, DISCOUNT_CONSTANTS.MAX_DISCOUNT);
}

function getShippingCost(user, weight) {
  validateUser(user);

  if (typeof weight !== "number" || weight < 0) {
    throw new Error("Weight must be a non-negative number");
  }

  const baseShipping = weight * DISCOUNT_CONSTANTS.SHIPPING_RATE_PER_UNIT;
  const multiplier = SHIPPING_MULTIPLIERS[user.membershipType];

  // หากไม่มี membership type ที่รู้จัก ใช้ราคาเต็ม
  if (multiplier === undefined) {
    return baseShipping;
  }

  return baseShipping * multiplier;
}

module.exports = {
  calculateUserDiscount,
  calculateBulkDiscount,
  getShippingCost,
};
