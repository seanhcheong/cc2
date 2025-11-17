if (typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cards = [
  {
    card_id: "chase-sapphire-preferred",
    card_name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    card_type: "travel_rewards",
    fees: {
      annual_fee: 95,
      foreign_transaction_fee: 0,
    },
    apr: {
      purchase_apr: "21.49% - 28.49% variable",
      intro_purchase_apr: null,
      intro_balance_transfer_apr: null,
    },
    rewards: {
      reward_type: "points",
      base_earn_rate: 1,
      bonus_categories: [
        { category: "travel", earn_rate: 5 },
        { category: "dining", earn_rate: 3 },
        { category: "online_grocery", earn_rate: 3 },
      ],
      sign_up_bonus: {
        bonus_amount: 60000,
        estimated_value_usd: 750,
      },
      point_value: {
        cash_value: 0.01,
        portal_booking_value: 0.0125,
        transfer_partner_value: 0.0125,
      },
      transfer_partners: ["United", "Southwest", "Hyatt"],
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: true,
        trip_interruption: true,
        trip_delay: true,
        baggage_delay: true,
        lost_luggage: true,
        emergency_medical: true,
        rental_car_insurance: true,
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: true,
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 690,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
      },
    },
  },
  {
    card_id: "citi-double-cash",
    card_name: "Citi Double Cash",
    issuer: "Citi",
    network: "Mastercard",
    card_type: "cash_back",
    fees: {
      annual_fee: 0,
      foreign_transaction_fee: 3,
    },
    apr: {
      purchase_apr: "19.24% - 29.24% variable",
      intro_purchase_apr: null,
      intro_balance_transfer_apr: "0% for 18 months",
    },
    rewards: {
      reward_type: "cash_back",
      base_earn_rate: 2,
      bonus_categories: [],
      sign_up_bonus: null,
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: false,
        trip_interruption: false,
        trip_delay: false,
        baggage_delay: false,
        lost_luggage: false,
        emergency_medical: false,
        rental_car_insurance: false,
      },
      purchase_protection: {
        purchase_protection: false,
        extended_warranty: false,
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 670,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
      },
    },
  },
  {
    card_id: "capital-one-venture",
    card_name: "Capital One Venture Rewards",
    issuer: "Capital One",
    network: "Visa",
    card_type: "travel_rewards",
    fees: {
      annual_fee: 95,
      foreign_transaction_fee: 0,
    },
    apr: {
      purchase_apr: "19.99% - 29.99% variable",
      intro_purchase_apr: null,
      intro_balance_transfer_apr: null,
    },
    rewards: {
      reward_type: "miles",
      base_earn_rate: 2,
      bonus_categories: [
        { category: "travel", earn_rate: 5 },
      ],
      sign_up_bonus: {
        bonus_amount: 75000,
        estimated_value_usd: 750,
      },
      point_value: {
        cash_value: 0.01,
        portal_booking_value: 0.01,
        transfer_partner_value: 0.014,
      },
      transfer_partners: ["Air Canada", "Avianca", "Etihad"],
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: true,
        trip_interruption: true,
        trip_delay: true,
        baggage_delay: true,
        lost_luggage: true,
        emergency_medical: false,
        rental_car_insurance: true,
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: false,
      },
      lounge_access: false,
      tsa_precheck_credit: true,
      global_entry_credit: true,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 690,
      estimated_approval_odds: {
        excellent_credit: "moderate",
        good_credit: "moderate",
      },
    },
  },
  {
    card_id: "amex-gold",
    card_name: "American Express® Gold",
    issuer: "American Express",
    network: "American Express",
    card_type: "travel_rewards",
    fees: {
      annual_fee: 250,
      foreign_transaction_fee: 0,
    },
    apr: {
      purchase_apr: "20.74% - 28.74% variable",
      intro_purchase_apr: null,
      intro_balance_transfer_apr: null,
    },
    rewards: {
      reward_type: "points",
      base_earn_rate: 1,
      bonus_categories: [
        { category: "dining", earn_rate: 4 },
        { category: "travel", earn_rate: 3 },
        { category: "online_grocery", earn_rate: 4 },
      ],
      sign_up_bonus: {
        bonus_amount: 60000,
        estimated_value_usd: 600,
      },
      point_value: {
        cash_value: 0.006,
        portal_booking_value: 0.01,
        transfer_partner_value: 0.013,
      },
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: false,
        trip_interruption: false,
        trip_delay: true,
        baggage_delay: true,
        lost_luggage: true,
        emergency_medical: false,
        rental_car_insurance: false,
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: true,
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 700,
      estimated_approval_odds: {
        excellent_credit: "moderate",
        good_credit: "low",
      },
    },
  },
  {
    card_id: "wells-fargo-autograph",
    card_name: "Wells Fargo Autograph",
    issuer: "Wells Fargo",
    network: "Visa",
    card_type: "no_annual_fee",
    fees: {
      annual_fee: 0,
      foreign_transaction_fee: 0,
    },
    apr: {
      purchase_apr: "20.24% - 29.99% variable",
      intro_purchase_apr: null,
      intro_balance_transfer_apr: "0% for 12 months",
    },
    rewards: {
      reward_type: "points",
      base_earn_rate: 1,
      bonus_categories: [
        { category: "travel", earn_rate: 3 },
        { category: "dining", earn_rate: 3 },
        { category: "gas", earn_rate: 3 },
      ],
      sign_up_bonus: {
        bonus_amount: 30000,
        estimated_value_usd: 300,
      },
      point_value: {
        cash_value: 0.01,
        portal_booking_value: 0.01,
        transfer_partner_value: 0.011,
      },
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: false,
        trip_interruption: false,
        trip_delay: false,
        baggage_delay: false,
        lost_luggage: false,
        emergency_medical: false,
        rental_car_insurance: false,
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: true,
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 670,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
      },
    },
  },
  {
    card_id: "chase-freedom-unlimited",
    card_name: "Chase Freedom Unlimited",
    issuer: "Chase",
    network: "Visa",
    card_type: "cash_back",
    fees: {
      annual_fee: 0,
      foreign_transaction_fee: 3,
    },
    apr: {
      purchase_apr: "19.49% - 28.24% variable",
      intro_purchase_apr: "0% for 15 months",
      intro_balance_transfer_apr: "0% for 15 months",
    },
    rewards: {
      reward_type: "cash_back",
      base_earn_rate: 1.5,
      bonus_categories: [
        { category: "dining", earn_rate: 3 },
        { category: "travel", earn_rate: 5 },
        { category: "online_grocery", earn_rate: 3 },
      ],
      sign_up_bonus: {
        bonus_amount: 20000,
        estimated_value_usd: 200,
      },
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: false,
        trip_interruption: false,
        trip_delay: false,
        baggage_delay: false,
        lost_luggage: false,
        emergency_medical: false,
        rental_car_insurance: false,
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: true,
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      cell_phone_protection: false,
    },
    requirements: {
      min_credit_score: 670,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
      },
    },
  },
];

