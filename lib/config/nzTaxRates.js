export const NZ_TAX = {
  brackets: [
    { upTo: 15600, rate: 0.105 },
    { upTo: 53500, rate: 0.175 },
    { upTo: 78100, rate: 0.30 },
    { upTo: 180000, rate: 0.33 },
    { upTo: Infinity, rate: 0.39 },
  ],
  acc: {
    rate: 0.0167,
    cap: 152790,
  },
};

export const TAX_CODE_OPTIONS = [
  { value: "M", label: "M" },
  { value: "ME", label: "ME" },
  { value: "S", label: "S" },
  { value: "SH", label: "SH" },
  { value: "ST", label: "ST" },
  { value: "SA", label: "SA" },
  { value: "SB", label: "SB" },
  { value: "ND", label: "ND" },
  { value: "CAE", label: "CAE" },
  { value: "WT", label: "WT" },
];

export const ESCT_BRACKETS = [
  { upTo: 18720, rate: 0.105 },
  { upTo: 64200, rate: 0.175 },
  { upTo: 93720, rate: 0.30 },
  { upTo: 216000, rate: 0.33 },
  { upTo: Infinity, rate: 0.39 },
];