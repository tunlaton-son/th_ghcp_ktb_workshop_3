function findUserMatches(users, criteria) {
  const matches = [];
  const matchSet = new Set(); // เพื่อป้องกัน duplicates อย่างมีประสิทธิภาพ

  for (const user of users) {
    // แปลง skills เป็น Set เพื่อการค้นหาที่เร็วขึ้น
    const userSkillsSet = new Set(
      user.skills.map((skill) => skill.toLowerCase())
    );

    for (const criterion of criteria) {
      // ตรวจสอบเงื่อนไขพื้นฐานก่อน
      if (user.experience < criterion.minExperience) {
        continue;
      }

      if (
        user.location !== criterion.location &&
        criterion.location !== "remote"
      ) {
        continue;
      }

      // ตรวจสอบว่ามี skill ที่ตรงกันหรือไม่
      const hasMatchingSkill = criterion.requiredSkills.some((skill) =>
        userSkillsSet.has(skill.toLowerCase())
      );

      if (hasMatchingSkill) {
        const matchKey = `${user.id}-${criterion.id}`;

        if (!matchSet.has(matchKey)) {
          matchSet.add(matchKey);
          matches.push({
            userId: user.id,
            userName: user.name,
            criteriaId: criterion.id,
            score: user.skills.length + user.experience,
          });
        }
      }
    }
  }

  return matches;
}

function processInventoryData(inventory, orders) {
  // สร้าง Map สำหรับ inventory เพื่อการค้นหาที่เร็วขึ้น
  const inventoryMap = new Map();

  for (const item of inventory) {
    inventoryMap.set(item.productId, item);
  }

  for (const order of orders) {
    for (const orderItem of order.items) {
      const inventoryItem = inventoryMap.get(orderItem.productId);

      if (inventoryItem) {
        if (inventoryItem.quantity >= orderItem.quantity) {
          inventoryItem.quantity -= orderItem.quantity;
          orderItem.status = "fulfilled";
        } else {
          orderItem.status = "backorder";
        }
      }
    }
  }

  return { inventory, orders };
}

module.exports = { findUserMatches, processInventoryData };
