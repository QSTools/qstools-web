export const formulaGroups = [
  {
    id: "formula-conventions",
    title: "Formula conventions",
    description:
      "Shared assumptions and base relationships used across the app.",
    defaultOpen: true,
    rows: [
      {
        metric: "Paid Hours / Year",
        formula: "HoursPerWeek × 52",
        inputs: "Hours per week",
        meaning: "Total paid hours in a full year before productivity adjustment.",
        notes: "Use your actual annual convention if you later support custom week counts.",
      },
      {
        metric: "Productive Hours / Year",
        formula: "PaidHoursYear × ProductivityFactor",
        inputs: "Paid Hours / Year, productivity assumption",
        meaning:
          "The portion of annual paid hours that can realistically be recovered through chargeable work.",
        notes: "This is one of the most important assumptions in the model.",
      },
      {
        metric: "Gross Annual Rate",
        formula: "GrossHourlyRate × PaidHoursYear",
        inputs: "Gross hourly rate, paid hours / year",
        meaning: "Annualised direct wage before on-costs and commercial recovery.",
        notes: "",
      },
    ],
  },
  {
    id: "labour-formulas",
    title: "Labour formulas",
    description:
      "Core labour outputs that describe direct employment cost and required charge-out recovery.",
    defaultOpen: true,
    rows: [
      {
        metric: "Total Employment Cost / Year",
        formula: "GrossAnnualRate + EmployerOnCosts + LeaveCost + OtherEmploymentCosts",
        inputs:
          "Gross annual pay, PAYE-related employer costs, leave, employer contributions, other labour assumptions",
        meaning: "The full direct annual cost of employing the person.",
        notes: "Exact components depend on your labour calculation engine.",
      },
      {
        metric: "Loaded Hourly Cost",
        formula: "TotalEmploymentCostYear ÷ PaidHoursYear",
        inputs: "Total Employment Cost / Year, Paid Hours / Year",
        meaning:
          "Average direct employment cost spread across all paid hours.",
        notes: "This is not yet the recovered commercial cost.",
      },
      {
        metric: "Effective Recovered Cost / Hr",
        formula: "TotalEmploymentCostYear ÷ ProductiveHoursYear",
        inputs: "Total Employment Cost / Year, Productive Hours / Year",
        meaning:
          "The real hourly direct labour cost once unproductive time is considered.",
        notes: "This is usually higher than the loaded hourly cost.",
      },
      {
        metric: "Target Rate",
        formula: "EffectiveRecoveredCostHr ÷ (1 - TargetMarginPct)",
        inputs: "Effective Recovered Cost / Hr, target margin %",
        meaning:
          "The charge-out rate required to achieve the target margin on direct labour cost.",
        notes: "Margin must be expressed as a decimal in actual calculation logic.",
      },
      {
        metric: "Rate Gap to Target",
        formula: "ChargeOutRate - TargetRate",
        inputs: "Charge-out rate, target rate",
        meaning:
          "Shows whether the current selling rate is above or below the required target rate.",
        notes: "A negative gap means the current rate is under target.",
      },
      {
        metric: "Recovery Gap",
        formula: "ChargeOutRate - EffectiveRecoveredCostHr",
        inputs: "Charge-out rate, Effective Recovered Cost / Hr",
        meaning:
          "Shows the raw hourly headroom between selling price and recovered direct labour cost.",
        notes: "This is not the same as final profit if overhead recovery is still missing.",
      },
    ],
  },
  {
    id: "overhead-formulas",
    title: "Employee overhead formulas",
    description:
      "How overhead allocation and vehicle burden convert into annual and hourly overhead recovery.",
    defaultOpen: false,
    rows: [
      {
        metric: "Annual Overhead Total",
        formula: "GeneralOverheads + VehicleOverheads + OtherAssignedOverheads",
        inputs:
          "General overhead entries, vehicle entries, any additional assigned costs",
        meaning:
          "The annual business burden allocated to that labour profile outside direct employment cost.",
        notes: "Exact field names depend on your overhead page model.",
      },
      {
        metric: "Hourly Overhead Recovery",
        formula: "AnnualOverheadTotal ÷ ProductiveHoursYear",
        inputs: "Annual Overhead Total, Productive Hours / Year",
        meaning:
          "The overhead burden that must be recovered per productive hour.",
        notes: "This is why the link to the labour profile is important.",
      },
      {
        metric: "Vehicle Cost / Hr",
        formula: "AnnualVehicleCost ÷ ProductiveHoursYear",
        inputs: "Annual vehicle cost, Productive Hours / Year",
        meaning:
          "How much vehicle cost contributes to the hourly overhead recovery burden.",
        notes: "Use the app’s vehicle inclusion toggle rules where applicable.",
      },
    ],
  },
  {
    id: "commercial-formulas",
    title: "Commercial formulas",
    description:
      "Portfolio-level commercial interpretation once labour and overhead profiles are combined.",
    defaultOpen: false,
    rows: [
      {
        metric: "Real Cost / Hr",
        formula: "EffectiveRecoveredCostHr + HourlyOverheadRecovery",
        inputs:
          "Effective Recovered Cost / Hr, hourly overhead recovery",
        meaning:
          "The full hourly cost base once both direct labour and assigned overhead burden are included.",
        notes: "This is the most commercially complete hourly cost figure.",
      },
      {
        metric: "Profit / Hr",
        formula: "ChargeOutRate - RealCostHr",
        inputs: "Charge-out rate, Real Cost / Hr",
        meaning:
          "Hourly commercial profit after direct labour and linked overhead burden.",
        notes: "A negative value indicates the person is losing money per recovered hour.",
      },
      {
        metric: "Annual Revenue",
        formula: "ChargeOutRate × ProductiveHoursYear",
        inputs: "Charge-out rate, Productive Hours / Year",
        meaning: "Annual sales value generated by that profile at the current charge-out rate.",
        notes: "",
      },
      {
        metric: "Annual Profit",
        formula: "ProfitHr × ProductiveHoursYear",
        inputs: "Profit / Hr, Productive Hours / Year",
        meaning: "Annual commercial profit generated by the profile.",
        notes: "",
      },
      {
        metric: "Margin %",
        formula: "ProfitHr ÷ ChargeOutRate",
        inputs: "Profit / Hr, charge-out rate",
        meaning:
          "Commercial margin generated by the current charge-out setup.",
        notes: "Display as a percentage in the UI.",
      },
      {
        metric: "Break-even Rate",
        formula: "RealCostHr",
        inputs: "Real Cost / Hr",
        meaning:
          "The minimum hourly selling rate required to stop losing money.",
        notes: "Any selling rate below this is negative-profit territory.",
      },
      {
        metric: "Break-even Rate Increase",
        formula: "BreakEvenRate - ChargeOutRate",
        inputs: "Break-even rate, charge-out rate",
        meaning:
          "Additional hourly increase required to reach break-even.",
        notes: "Only relevant where current profit is negative.",
      },
    ],
  },
];