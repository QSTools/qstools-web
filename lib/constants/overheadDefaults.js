export const OVERHEAD_STORAGE_KEY = "qs-tools-overhead-profiles";
export const OVERHEAD_DRAFT_KEY = "qs-tools-overhead-draft";
export const LABOUR_STORAGE_KEY = "qs-tools-labour-profiles";

export const DEFAULT_FORM = {
  id: "",
  labourProfileId: "",
  profileName: "",
  staffName: "",
  role: "",

  phoneEnabled: false,
  phoneFrequency: "monthly",
  phoneAmount: "",

  ppeEnabled: false,
  ppeFrequency: "yearly",
  ppeAmount: "",

  toolsEnabled: false,
  toolsFrequency: "monthly",
  toolsAmount: "",

  trainingEnabled: false,
  trainingFrequency: "yearly",
  trainingAmount: "",

  uniformEnabled: false,
  uniformFrequency: "yearly",
  uniformAmount: "",

  softwareEnabled: false,
  softwareFrequency: "monthly",
  softwareAmount: "",

  otherEnabled: false,
  otherFrequency: "monthly",
  otherAmount: "",

  vehicleEnabled: false,
  vehicleType: "company",
  vehicleRecoveryBasis: "productive",

  vehiclePurchasePrice: 60000,
  vehicleResidualValue: 0,
  vehicleUsefulLifeYears: 5,

  vehicleLoanAmount: 60000,
  vehicleInterestRate: 8,

  vehicleInsurance: 2500,
  vehicleRego: 550,
  vehicleCofWof: 250,
  vehicleRuc: 0,

  vehicleFuel: 8000,
  vehicleMaintenance: 3000,
  vehicleTyresRepairs: 1500,

  fuelOnlyFuel: 5000,
  fuelOnlyAllowance: 0,
  fuelOnlyMaintenanceContribution: 0,

  includeVehicleReplacementAllowance: false,
};