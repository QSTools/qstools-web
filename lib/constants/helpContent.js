export const helpSections = [
  {
    id: "overview",
    eyebrow: "Overview",
    title: "What this tool does",
    intro:
      "QS Tools helps you understand the true commercial cost of labour, recover business overheads properly, and compare your real cost base against charge-out rates and target margins.",
    paragraphs: [
      "The app is designed to move beyond simple wage calculations. It combines gross pay, employer on-costs, leave, productivity assumptions, overhead allocation, and commercial pricing into one structured workflow.",
      "That gives you a clearer view of what one person really costs the business, what they need to be sold at, and how a group of saved profiles performs as a portfolio.",
    ],
    callout: {
      title: "Business value",
      tone: "info",
      body:
        "Use the tool to improve pricing decisions, understand margin pressure, compare staff setups, and identify where overhead recovery or productivity assumptions are weakening profit.",
    },
  },
  {
    id: "recommended-workflow",
    eyebrow: "Workflow",
    title: "Recommended workflow",
    intro:
      "The best results come from using the three main pages in order.",
    steps: [
      "Start on the Labour page and enter one staff member at a time.",
      "Enter gross pay, paid hours, productivity assumptions, charge-out rate, and margin targets.",
      "Review the Labour output cards to understand direct employment cost and recovered hourly cost.",
      "Save the labour profile.",
      "Open Employee Overheads and link or create the overhead profile for that same labour profile.",
      "Review the overhead total and hourly recovery impact, then save.",
      "Open Commercial to compare all saved profiles together and identify the strongest and weakest commercial performers.",
    ],
  },
  {
    id: "labour-guide",
    eyebrow: "Labour",
    title: "How to use the Labour page",
    intro:
      "The Labour page is where you build the direct employment cost model for one person.",
    bullets: [
      "Enter staff name, role, pay assumptions, and hours.",
      "Set productivity or recovered productive hour assumptions carefully.",
      "Enter commercial assumptions like target margin and charge-out rate.",
      "Use the summary and profitability cards to see annual and hourly outcomes.",
      "Save the profile once the numbers look right.",
      "Use New Staff Member or a cleared form flow before entering the next person.",
    ],
    callout: {
      title: "Important",
      tone: "warning",
      body:
        "The Labour page gives you direct employment cost. It becomes more commercially complete once the linked overhead profile has also been added.",
    },
  },
  {
    id: "overheads-guide",
    eyebrow: "Employee Overheads",
    title: "How to use the Employee Overheads page",
    intro:
      "The Employee Overheads page lets you assign business overheads and vehicle-related costs to an individual labour profile.",
    paragraphs: [
      "This page is where you recover costs that sit outside direct pay, such as overhead allocation, business support cost, and vehicle-related burden where relevant.",
      "The overhead profile should stay linked to the correct labour profile so the Commercial page can combine both views into one row.",
    ],
    bullets: [
      "Select or confirm the linked labour profile.",
      "Enter general overhead categories and any vehicle assumptions.",
      "Review annual and hourly overhead totals.",
      "Save the overhead profile so it becomes available to the Commercial page.",
    ],
  },
  {
    id: "commercial-guide",
    eyebrow: "Commercial",
    title: "How to read the Commercial page",
    intro:
      "The Commercial page is the portfolio view. It brings together saved labour profiles and linked overhead profiles so you can compare commercial performance across the business.",
    paragraphs: [
      "This is the decision page. It shows total annual profit, margins, revenue, and which profiles are strongest or weakest commercially.",
      "Use it to identify break-even gaps, below-target performers, missing overhead links, and where the biggest improvement opportunity sits.",
    ],
    bullets: [
      "Review top-level totals first.",
      "Compare each saved profile row.",
      "Check status and margin indicators.",
      "Focus on break-even gaps and below-target profiles.",
      "Use the insight summary to prioritise action.",
    ],
  },
  {
    id: "flags-statuses",
    eyebrow: "Flags",
    title: "What the flags and statuses mean",
    intro:
      "Flags exist to turn raw numbers into decisions. They help you quickly spot where a profile is healthy, at target, below target, or commercially risky.",
    bullets: [
      "Healthy means the profile is producing an acceptable commercial outcome based on the rules in your app.",
      "Warning or below target means the current charge-out rate or margin is not meeting the expected target.",
      "Danger means the profile is likely losing money or materially underperforming.",
      "Missing overheads means the labour profile has not yet been commercially completed with a linked overhead profile.",
      "A break-even message shows how much rate increase is required to stop losing money.",
    ],
  },
  {
    id: "practical-tips",
    eyebrow: "Practical use",
    title: "Practical tips and caveats",
    intro:
      "The quality of the outputs depends on the realism of the assumptions entered.",
    bullets: [
      "Use realistic productive hour assumptions rather than optimistic ones.",
      "Check whether the charge-out rate reflects the actual market you sell into.",
      "Treat margin targets as commercial strategy, not just calculator defaults.",
      "Keep labour and overhead profiles correctly linked.",
      "Review saved profiles periodically as wages, utilisation, vehicle costs, and business overheads change.",
    ],
    callout: {
      title: "Reminder",
      tone: "success",
      body:
        "This tool is most valuable when used comparatively. One profile is useful, but a portfolio of profiles gives you much better commercial intelligence.",
    },
  },
];