const defaultSelection = cards.slice(0, 4).map((card) => card.card_id);

const state = {
  creditScore: 720,
  travelPreference: 70,
  simplicityPreference: 40,
  diningSpend: 4800,
  preferences: {
    international: true,
    cashback: false,
    balance: false,
  },
  selectedCards: new Set(defaultSelection),
};

const elements = {
  creditScore: document.getElementById("creditScore"),
  creditScoreValue: document.getElementById("creditScoreValue"),
  travelPreference: document.getElementById("travelPreference"),
  travelPreferenceValue: document.getElementById("travelPreferenceValue"),
  simplicityPreference: document.getElementById("simplicityPreference"),
  simplicityPreferenceValue: document.getElementById("simplicityPreferenceValue"),
  diningSpend: document.getElementById("diningSpend"),
  diningSpendValue: document.getElementById("diningSpendValue"),
  toggles: document.querySelectorAll(".toggle"),
  confidenceScore: document.getElementById("confidenceScore"),
  bestCardName: document.getElementById("bestCardName"),
  bestCardTagline: document.getElementById("bestCardTagline"),
  scoreHighlights: document.getElementById("scoreHighlights"),
  bucketGrid: document.getElementById("bucketGrid"),
  benefitJourney: document.getElementById("benefitJourney"),
  comparisonTable: document.querySelector("#comparisonTable tbody"),
  radarLegend: document.getElementById("radarLegend"),
  cardPicker: document.getElementById("cardPicker"),
  comparisonDeck: document.getElementById("comparisonDeck"),
};

