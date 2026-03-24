export const BAR_OPTIONS = ["HD10", "HD12", "HD16", "HD20", "HD25", "HD32"];
export const TIE_OPTIONS = ["R6", "R10", "R12", "R16"];
export const MPA_OPTIONS = ["20", "25", "30", "35", "40"];
export const PUMP_OPTIONS = ["No Pump", "2inc Line Pump", "4inc Line Boom Pump"];

export const PUMP_RULES = {
  "No Pump": {
    mix: "Std",
    rateM3PerHour: 0,
    establishmentLabel: "",
    hourlyLabel: "",
    perM3Label: "",
  },
  "2inc Line Pump": {
    mix: "Grout Mix",
    rateM3PerHour: 13.8,
    establishmentLabel: "2InchLine Establishment",
    hourlyLabel: "2InchLine Hourly",
    perM3Label: "2InchLine Per Metre Pumped",
  },
  "4inc Line Boom Pump": {
    mix: "13mm Pump Mix",
    rateM3PerHour: 21.6,
    establishmentLabel: "4InchLine Boom Pump Establishment",
    hourlyLabel: "4InchLine Boom Pump Hourly",
    perM3Label: "4InchLine Boom Pump Per Metre Pumped",
  },
};