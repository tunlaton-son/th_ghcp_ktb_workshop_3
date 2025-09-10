// Constants for better maintainability
const PREMIUM_CONSTANTS = {
  INITIAL_PREMIUM: 100,
  AGE_GROUPS: {
    YOUNG_ADULT: { min: 18, max: 25 },
    ADULT: { min: 26, max: 65 },
    SENIOR: { min: 66, max: 100 },
  },
  MULTIPLIERS: {
    YOUNG_MALE_CLEAN_FULL_NEW: 1.5,
    YOUNG_MALE_CLEAN_FULL_RECENT: 1.3,
    YOUNG_MALE_CLEAN_FULL_OLD: 1.1,
    YOUNG_MALE_CLEAN_LIABILITY: 0.8,
    YOUNG_MALE_MINOR: 2.0,
    YOUNG_MALE_MAJOR: 3.0,
    YOUNG_FEMALE_CLEAN: 1.2,
    YOUNG_FEMALE_VIOLATIONS: 1.8,
    ADULT_MARRIED_WITH_CHILDREN_HIGH_COVERAGE: 0.9,
    ADULT_MARRIED_WITH_CHILDREN_LOW_COVERAGE: 1.1,
    ADULT_MARRIED_NO_CHILDREN: 0.95,
    ADULT_SINGLE: 1.2,
    SENIOR_HIGH_HEALTH: 1.1,
    SENIOR_MEDIUM_HEALTH: 1.4,
    SENIOR_LOW_HEALTH: 2.0,
  },
  VEHICLE_YEAR_THRESHOLDS: {
    NEW: 2020,
    RECENT: 2015,
  },
  ADDITIONAL_FEES: {
    NEW_VEHICLE: 50,
    RECENT_VEHICLE: 30,
    OLD_VEHICLE: 20,
  },
  COVERAGE_THRESHOLD: 100000,
  HEALTH_SCORE_THRESHOLDS: {
    HIGH: 80,
    MEDIUM: 60,
  },
};

function calculateInsurancePremium(customer, policy) {
  const { INITIAL_PREMIUM, AGE_GROUPS } = PREMIUM_CONSTANTS;

  // Input validation
  if (!customer || !policy) {
    throw new Error("Customer และ policy ต้องระบุค่า");
  }

  if (!customer.age || customer.age < 0 || customer.age > 120) {
    throw new Error("อายุต้องอยู่ในช่วง 0-120 ปี");
  }

  let calculatedPremium;

  if (
    customer.age >= AGE_GROUPS.YOUNG_ADULT.min &&
    customer.age <= AGE_GROUPS.YOUNG_ADULT.max
  ) {
    calculatedPremium = calculateYoungAdultPremium(
      INITIAL_PREMIUM,
      customer,
      policy
    );
  } else if (
    customer.age >= AGE_GROUPS.ADULT.min &&
    customer.age <= AGE_GROUPS.ADULT.max
  ) {
    calculatedPremium = calculateAdultPremium(
      INITIAL_PREMIUM,
      customer,
      policy
    );
  } else {
    calculatedPremium = calculateSeniorPremium(INITIAL_PREMIUM, customer);
  }

  return Math.round(calculatedPremium);
}
function calculateYoungAdultPremium(initialPremium, customer, policy) {
  const { MULTIPLIERS, VEHICLE_YEAR_THRESHOLDS, ADDITIONAL_FEES } =
    PREMIUM_CONSTANTS;

  let premium = initialPremium;

  // Male customer calculations
  if (customer.gender === "male") {
    premium = calculateMaleYoungAdultPremium(initialPremium, customer, policy);
  } else {
    // Female customer calculations
    premium = calculateFemaleYoungAdultPremium(initialPremium, customer);
  }

  return premium;
}