const storySteps = document.querySelectorAll(".story-step");
const sceneSections = document.querySelectorAll("[data-scene]");
const rootStyle = document.documentElement.style;
const bodyEl = document.body;

const palette = ["#7cf4ff", "#ff72d6", "#ffd166", "#9b6bff", "#5df2b5", "#ff9ec4"];

function getColorForCard(cardId) {
  const index = cards.findIndex((card) => card.card_id === cardId);
  return palette[index % palette.length];
}

// --- Spend + scoring helpers -------------------------------------------------
const TOTAL_SPEND = 30000;
const categoryMap = {
  dining: "dining",
  travel: "travel",
  groceries: "online_grocery",
  gas: "gas",
};

const benefitSignals = [
  { label: "Trip protection", accessor: (card) => card.benefits.travel_insurance.trip_cancellation },
  { label: "Trip delay cover", accessor: (card) => card.benefits.travel_insurance.trip_delay },
  { label: "Rental car insurance", accessor: (card) => card.benefits.travel_insurance.rental_car_insurance },
  { label: "Purchase protection", accessor: (card) => card.benefits.purchase_protection.purchase_protection },
  { label: "Extended warranty", accessor: (card) => card.benefits.purchase_protection.extended_warranty },
  { label: "Lounge access", accessor: (card) => card.benefits.lounge_access },
  { label: "Cell phone protection", accessor: (card) => card.benefits.cell_phone_protection },
];

function buildSpendProfile() {
  const dining = Number(state.diningSpend);
  const travel = 2000 + state.travelPreference * 20;
  const groceries = 6000;
  const gas = 2400;
  const preliminaryOther = TOTAL_SPEND - dining - travel - groceries - gas;
  const other = Math.max(preliminaryOther, 0);
  return { dining, travel, groceries, gas, other };
}

function getEarnRate(card, category) {
  if (card.card_id === "citi-double-cash") {
    return 0.02; // 2% cash back
  }
  const mapped = categoryMap[category];
  const bonus = card.rewards.bonus_categories.find((c) => c.category === mapped);
  const rate = bonus ? bonus.earn_rate : card.rewards.base_earn_rate;
  const pointValue = state.preferences.cashback
    ? card.rewards.point_value.cash_value
    : card.rewards.point_value.portal_booking_value;
  return rate * pointValue;
}

function calculateRewardBreakdown(card) {
  const spend = buildSpendProfile();
  const breakdown = [];
  let total = 0;

  for (const [category, amount] of Object.entries(spend)) {
    let valuePerDollar;
    if (card.rewards.reward_type === "cash_back") {
      valuePerDollar = card.rewards.base_earn_rate / 100;
    } else {
      valuePerDollar = getEarnRate(card, category);
    }
    const value = amount * valuePerDollar;
    breakdown.push({ category, amount, value });
    total += value;
  }

  const bonusValue = card.rewards.sign_up_bonus?.estimated_value_usd || 0;
  total += bonusValue;

  return { totalValue: total - card.fees.annual_fee, bonusValue, breakdown };
}

