/**
 * Premium Calculation Engine
 * Calculates insurance premium based on policy rules, vehicle type, and age
 *
 * Formula:
 * Premium = baseAmount × vehicleTypeMultiplier × coverageMultiplier × depreciationFactor
 *
 * Where:
 * - depreciationFactor = max(0.5, 1 - (vehicleAge × ageDepreciation / 100))
 * - This means older vehicles get cheaper premiums (min 50% of base)
 */

export const calculatePremium = (policy, vehicle) => {
  const { baseAmount, premiumRules, coverageType } = policy;
  const vehicleAge = new Date().getFullYear() - vehicle.registrationYear;

  // ── Get Vehicle Type Multiplier ──
  let vehicleTypeMultiplier = 1.0;
  if (premiumRules?.vehicleTypeMultiplier) {
    if (premiumRules.vehicleTypeMultiplier instanceof Map) {
      vehicleTypeMultiplier =
        premiumRules.vehicleTypeMultiplier.get(vehicle.vehicleType) || 1.0;
    } else if (typeof premiumRules.vehicleTypeMultiplier === 'object') {
      vehicleTypeMultiplier =
        premiumRules.vehicleTypeMultiplier[vehicle.vehicleType] || 1.0;
    }
  }

  // ── Get Coverage Multiplier ──
  let coverageMultiplier = 1.0;
  if (premiumRules?.coverageMultiplier) {
    if (premiumRules.coverageMultiplier instanceof Map) {
      coverageMultiplier =
        premiumRules.coverageMultiplier.get(coverageType) || 1.0;
    } else if (typeof premiumRules.coverageMultiplier === 'object') {
      coverageMultiplier =
        premiumRules.coverageMultiplier[coverageType] || 1.0;
    }
  }

  // ── Get Age Depreciation ──
  const ageDepreciationRate = premiumRules?.ageDepreciation ?? 2;

  // Calculate depreciation factor (minimum 50%)
  const depreciationFactor = Math.max(
    0.5,
    1 - (vehicleAge * ageDepreciationRate) / 100
  );

  // ── Calculate Final Amount ──
  const rawAmount =
    baseAmount * vehicleTypeMultiplier * coverageMultiplier * depreciationFactor;

  const finalAmount = Math.round(rawAmount * 100) / 100;

  // ── Return Detailed Breakdown ──
  return {
    baseAmount,
    vehicleType: vehicle.vehicleType,
    vehicleTypeMultiplier,
    coverageType,
    coverageMultiplier,
    vehicleAge,
    ageDepreciationRate,
    depreciationFactor: Math.round(depreciationFactor * 100) / 100,
    calculationSteps: {
      step1: `Base Amount: ₹${baseAmount}`,
      step2: `× Vehicle Type (${vehicle.vehicleType}): ${vehicleTypeMultiplier}`,
      step3: `× Coverage (${coverageType}): ${coverageMultiplier}`,
      step4: `× Age Factor (${vehicleAge}yr, -${ageDepreciationRate}%/yr): ${Math.round(depreciationFactor * 100) / 100}`,
      result: `= ₹${finalAmount}`,
    },
    finalAmount,
  };
};