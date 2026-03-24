export const LABOUR_TOOLTIPS = {
  loadedHourlyCost: (
    <div className="space-y-2">
      <p className="font-medium">True cost per productive working hour</p>
      <p className="text-muted-foreground">
        This builds up from the employee’s annual cost, then spreads that cost
        across productive hours only.
      </p>
      <div className="text-xs leading-5">
        <div>Loaded Hourly Cost = Total Employment Cost ÷ Productive Hours</div>
        <div className="mt-1">Total Employment Cost includes:</div>
        <div>• Gross wages</div>
        <div>• Employer KiwiSaver</div>
        <div>• ESCT on employer KiwiSaver</div>
        <div className="mt-1">Productive Hours = Paid Hours less:</div>
        <div>• Annual leave</div>
        <div>• Public holidays</div>
        <div>• Sick leave</div>
        <div>• Bereavement leave</div>
        <div>• Family violence leave (if included)</div>
      </div>
    </div>
  ),

  effectiveRecoveredCost: (
    <div className="space-y-2">
      <p className="font-medium">True cost per billable recovered hour</p>
      <p className="text-muted-foreground">
        This takes the loaded hourly cost and adjusts it for real-world
        productivity.
      </p>
      <div className="text-xs leading-5">
        <div>Effective Cost = Loaded Hourly Cost ÷ Efficiency %</div>
        <div className="mt-1">Why this matters:</div>
        <div>• Not every paid hour is recovered</div>
        <div>• Travel, setup, downtime and delays reduce recovery</div>
        <div>• Lower efficiency pushes true billable cost higher</div>
        <div className="mt-1">
          This is the key number to compare against your charge-out rate.
        </div>
      </div>
    </div>
  ),

  chargeoutRate: (
    <div className="space-y-2">
      <p className="font-medium">The hourly rate charged to the client</p>
      <p className="text-muted-foreground">
        This is the sell rate for the labour resource.
      </p>
      <div className="text-xs leading-5">
        <div>Charge-Out Rate should cover:</div>
        <div>• Effective labour cost</div>
        <div>• Business overhead</div>
        <div>• Desired profit margin</div>
        <div className="mt-1">
          If Charge-Out Rate is below Effective Cost, the labour is loss-making.
        </div>
      </div>
    </div>
  ),

  targetMarginPct: (
    <div className="space-y-2">
      <p className="font-medium">Desired profit margin on labour</p>
      <p className="text-muted-foreground">
        This is the margin you want to achieve after labour cost and
        productivity are taken into account.
      </p>
      <div className="text-xs leading-5">
        <div>Target Margin is used to calculate the Target Rate.</div>
        <div className="mt-1">Example:</div>
        <div>• Higher target margin = higher required charge-out rate</div>
        <div>• Lower target margin = lower required charge-out rate</div>
      </div>
    </div>
  ),

  targetRate: (
    <div className="space-y-2">
      <p className="font-medium">
        Required charge-out rate to hit your target margin
      </p>
      <p className="text-muted-foreground">
        This is the sell rate needed to achieve the selected target margin based
        on the effective recovered labour cost.
      </p>
      <div className="text-xs leading-5">
        <div>Target Rate = Effective Cost ÷ (1 − Target Margin)</div>
        <div className="mt-1">Interpretation:</div>
        <div>• If actual charge-out is above this, you are ahead of target</div>
        <div>• If actual charge-out is below this, you are under target</div>
      </div>
    </div>
  ),

  rateGapToTarget: (
    <div className="space-y-2">
      <p className="font-medium">
        Difference between actual rate and target rate
      </p>
      <p className="text-muted-foreground">
        This shows whether your current charge-out rate is above or below the
        rate required to meet your selected margin target.
      </p>
      <div className="text-xs leading-5">
        <div>Rate Gap to Target = Charge-Out Rate − Target Rate</div>
        <div className="mt-1">Interpretation:</div>
        <div>• Positive = charging above target</div>
        <div>• Negative = charging below target</div>
        <div>• Zero = right on target</div>
      </div>
    </div>
  ),

  recoveryGap: (
    <div className="space-y-2">
      <p className="font-medium">Profit buffer per recovered hour</p>
      <p className="text-muted-foreground">
        This shows the difference between what you charge and what the labour
        truly costs per recovered hour.
      </p>
      <div className="text-xs leading-5">
        <div>Recovery Gap = Charge-Out Rate − Effective Cost</div>
        <div className="mt-1">Interpretation:</div>
        <div>• Positive = profit buffer exists</div>
        <div>• Negative = loss per recovered hour</div>
        <div>• Zero = break-even</div>
      </div>
    </div>
  ),

  marginPct: (
    <div className="space-y-2">
      <p className="font-medium">Profit as a percentage of revenue</p>

      <div className="text-xs leading-5">
        <div>Margin = (Charge-Out − Effective Cost) ÷ Charge-Out</div>

        <div className="mt-2">
          Margin shows how much of your sell rate you actually keep as profit.
        </div>

        <div className="mt-2 font-medium text-foreground">
          This is the primary commercial metric for pricing decisions.
        </div>

        <div className="mt-2">
          Guide:
          <div>• Below 10% = high risk</div>
          <div>• 10–20% = tight</div>
          <div>• 20%+ = healthy</div>
        </div>
      </div>
    </div>
  ),

  markupPct: (
    <div className="space-y-2">
      <p className="font-medium">Profit relative to cost</p>

      <div className="text-xs leading-5">
        <div>Markup = (Charge-Out − Effective Cost) ÷ Effective Cost</div>

        <div className="mt-2">
          Markup shows how much has been added on top of the true labour cost
          before sale.
        </div>

        <div className="mt-2">
          It is useful for cost-plus pricing, but{" "}
          <span className="font-medium text-foreground">
            Margin % is the more important commercial metric
          </span>{" "}
          because it shows how much profit you keep from the final sell rate.
        </div>

        <div className="mt-2">
          As a guide:
          <div>• ~25% markup ≈ 20% margin</div>
          <div>• ~11% markup ≈ 10% margin</div>
        </div>
      </div>
    </div>
  ),
};