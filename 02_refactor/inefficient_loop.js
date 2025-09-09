function findUserMatches(users, criteria) {
  let matches = [];
  
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < criteria.length; j++) {
      for (let k = 0; k < users[i].skills.length; k++) {
        for (let l = 0; l < criteria[j].requiredSkills.length; l++) {
          if (users[i].skills[k].toLowerCase() === criteria[j].requiredSkills[l].toLowerCase()) {
            if (users[i].experience >= criteria[j].minExperience) {
              if (users[i].location === criteria[j].location || criteria[j].location === 'remote') {
                let found = false;
                for (let m = 0; m < matches.length; m++) {
                  if (matches[m].userId === users[i].id && matches[m].criteriaId === criteria[j].id) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  matches.push({
                    userId: users[i].id,
                    userName: users[i].name,
                    criteriaId: criteria[j].id,
                    score: users[i].skills.length + users[i].experience
                  });
                }
              }
            }
          }
        }
      }
    }
  }
  
  return matches;
}

function processInventoryData(inventory, orders) {
  for (let i = 0; i < inventory.length; i++) {
    for (let j = 0; j < orders.length; j++) {
      for (let k = 0; k < orders[j].items.length; k++) {
        if (inventory[i].productId === orders[j].items[k].productId) {
          if (inventory[i].quantity >= orders[j].items[k].quantity) {
            inventory[i].quantity -= orders[j].items[k].quantity;
            orders[j].items[k].status = 'fulfilled';
          } else {
            orders[j].items[k].status = 'backorder';
          }
        }
      }
    }
  }
  
  return { inventory, orders };
}

module.exports = { findUserMatches, processInventoryData };
