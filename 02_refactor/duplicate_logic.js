function calculateUserDiscount(user, product) {
  let discount = 0;
  
  if (user.membershipType === 'premium') {
    discount += 0.20;
  } else if (user.membershipType === 'gold') {
    discount += 0.15;
  } else if (user.membershipType === 'silver') {
    discount += 0.10;
  }
  
  if (user.yearsActive >= 5) {
    discount += 0.05;
  }
  
  if (product.category === 'electronics') {
    discount += 0.02;
  }
  
  return Math.min(discount, 0.50);
}

function calculateBulkDiscount(user, items) {
  let discount = 0;
  
  if (user.membershipType === 'premium') {
    discount += 0.20;
  } else if (user.membershipType === 'gold') {
    discount += 0.15;
  } else if (user.membershipType === 'silver') {
    discount += 0.10;
  }
  
  if (user.yearsActive >= 5) {
    discount += 0.05;
  }
  
  if (items.length > 10) {
    discount += 0.03;
  }
  
  return Math.min(discount, 0.50);
}

function getShippingCost(user, weight) {
  let baseShipping = weight * 2.5;
  
  if (user.membershipType === 'premium') {
    return 0; // Free shipping
  } else if (user.membershipType === 'gold') {
    return baseShipping * 0.5;
  } else if (user.membershipType === 'silver') {
    return baseShipping * 0.8;
  }
  
  return baseShipping;
}

module.exports = { calculateUserDiscount, calculateBulkDiscount, getShippingCost };