function computeScore(card) {
  const { totalValue, bonusValue, breakdown } = calculateRewardBreakdown(card);
  const rewardScore = clamp(totalValue / 1800, 0, 1);

  const coverage = benefitSignals.filter((signal) => signal.accessor(card)).length;
  const benefitScore = coverage / benefitSignals.length;

  let feeScore = 1 - card.fees.annual_fee / 600;
  if (card.fees.foreign_transaction_fee > 0 && state.preferences.international) {
    feeScore -= 0.2;
  }
  feeScore = clamp(feeScore, 0, 1);

  let flexScore = card.rewards.reward_type === "points" ? 0.8 : 0.6;
  if (state.preferences.cashback && card.rewards.reward_type === "cash_back") {
    flexScore = 0.9;
  }
  if (state.travelPreference > 60 && card.rewards.reward_type === "points") {
    flexScore += 0.05;
  }
  flexScore = clamp(flexScore, 0, 1);

  const approvalDelta = state.creditScore - card.requirements.min_credit_score;
  const approvalScore = clamp(0.35 + approvalDelta / 250, 0, 1);

  const simplicityDrag = state.simplicityPreference / 100;
  const categoryComplexity = card.rewards.bonus_categories?.length ? 0.25 : 0.05;
  const simplicityModifier = 1 - simplicityDrag * categoryComplexity;

  let composite =
    rewardScore * 0.35 +
    benefitScore * 0.2 +
    feeScore * 0.15 +
    flexScore * 0.15 +
    approvalScore * 0.15;
  composite *= simplicityModifier;

  if (state.preferences.balance && card.apr.intro_balance_transfer_apr) {
    composite += 0.08;
  }

  composite = clamp(composite, 0, 1);

  return {
    card,
    netValue: totalValue,
    bonusValue,
    breakdown,
    rewardScore,
    benefitScore,
    feeScore,
    flexScore,
    approvalScore,
    composite,
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// --- D3 radar chart ----------------------------------------------------------
const radarMetrics = [
  { key: "rewardScore", label: "Rewards" },
  { key: "benefitScore", label: "Benefits" },
  { key: "feeScore", label: "Fees" },
  { key: "flexScore", label: "Flexibility" },
  { key: "approvalScore", label: "Approval" },
];
const radarSize = 360;
const radarRadius = 130;
const svg = d3
  .select("#radarChart")
  .attr("width", radarSize)
  .attr("height", radarSize);
const radarGroup = svg.append("g").attr("transform", `translate(${radarSize / 2}, ${radarSize / 2})`);
const gridLevels = 4;
for (let level = 1; level <= gridLevels; level += 1) {
  const r = (radarRadius / gridLevels) * level;
  radarGroup
    .append("circle")
    .attr("class", "radar-grid")
    .attr("r", r)
    .attr("fill", "none")
    .attr("stroke", "rgba(255,255,255,0.08)")
    .attr("stroke-width", 1);
}
radarMetrics.forEach((metric, index) => {
  const angle = (Math.PI * 2 * index) / radarMetrics.length;
  const x = Math.sin(angle) * radarRadius;
  const y = -Math.cos(angle) * radarRadius;
  radarGroup
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", x)
    .attr("y2", y)
    .attr("stroke", "rgba(255,255,255,0.12)")
    .attr("stroke-width", 1);
  radarGroup
    .append("text")
    .attr("x", x * 1.1)
    .attr("y", y * 1.1)
    .attr("text-anchor", "middle")
    .attr("fill", "rgba(255,255,255,0.7)")
    .attr("font-size", "12px")
    .text(metric.label);
});

const radarLine = d3
  .lineRadial()
  .radius((d) => d.value * radarRadius)
  .angle((_, i) => (Math.PI * 2 * i) / radarMetrics.length)
  .curve(d3.curveCardinalClosed);

function updateRadar(data) {
  const dataset = data.map((item) => ({
    name: item.card.card_name,
    color: getColorForCard(item.card.card_id),
    values: radarMetrics.map((metric) => ({ key: metric.key, value: item[metric.key] })),
  }));

  const shapes = radarGroup.selectAll("path.radar-shape").data(dataset, (d) => d.name);

  shapes
    .join(
      (enter) =>
        enter
          .append("path")
          .attr("class", "radar-shape")
          .attr("fill", (d) => d.color)
          .attr("fill-opacity", 0.15)
          .attr("stroke", (d) => d.color)
          .attr("stroke-width", 2)
          .attr("d", (d) => radarLine(d.values.map((value) => ({ ...value }))))
          .attr("opacity", 0)
          .call((path) => path.transition().duration(600).attr("opacity", 1)),
      (update) => update.transition().duration(600).attr("d", (d) => radarLine(d.values)),
      (exit) => exit.transition().duration(300).attr("opacity", 0).remove()
    );

  elements.radarLegend.innerHTML = dataset
    .map(
      (d) =>
        `<div class="legend-item"><span class="legend-swatch" style="background:${d.color}"></span>${d.name}</div>`
    )
    .join("");
}

// --- Three.js hero card ------------------------------------------------------
const cardSceneEl = document.getElementById("cardScene");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, cardSceneEl.clientWidth / cardSceneEl.clientHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(cardSceneEl.clientWidth, cardSceneEl.clientHeight);
cardSceneEl.appendChild(renderer.domElement);

const cardGeometry = new THREE.PlaneGeometry(3.4, 2.2, 32, 32);
const cardMaterial = new THREE.MeshStandardMaterial({ color: 0x122045, roughness: 0.35, metalness: 0.6 });
const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
cardMesh.position.set(0, 0, 0);
scene.add(cardMesh);

const edge = new THREE.LineSegments(new THREE.EdgesGeometry(cardGeometry), new THREE.LineBasicMaterial({ color: 0xffffff }));
scene.add(edge);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const pointLight = new THREE.PointLight(0x7cf4ff, 1.5, 10);
pointLight.position.set(2.5, 3, 4);
scene.add(pointLight);
const magentaLight = new THREE.PointLight(0xff6ad5, 1.2, 10);
magentaLight.position.set(-2, -3, 4);
scene.add(magentaLight);

camera.position.z = 5;

let hoverOffset = { x: 0, y: 0 };
cardSceneEl.addEventListener("pointermove", (event) => {
  const bounds = cardSceneEl.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.4;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.4;
  hoverOffset = { x, y };
});

function animateCard() {
  requestAnimationFrame(animateCard);
  cardMesh.rotation.y += (hoverOffset.x - cardMesh.rotation.y) * 0.03;
  cardMesh.rotation.x += (-hoverOffset.y - cardMesh.rotation.x) * 0.03;
  renderer.render(scene, camera);
}
animateCard();

function updateCardMaterial(color) {
  gsap.to(cardMaterial.color, {
    r: ((color >> 16) & 255) / 255,
    g: ((color >> 8) & 255) / 255,
    b: (color & 255) / 255,
    duration: 0.6,
    ease: "power2.out",
  });
}

// --- DOM renderers -----------------------------------------------------------
function renderHighlights(best) {
  const metrics = [
    { label: "Net yearly value", value: formatCurrency(best.netValue) },
    { label: "Bonus value", value: best.bonusValue ? formatCurrency(best.bonusValue) : "No bonus" },
    { label: "Foreign fee", value: best.card.fees.foreign_transaction_fee ? `${best.card.fees.foreign_transaction_fee}%` : "$0" },
    { label: "APR", value: best.card.apr.purchase_apr },
  ];
  elements.scoreHighlights.innerHTML = metrics
    .map(
      (metric) =>
        `<div class="metric"><span>${metric.label}</span><strong>${metric.value}</strong></div>`
    )
    .join("");
}

function renderBuckets(best) {
  const total = best.breakdown.reduce((sum, item) => sum + item.value, 0);
  const sorted = [...best.breakdown]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const data = [
    ...sorted,
    { category: "Sign-up bonus", value: best.bonusValue, amount: best.bonusValue },
  ].filter((item) => item.value > 0);

  elements.bucketGrid.innerHTML = data
    .map((item, index) => {
      const percent = total ? Math.min((item.value / total) * 100, 100) : 0;
      return `
        <article class="bucket-card" style="border-color: ${index === 0 ? "var(--accent)" : "rgba(255,255,255,0.08)"}">
          <h4>${formatCategory(item.category)}</h4>
          <strong>${formatCurrency(item.value)}</strong>
          <p class="muted">${item.category === "Sign-up bonus" ? "One-time" : `${formatCurrency(item.amount)} spend`}</p>
          <div class="bucket-bar"><span style="width:${percent}%"></span></div>
        </article>
      `;
    })
    .join("");

  gsap.utils.toArray(".bucket-bar span").forEach((bar) => {
    const width = parseFloat(bar.style.width);
    gsap.fromTo(bar, { width: 0 }, { width: `${width}%`, duration: 0.8, ease: "power2.out" });
  });
}

function renderBenefitJourney(best) {
  elements.benefitJourney.innerHTML = benefitSignals
    .map((signal) => {
      const active = signal.accessor(best.card);
      return `<li data-state="${active ? "on" : "off"}">
        <div>
          <strong>${signal.label}</strong>
          <span>${active ? "Included" : "Not available"}</span>
        </div>
        <span>${active ? "✔" : "—"}</span>
      </li>`;
    })
    .join("");
}

function renderTable(cardScores) {
  elements.comparisonTable.innerHTML = cardScores
    .map((item) => {
      const rewardEstimate = formatCurrency(item.netValue);
      const bonus = item.card.rewards.sign_up_bonus
        ? `${item.card.rewards.sign_up_bonus.bonus_amount.toLocaleString()} pts`
        : "None";
      const approval = item.card.requirements.estimated_approval_odds.excellent_credit;
      const selected = state.selectedCards.has(item.card.card_id) ? "is-selected" : "";
      return `
        <tr class="${selected}">
          <td>${item.card.card_name}</td>
          <td>${formatCurrency(item.card.fees.annual_fee)}</td>
          <td>${rewardEstimate}</td>
          <td>${item.card.fees.foreign_transaction_fee ? item.card.fees.foreign_transaction_fee + "%" : "$0"}</td>
          <td>${bonus}</td>
          <td>${approval}</td>
        </tr>
      `;
    })
    .join("");
}

function formatCategory(category) {
  const map = {
    dining: "Dining",
    travel: "Travel",
    groceries: "Groceries",
    gas: "Gas",
    other: "Other",
  };
  return map[category] || category;
}

function formatCurrency(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

function updateHero(best, selectionCount) {
  const confidence = Math.round(best.composite * 100);
  elements.confidenceScore.textContent = `${confidence}%`;
  elements.bestCardName.textContent = best.card.card_name;
  const intlNote =
    state.preferences.international && best.card.fees.foreign_transaction_fee === 0
      ? "zero foreign fees"
      : "best net value";
  elements.bestCardTagline.textContent = `About ${formatCurrency(best.netValue)} yearly with ${intlNote}. (${selectionCount} cards in focus)`;
  renderHighlights(best);
}

function renderCardPicker() {
  elements.cardPicker.innerHTML = cards
    .map((card) => {
      const active = state.selectedCards.has(card.card_id) ? "active" : "";
      return `<button type="button" class="card-chip ${active}" data-card-id="${card.card_id}">${card.card_name}</button>`;
    })
    .join("");
}

function renderComparisonDeck(focus, best) {
  if (!focus.length) {
    elements.comparisonDeck.innerHTML = `<p class="muted">Select at least one card to build a comparison deck.</p>`;
    return;
  }
  elements.comparisonDeck.innerHTML = focus
    .map((item) => {
      const travelReady = item.card.fees.foreign_transaction_fee === 0 ? "Travel ready" : "Domestic";
      const benefits = benefitSignals.filter((signal) => signal.accessor(item.card)).length;
      return `
        <article class="comparison-card" data-active="${item.card.card_id === best.card.card_id}">
          <small>${item.card.issuer} · ${item.card.card_type.replace(/_/g, " ")}</small>
          <h4>${item.card.card_name}</h4>
          <p class="muted">Value: ${formatCurrency(item.netValue)} · Fees: ${formatCurrency(item.card.fees.annual_fee)}</p>
          <p class="muted">Benefits unlocked: ${benefits}/${benefitSignals.length} · ${travelReady}</p>
        </article>
      `;
    })
    .join("");
}

// --- main update loop --------------------------------------------------------
function updateDashboard() {
  const cardScores = cards.map((card) => computeScore(card));
  cardScores.sort((a, b) => b.composite - a.composite);
  const best = cardScores[0];

  const focusScores = cardScores.filter((item) => state.selectedCards.has(item.card.card_id));
  const focus = focusScores.length ? focusScores : cardScores.slice(0, 3);

  updateHero(best, focus.length);
  renderBuckets(best);
  renderBenefitJourney(best);
  renderTable(cardScores);
  renderCardPicker();
  renderComparisonDeck(focus, best);
  updateRadar(focus);
  const bestColor = getColorForCard(best.card.card_id);
  updateCardMaterial(parseInt(bestColor.replace("#", ""), 16));
  updateTheme(bestColor, best.card);
  elements.bestCardTagline.dataset.score = best.composite.toFixed(2);

  const runner = cardScores[1];
  const summaryText = `${best.card.card_name} outranks ${runner ? runner.card.card_name : "others"} by ${Math.round(
    (best.composite - (runner?.composite || 0)) * 100
  )} points.`;
  elements.bestCardTagline.setAttribute("data-summary", summaryText);
}

function updateTheme(color, bestCard) {
  setAccent(color);
  const mode = bestCard?.rewards.reward_type === "cash_back" ? "cash" : "travel";
  if (bodyEl.dataset.mode !== mode) {
    bodyEl.dataset.mode = mode;
    gsap.fromTo(
      document.body,
      { backgroundPosition: "0% 0%" },
      { backgroundPosition: "100% 100%", duration: 1.2, ease: "power2.out" }
    );
  }
}

function setAccent(color) {
  rootStyle.setProperty("--accent", color);
  rootStyle.setProperty("--accent-2", lightenColor(color, 0.35));
}

function lightenColor(hex, amount = 0.25) {
  const sanitized = hex.replace("#", "");
  const value = parseInt(sanitized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  const lighten = (channel) => Math.min(255, Math.round(channel + (255 - channel) * amount));
  const nr = lighten(r);
  const ng = lighten(g);
  const nb = lighten(b);
  return `#${((1 << 24) + (nr << 16) + (ng << 8) + nb).toString(16).slice(1)}`;
}

// --- Listeners ---------------------------------------------------------------
["creditScore", "travelPreference", "simplicityPreference", "diningSpend"].forEach((key) => {
  const input = elements[key];
  input.addEventListener("input", () => {
    const value = Number(input.value);
    state[key === "creditScore" ? "creditScore" : key] = value;
    const formatter = key.includes("Preference") ? `${value}%` : key === "creditScore" ? value : `$${value.toLocaleString()}`;
    elements[`${key}Value`].textContent = formatter;
    gsap.to(input, { boxShadow: "0 0 15px rgba(124,244,255,0.4)", duration: 0.2, yoyo: true, repeat: 1 });
    updateDashboard();
  });
});

elements.toggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const pref = toggle.dataset.pref;
    toggle.classList.toggle("active");
    state.preferences[pref] = toggle.classList.contains("active");
    gsap.fromTo(toggle, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "power2.out" });
    updateDashboard();
  });
});