function calculateMaleYoungAdultPremium(initialPremium, customer, policy) {
  const { MULTIPLIERS, VEHICLE_YEAR_THRESHOLDS, ADDITIONAL_FEES } =
    PREMIUM_CONSTANTS;

  if (customer.drivingRecord === "clean") {
    if (policy.type === "full") {
      return calculateFullCoveragePremium(initialPremium, customer.vehicleYear);
    } else if (policy.type === "liability") {
      return initialPremium * MULTIPLIERS.YOUNG_MALE_CLEAN_LIABILITY;
    }
  } else if (customer.drivingRecord === "minor") {
    return initialPremium * MULTIPLIERS.YOUNG_MALE_MINOR;
  } else {
    return initialPremium * MULTIPLIERS.YOUNG_MALE_MAJOR;
  }

  return initialPremium;
}

function calculateFullCoveragePremium(initialPremium, vehicleYear) {
  const { MULTIPLIERS, VEHICLE_YEAR_THRESHOLDS, ADDITIONAL_FEES } =
    PREMIUM_CONSTANTS;

  if (vehicleYear >= VEHICLE_YEAR_THRESHOLDS.NEW) {
    return (
      initialPremium * MULTIPLIERS.YOUNG_MALE_CLEAN_FULL_NEW +
      ADDITIONAL_FEES.NEW_VEHICLE
    );
  } else if (vehicleYear >= VEHICLE_YEAR_THRESHOLDS.RECENT) {
    return (
      initialPremium * MULTIPLIERS.YOUNG_MALE_CLEAN_FULL_RECENT +
      ADDITIONAL_FEES.RECENT_VEHICLE
    );
  } else {
    return (
      initialPremium * MULTIPLIERS.YOUNG_MALE_CLEAN_FULL_OLD +
      ADDITIONAL_FEES.OLD_VEHICLE
    );
  }
}

function calculateFemaleYoungAdultPremium(initialPremium, customer) {
  const { MULTIPLIERS } = PREMIUM_CONSTANTS;

  if (customer.drivingRecord === "clean") {
    return initialPremium * MULTIPLIERS.YOUNG_FEMALE_CLEAN;
  } else {
    return initialPremium * MULTIPLIERS.YOUNG_FEMALE_VIOLATIONS;
  }
}
function calculateAdultPremium(initialPremium, customer, policy) {
  const { MULTIPLIERS, COVERAGE_THRESHOLD } = PREMIUM_CONSTANTS;

  if (customer.maritalStatus === "married") {
    if (customer.children > 0) {
      // Married with children
      if (policy.coverage >= COVERAGE_THRESHOLD) {
        return (
          initialPremium * MULTIPLIERS.ADULT_MARRIED_WITH_CHILDREN_HIGH_COVERAGE
        );
      } else {
        return (
          initialPremium * MULTIPLIERS.ADULT_MARRIED_WITH_CHILDREN_LOW_COVERAGE
        );
      }
    } else {
      // Married without children
      return initialPremium * MULTIPLIERS.ADULT_MARRIED_NO_CHILDREN;
    }
  } else {
    // Single
    return initialPremium * MULTIPLIERS.ADULT_SINGLE;
  }
}
function calculateSeniorPremium(initialPremium, customer) {
  const { MULTIPLIERS, HEALTH_SCORE_THRESHOLDS } = PREMIUM_CONSTANTS;

  if (customer.healthScore >= HEALTH_SCORE_THRESHOLDS.HIGH) {
    return initialPremium * MULTIPLIERS.SENIOR_HIGH_HEALTH;
  } else if (customer.healthScore >= HEALTH_SCORE_THRESHOLDS.MEDIUM) {
    return initialPremium * MULTIPLIERS.SENIOR_MEDIUM_HEALTH;
  } else {
    return initialPremium * MULTIPLIERS.SENIOR_LOW_HEALTH;
  }
}

module.exports = {
  calculateInsurancePremium,
  calculateYoungAdultPremium,
  calculateAdultPremium,
  calculateSeniorPremium,
  PREMIUM_CONSTANTS,
};
