/**
 * Premium Calculation Engine
 * Calculates insurance premium based on policy rules, vehicle type, and age
 */

export const calculatePremium = (policy, vehicle) => {
    const { baseAmount, premiumRules } = policy;
    const vehicleAge = new Date().getFullYear() - vehicle.registrationYear;

    // Get multipliers from premium rules
    const vehicleTypeMultiplier =
        premiumRules.vehicleTypeMultiplier?.get(vehicle.vehicleType) ||
        premiumRules.vehicleTypeMultiplier?.[vehicle.vehicleType] ||
        1.0;

    const coverageMultiplier =
        premiumRules.coverageMultiplier?.get(policy.coverageType) ||
        premiumRules.coverageMultiplier?.[policy.coverageType] ||
        1.0;

    const ageDepreciation = premiumRules.ageDepreciation || 2; // % per year

    // Calculate depreciation factor (older vehicles cost less)
    const depreciationFactor = Math.max(
        0.5, // minimum 50% of base
        1 - (vehicleAge * ageDepreciation) / 100
    );

    // Calculate final premium
    const calculatedAmount =
        baseAmount * vehicleTypeMultiplier * coverageMultiplier * depreciationFactor;

    // Return breakdown
    return {
        baseAmount,
        vehicleTypeMultiplier,
        coverageMultiplier,
        ageDepreciation: depreciationFactor,
        vehicleAge,
        finalAmount: Math.round(calculatedAmount * 100) / 100, // Round to 2 decimal
    };
};