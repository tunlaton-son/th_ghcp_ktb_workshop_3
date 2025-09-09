function calculateInsurancePremium(customer, policy) {
  let basePremium = 100;
  
  if (customer.age >= 18 && customer.age <= 25) {
    if (customer.gender === 'male') {
      if (customer.drivingRecord === 'clean') {
        if (policy.type === 'full') {
          if (customer.vehicleYear >= 2020) {
            basePremium = basePremium * 1.5 + 50;
          } else if (customer.vehicleYear >= 2015) {
            basePremium = basePremium * 1.3 + 30;
          } else {
            basePremium = basePremium * 1.1 + 20;
          }
        } else if (policy.type === 'liability') {
          basePremium = basePremium * 0.8;
        }
      } else if (customer.drivingRecord === 'minor') {
        basePremium = basePremium * 2.0;
      } else {
        basePremium = basePremium * 3.0;
      }
    } else {
      if (customer.drivingRecord === 'clean') {
        basePremium = basePremium * 1.2;
      } else {
        basePremium = basePremium * 1.8;
      }
    }
  } else if (customer.age >= 26 && customer.age <= 65) {
    if (customer.maritalStatus === 'married') {
      if (customer.children > 0) {
        if (policy.coverage >= 100000) {
          basePremium = basePremium * 0.9;
        } else {
          basePremium = basePremium * 1.1;
        }
      } else {
        basePremium = basePremium * 0.95;
      }
    } else {
      basePremium = basePremium * 1.2;
    }
  } else {
    if (customer.healthScore >= 80) {
      basePremium = basePremium * 1.1;
    } else if (customer.healthScore >= 60) {
      basePremium = basePremium * 1.4;
    } else {
      basePremium = basePremium * 2.0;
    }
  }
  
  return Math.round(basePremium);
}

module.exports = { calculateInsurancePremium };