elements.cardPicker.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-card-id]");
  if (!target) return;
  const cardId = target.dataset.cardId;
  const isActive = state.selectedCards.has(cardId);
  if (isActive) {
    if (state.selectedCards.size === 1) return;
    state.selectedCards.delete(cardId);
  } else {
    if (state.selectedCards.size >= 4) {
      const first = state.selectedCards.values().next().value;
      state.selectedCards.delete(first);
    }
    state.selectedCards.add(cardId);
  }
  updateDashboard();
});

// --- Initial render ---------------------------------------------------------
updateDashboard();
window.addEventListener("resize", () => {
  camera.aspect = cardSceneEl.clientWidth / cardSceneEl.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(cardSceneEl.clientWidth, cardSceneEl.clientHeight);
});

setupScrollStorytelling();

function setupScrollStorytelling() {
  if (!sceneSections.length || typeof ScrollTrigger === "undefined") return;
  activateStoryStep(sceneSections[0].dataset.scene);
  sceneSections.forEach((section) => {
    gsap.fromTo(
      section,
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 20%",
          onEnter: () => activateStoryStep(section.dataset.scene),
          onEnterBack: () => activateStoryStep(section.dataset.scene),
        },
      }
    );
  });
}

function activateStoryStep(sceneId) {
  storySteps.forEach((step) => {
    const isActive = step.dataset.scene === sceneId;
    step.classList.toggle("active", isActive);
  });
}
