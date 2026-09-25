/* data.js — Static datasets for canopy, heat, air, and income */
// All values are illustrative SAMPLE DATA unless a source note says otherwise.
// Sources cited on each page and in README.md.

const neighborhoods = [
  {
    id: "laurel-heights",
    name: "Laurel Heights",
    city: "Sample Metro",
    incomeBracket: "High",
    medianIncome: 112000,
    canopyPct: 38,
    surfaceTempC: 31.2,
    aqiEstimate: 42,
    population: 18200,
    description: "Leafy, early-1900s suburb with historic oaks."
  },
  {
    id: "maple-ridge",
    name: "Maple Ridge",
    city: "Sample Metro",
    incomeBracket: "High",
    medianIncome: 98000,
    canopyPct: 34,
    surfaceTempC: 32.0,
    aqiEstimate: 48,
    population: 22400,
    description: "Park-adjacent streets, strong canopy ordinances."
  },
  {
    id: "cedar-park",
    name: "Cedar Park",
    city: "Sample Metro",
    incomeBracket: "Middle-High",
    medianIncome: 76000,
    canopyPct: 26,
    surfaceTempC: 34.1,
    aqiEstimate: 62,
    population: 30100,
    description: "Mixed housing, partial street-tree program."
  },
  {
    id: "elm-district",
    name: "Elm District",
    city: "Sample Metro",
    incomeBracket: "Middle",
    medianIncome: 62000,
    canopyPct: 19,
    surfaceTempC: 36.4,
    aqiEstimate: 74,
    population: 27800,
    description: "Dense row-housing, narrow sidewalks."
  },
  {
    id: "river-ward",
    name: "River Ward",
    city: "Sample Metro",
    incomeBracket: "Middle-Low",
    medianIncome: 48000,
    canopyPct: 14,
    surfaceTempC: 37.8,
    aqiEstimate: 88,
    population: 35500,
    description: "Industrial edges, freight corridor nearby."
  },
  {
    id: "south-gate",
    name: "South Gate",
    city: "Sample Metro",
    incomeBracket: "Low",
    medianIncome: 36000,
    canopyPct: 9,
    surfaceTempC: 39.6,
    aqiEstimate: 102,
    population: 41200,
    description: "Wide asphalt streets, few street trees."
  },
  {
    id: "westfield-flats",
    name: "Westfield Flats",
    city: "Sample Metro",
    incomeBracket: "Low",
    medianIncome: 32000,
    canopyPct: 7,
    surfaceTempC: 40.8,
    aqiEstimate: 118,
    population: 38900,
    description: "Warehouse district turned housing, heat island core."
  },
  {
    id: "oak-hollow",
    name: "Oak Hollow",
    city: "Sample Metro",
    incomeBracket: "Middle-High",
    medianIncome: 82000,
    canopyPct: 29,
    surfaceTempC: 33.3,
    aqiEstimate: 55,
    population: 19600,
    description: "Protected ravine, active stewardship group."
  }
];

// City case-study summaries — sample data, clearly labeled
const caseStudies = [
  {
    city: "Los Angeles, CA",
    headline: "From 21% to 12%: canopy halves across the freeway",
    story: "A 2019 county analysis found affluent hillside tracts averaging ~31% cover while South LA tracts averaged ~12%. Summer surface temps tracked the gap: +6–8°C on bare blocks.",
    stats: [
      { label: "High-income tracts canopy", value: "31%" },
      { label: "Low-income tracts canopy", value: "12%" },
      { label: "Peak surface Δ", value: "+7.4°C" }
    ],
    source: "Sample synthesis of LA County Tree Canopy Assessment (2019) & Landsat LST — illustrative."
  },
  {
    city: "Phoenix, AZ",
    headline: "Shade is survival infrastructure",
    story: "In Maricopa County, neighborhoods with <10% cover recorded 40+ excess heat-associated ER visits per 10k residents compared to >30% cover neighborhoods over the 2020–2023 heat seasons.",
    stats: [
      { label: "Neighborhoods <10% cover", value: "34%" },
      { label: "Heat ER excess", value: "+42 / 10k" },
      { label: "Cool-corridor Δ", value: "–4.2°C" }
    ],
    source: "Sample illustrative — see README for real source list."
  },
  {
    city: "New York City, NY",
    headline: "The tree-belt and the heat-belt",
    story: "MillionTreesNYC lifted cover citywide, but gains clustered. Community districts in the Bronx and eastern Queens still show 15–18 point canopy gaps versus Upper Manhattan brownstone blocks.",
    stats: [
      { label: "Citywide canopy (2022)", value: "22%" },
      { label: "Equity gap (max–min CD)", value: "18 pts" },
      { label: "Cooling benefit", value: "–3.8°C" }
    ],
    source: "Sample based on NYC Urban Tree Canopy Assessment — marked as sample data on page."
  }
];

// Aggregated explainer numbers
const explainerStats = {
  shadeTempDelta: "8–12°F",
  energySaving: "15–35%",
  pm25Reduction: "7–24%",
  heatRiskMultiplier: "2–3×"
};

// Helper: color scale mapping for canopy %
function canopyColor(pct) {
  // maps 0–40% to a green ramp; values >40 clamp to high
  if (pct >= 30) return "var(--color-canopy-high)";
  if (pct >= 20) return "var(--color-canopy-mid)";
  if (pct >= 10) return "#8ec6a0";
  return "var(--color-canopy-low)";
}

// Helper: heat color for surface temp
function heatColor(tempC) {
  if (tempC >= 40) return "var(--color-heat-extreme)";
  if (tempC >= 38) return "var(--color-heat-hot)";
  if (tempC >= 35) return "var(--color-heat-warm)";
  if (tempC >= 33) return "var(--color-heat-mild)";
  return "var(--color-heat-cool)";
}
