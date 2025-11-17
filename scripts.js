const cardData = [
  {
    card_id: 'chase-sapphire-preferred',
    card_name: 'Chase Sapphire Preferred',
    issuer: 'Chase',
    network: 'Visa',
    card_type: 'travel_rewards',
    fees: {
      annual_fee: 95,
      foreign_transaction_fee: 0,
    },
    apr: {
      intro_balance_transfer_apr: null,
      intro_balance_transfer_duration_months: 0,
      intro_purchase_apr: null,
      intro_purchase_duration_months: 0,
    },
    rewards: {
      reward_type: 'points',
      points_currency: 'Chase Ultimate Rewards',
      base_earn_rate: 1,
      bonus_categories: [
        { category: 'travel', earn_rate: 5 },
        { category: 'dining', earn_rate: 3 },
        { category: 'online_grocery', earn_rate: 3 },
        { category: 'streaming', earn_rate: 3 },
      ],
      sign_up_bonus: {
        bonus_amount: 60000,
        estimated_value_usd: 750,
      },
      point_value: {
        transfer_partner_value: 0.0125,
        portal_booking_value: 0.0125,
      },
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
    },
    requirements: {
      min_credit_score: 690,
    },
  },
  {
    card_id: 'citi-double-cash',
    card_name: 'Citi Double Cash',
    issuer: 'Citi',
    network: 'Mastercard',
    card_type: 'cash_back',
    fees: {
      annual_fee: 0,
      foreign_transaction_fee: 3,
    },
    apr: {
      intro_balance_transfer_apr: '0%',
      intro_balance_transfer_duration_months: 18,
      intro_purchase_apr: null,
      intro_purchase_duration_months: 0,
    },
    rewards: {
      reward_type: 'cash_back',
      base_earn_rate: 2,
      bonus_categories: [],
      earning_structure: {
        on_purchase: 1,
        on_payment: 1,
        total: 2,
      },
      sign_up_bonus: null,
    },
    benefits: {
      travel_insurance: {},
    },
    requirements: {
      min_credit_score: 670,
    },
  },
];

const defaultProfile = {
  dining: 4800,
  groceries: 6000,
  travel: 3600,
  gas: 2400,
  other: 13200,
};

const form = document.getElementById('preferenceForm');
const totalSpendDisplay = document.getElementById('totalSpendDisplay');
const comparisonTableBody = document.querySelector('#comparisonTable tbody');
const sliderDisplays = Array.from(document.querySelectorAll('[data-field]')).reduce((acc, el) => {
  acc[el.dataset.field] = el;
  return acc;
}, {});

const categoryList = document.getElementById('categoryBreakdown');
const radialContainer = document.getElementById('radialViz');
const radialTooltip = document.getElementById('radialTooltip');
const radialLegend = document.getElementById('radialLegend');
let radialSvg;
let radialGroup;

const summaryEls = {
  name: document.getElementById('bestCardName'),
  issuer: document.getElementById('bestCardIssuer'),
  value: document.getElementById('bestCardValue'),
  fee: document.getElementById('bestCardFee'),
  reason: document.getElementById('bestCardReason'),
};

const spendCategories = ['dining', 'groceries', 'travel', 'gas', 'other'];
const displayNames = {
  dining: 'Dining',
  groceries: 'Groceries',
  travel: 'Travel',
  gas: 'Gas',
  other: 'Other',
  bonus: 'Bonus',
};

const cardColorMap = {
  'chase-sapphire-preferred': 0x38bdf8,
  'citi-double-cash': 0x22c55e,
};
const cardColorCss = Object.fromEntries(
  Object.entries(cardColorMap).map(([key, hex]) => [key, `#${hex.toString(16).padStart(6, '0')}`])
);

const radialKeys = [...spendCategories, 'bonus'];
let lastScoredCards = [];

const barColors = [0x38bdf8, 0x22d3ee, 0xc084fc, 0xf472b6, 0xfacc15];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
  return `${value}%`;
}

function getProfileFromInputs() {
  const profile = {};
  spendCategories.forEach((category) => {
    const input = form.elements[category];
    profile[category] = Number(input.value);
  });
  return profile;
}

function getPreferencesFromInputs() {
  return {
    prefersTravelBenefits: form.elements['prefersTravelBenefits'].checked,
    travelsInternationally: form.elements['travelsInternationally'].checked,
    prefersCashback: form.elements['prefersCashback'].checked,
    prefersNoAnnualFee: form.elements['prefersNoAnnualFee'].checked,
  };
}

function getEarnRate(card, categoryKey) {
  const base = card.rewards.base_earn_rate || card.rewards.earning_structure?.total || 1;
  const bonus = card.rewards.bonus_categories?.find((bonusCat) => {
    if (!bonusCat?.category) return false;
    if (categoryKey === 'groceries') {
      return bonusCat.category === 'online_grocery';
    }
    return bonusCat.category === categoryKey;
  });
  return bonus ? bonus.earn_rate : base;
}

function convertToValue(card, spend, earnRate) {
  if (card.rewards.reward_type === 'cash_back') {
    return spend * (earnRate / 100);
  }
  const pointValue =
    card.rewards.point_value?.portal_booking_value ||
    card.rewards.point_value?.transfer_partner_value ||
    card.rewards.point_value?.cash_value ||
    0.01;
  return spend * earnRate * pointValue;
}

function calculateCardMetrics(card, profile) {
  const breakdown = { ...profile };
  let totalRewards = 0;

  Object.entries(profile).forEach(([category, spend]) => {
    const earnRate = getEarnRate(card, category);
    const value = convertToValue(card, spend, earnRate);
    breakdown[category] = value;
    totalRewards += value;
  });

  const bonusValue = card.rewards.sign_up_bonus?.estimated_value_usd || 0;
  breakdown.bonus = bonusValue;
  totalRewards += bonusValue;

  const netValue = totalRewards - card.fees.annual_fee;

  return {
    card,
    totalRewards,
    netValue,
    bonusValue,
    breakdown,
  };
}

function getIntroAprText(card) {
  const { intro_balance_transfer_apr, intro_balance_transfer_duration_months, intro_purchase_apr, intro_purchase_duration_months } =
    card.apr;
  if (intro_purchase_apr) {
    return `${intro_purchase_apr} for ${intro_purchase_duration_months} mo`;
  }
  if (intro_balance_transfer_apr) {
    return `${intro_balance_transfer_apr} BT for ${intro_balance_transfer_duration_months} mo`;
  }
  return '—';
}

function hasTravelBenefits(card) {
  return Object.values(card.benefits?.travel_insurance || {}).some(Boolean);
}

function scoreCard(metrics, preferences, totalSpend) {
  let score = metrics.netValue;
  const reasonParts = [];
  const { card } = metrics;

  if (preferences.prefersTravelBenefits) {
    if (hasTravelBenefits(card)) {
      score += 120;
      reasonParts.push('Full travel protections');
    } else {
      score -= 120;
      reasonParts.push('Lacks travel protections');
    }
  }

  if (preferences.travelsInternationally) {
    if (card.fees.foreign_transaction_fee === 0) {
      score += 80;
      reasonParts.push('No foreign transaction fees');
    } else {
      const penalty = (card.fees.foreign_transaction_fee / 100) * totalSpend;
      score -= penalty;
      reasonParts.push('Pays foreign transaction fees');
    }
  }

  if (preferences.prefersCashback) {
    if (card.rewards.reward_type === 'cash_back') {
      score += 60;
      reasonParts.push('Straightforward cash back');
    } else {
      score -= 60;
      reasonParts.push('Requires point transfers');
    }
  }

  if (preferences.prefersNoAnnualFee) {
    if (card.fees.annual_fee === 0) {
      score += 50;
      reasonParts.push('No annual fee');
    } else {
      score -= card.fees.annual_fee * 0.6;
      reasonParts.push('Pays an annual fee');
    }
  }

  if (metrics.bonusValue > 0) {
    reasonParts.push(`Bonus worth ${formatCurrency(metrics.bonusValue)}`);
  }

  return { ...metrics, score, reason: reasonParts.filter(Boolean).join(' • ') || 'Optimized reward math for your spend' };
}

function renderComparisonTable(scoredCards) {
  comparisonTableBody.innerHTML = '';
  scoredCards.forEach((metrics) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${metrics.card.card_name}</strong><br /><span>${metrics.card.issuer} · ${metrics.card.network}</span></td>
      <td>${formatCurrency(metrics.card.fees.annual_fee)}</td>
      <td>${metrics.card.fees.foreign_transaction_fee === 0 ? '0%' : formatPercent(metrics.card.fees.foreign_transaction_fee)}</td>
      <td>${getIntroAprText(metrics.card)}</td>
      <td>${formatCurrency(metrics.totalRewards)}</td>
      <td>${metrics.card.requirements.min_credit_score}</td>
    `;
    comparisonTableBody.appendChild(row);
  });
}

function updateSummary(scoredCard) {
  summaryEls.name.textContent = scoredCard.card.card_name;
  summaryEls.issuer.textContent = `${scoredCard.card.issuer} • ${scoredCard.card.network}`;
  summaryEls.value.textContent = `${formatCurrency(scoredCard.netValue)} net`;
  summaryEls.fee.textContent = formatCurrency(scoredCard.card.fees.annual_fee);
  summaryEls.reason.textContent = scoredCard.reason;
}

function updateCategoryList(metrics) {
  categoryList.innerHTML = '';
  [...spendCategories, 'bonus'].forEach((key) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${displayNames[key]}</span>
      <strong>${formatCurrency(Math.round(metrics.breakdown[key] || 0))}</strong>
    `;
    categoryList.appendChild(li);
  });
}

function ensureRadialCanvas() {
  if (radialSvg || !radialContainer) return;
  radialSvg = d3.select(radialContainer).append('svg');
  radialGroup = radialSvg.append('g').attr('class', 'radial-group');
}

function polarPoint(index, value, radiusScale, angleSlice) {
  const angle = index * angleSlice - Math.PI / 2;
  const radius = radiusScale(value);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function updateRadial(scoredCards) {
  if (!radialContainer || !d3) return;
  if (!Array.isArray(scoredCards) || scoredCards.length === 0) return;
  ensureRadialCanvas();
  if (!radialSvg) return;

  const bounds = radialContainer.getBoundingClientRect();
  const width = bounds.width || 320;
  const height = bounds.height || 320;
  const radius = Math.min(width, height) / 2 - 24;
  const centerX = width / 2;
  const centerY = height / 2;
  radialSvg.attr('viewBox', `0 0 ${width} ${height}`);
  radialGroup.attr('transform', `translate(${centerX}, ${centerY})`);

  const maxValue =
    d3.max(scoredCards, (metrics) => d3.max(radialKeys, (key) => metrics.breakdown[key] || 0)) || 1;
  const angleSlice = (Math.PI * 2) / radialKeys.length;
  const radiusScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

  const levels = 4;
  radialGroup
    .selectAll('.radial-grid')
    .data(d3.range(1, levels + 1))
    .join((enter) =>
      enter
        .append('circle')
        .attr('class', 'radial-grid')
        .attr('fill', 'none')
        .attr('stroke', 'rgba(148,163,184,0.25)')
        .attr('stroke-dasharray', '3 8')
    )
    .attr('r', (d) => (radius / levels) * d);

  radialGroup
    .selectAll('.radial-axis')
    .data(radialKeys)
    .join((enter) =>
      enter
        .append('line')
        .attr('class', 'radial-axis')
        .attr('stroke', 'rgba(148,163,184,0.25)')
    )
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', (_, index) => polarPoint(index, maxValue, radiusScale, angleSlice).x)
    .attr('y2', (_, index) => polarPoint(index, maxValue, radiusScale, angleSlice).y);

  radialGroup
    .selectAll('.radial-label')
    .data(radialKeys)
    .join((enter) =>
      enter
        .append('text')
        .attr('class', 'radial-label')
        .attr('text-anchor', 'middle')
        .attr('fill', 'var(--muted)')
        .style('font-size', '0.75rem')
        .style('letter-spacing', '0.04em')
    )
    .attr('x', (_, index) => polarPoint(index, maxValue * 1.05, radiusScale, angleSlice).x)
    .attr('y', (_, index) => polarPoint(index, maxValue * 1.05, radiusScale, angleSlice).y)
    .text((key) => displayNames[key]);

  const dataset = scoredCards.map((metrics) => {
    const nodes = radialKeys.map((key, index) => {
      const value = metrics.breakdown[key] || 0;
      const coords = polarPoint(index, value, radiusScale, angleSlice);
      return { key, value, ...coords };
    });
    return {
      id: metrics.card.card_id,
      label: metrics.card.card_name,
      color: cardColorCss[metrics.card.card_id] || '#ffffff',
      netValue: metrics.netValue,
      nodes,
    };
  });

  const pathGenerator = d3
    .line()
    .curve(d3.curveCatmullRomClosed.alpha(0.6))
    .x((d) => d.x)
    .y((d) => d.y);

  radialGroup
    .selectAll('.radial-path')
    .data(dataset, (d) => d.id)
    .join((enter) =>
      enter
        .append('path')
        .attr('class', 'radial-path')
        .attr('fill-opacity', 0.18)
        .attr('stroke-width', 1.5)
        .style('mix-blend-mode', 'screen')
        .on('pointerenter pointermove', (event, d) => handleRadialHover(event, d))
        .on('pointerleave', () => hideRadialTooltip())
    )
    .attr('fill', (d) => d.color)
    .attr('stroke', (d) => d.color)
    .attr('d', (d) => pathGenerator(d.nodes));

  if (radialLegend) {
    radialLegend.innerHTML = dataset
      .map((entry) => `<span style="--swatch:${entry.color}">${entry.label}</span>`)
      .join('');
  }
}

function handleRadialHover(event, entry) {
  if (!radialTooltip) return;
  const bounds = radialContainer.getBoundingClientRect();
  radialTooltip.hidden = false;
  radialTooltip.style.left = `${event.clientX - bounds.left + 12}px`;
  radialTooltip.style.top = `${event.clientY - bounds.top + 12}px`;
  const sortedNodes = [...entry.nodes].sort((a, b) => b.value - a.value);
  const top = sortedNodes[0];
  radialTooltip.innerHTML = `
    <strong>${entry.label}</strong><br />
    Net ${formatCurrency(entry.netValue)}<br />
    Biggest boost: ${displayNames[top.key]} (${formatCurrency(top.value)})
  `;
}

function hideRadialTooltip() {
  if (radialTooltip) {
    radialTooltip.hidden = true;
  }
}

// --- Three.js scene setup ---
const sceneContainer = document.getElementById('cardScene');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020617, 0.18);
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
sceneContainer.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const keyLight = new THREE.PointLight(0xffffff, 0.9);
keyLight.position.set(4, 4, 6);
scene.add(keyLight);
const rimLight = new THREE.PointLight(0x7dd3fc, 0.7);
rimLight.position.set(-4, -2, -3);
scene.add(rimLight);

const cardGeometry = new THREE.PlaneGeometry(2.6, 1.6, 32, 32);
const cardMaterial = new THREE.MeshStandardMaterial({
  color: cardColorMap['chase-sapphire-preferred'],
  metalness: 0.4,
  roughness: 0.25,
  side: THREE.DoubleSide,
});
const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
cardMesh.position.y = 0.3;
scene.add(cardMesh);

const baseGeometry = new THREE.CylinderGeometry(1.4, 1.6, 0.15, 64);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, metalness: 0.1 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -1.1;
scene.add(base);

const barGroup = new THREE.Group();
scene.add(barGroup);
const barMeshes = spendCategories.map((key, index) => {
  const geometry = new THREE.BoxGeometry(0.28, 1, 0.28);
  const material = new THREE.MeshStandardMaterial({
    color: barColors[index % barColors.length],
    emissive: barColors[index % barColors.length],
    emissiveIntensity: 0.2,
    metalness: 0.2,
    roughness: 0.4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = (index - (spendCategories.length - 1) / 2) * 0.4;
  mesh.position.y = -1;
  barGroup.add(mesh);
  return { key, mesh };
});

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 360;
const particlePositions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.2 + Math.random() * 2.2;
  const height = -0.8 + Math.random() * 1.6;
  particlePositions[i * 3] = Math.cos(angle) * radius;
  particlePositions[i * 3 + 1] = height;
  particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.02,
  transparent: true,
  opacity: 0.55,
  depthWrite: false,
});
const particleField = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleField);

let autoRotation = 0;
let targetTiltX = 0;
let targetTiltZ = 0;
let activeCardId = null;

function resizeRenderer() {
  const width = sceneContainer.clientWidth;
  const height = sceneContainer.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

resizeRenderer();

function handleResize() {
  resizeRenderer();
  updateRadial(lastScoredCards);
}

window.addEventListener('resize', handleResize);

sceneContainer.addEventListener('pointermove', (event) => {
  const rect = sceneContainer.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  targetTiltX = -y * 0.5;
  targetTiltZ = x * 0.5;
});

sceneContainer.addEventListener('pointerleave', () => {
  targetTiltX = 0;
  targetTiltZ = 0;
});

function animate() {
  requestAnimationFrame(animate);
  autoRotation += 0.01;
  cardMesh.rotation.y = autoRotation;
  cardMesh.rotation.x += (targetTiltX - cardMesh.rotation.x) * 0.05;
  cardMesh.rotation.z += (targetTiltZ - cardMesh.rotation.z) * 0.05;
  barGroup.children.forEach((bar) => {
    bar.rotation.y = autoRotation * 0.8;
  });
  particleField.rotation.y += 0.0015;
  particleField.rotation.x += 0.0006;
  renderer.render(scene, camera);
}

animate();

function updateValueBars(metrics) {
  const values = spendCategories.map((key) => metrics.breakdown[key] || 0);
  const maxValue = Math.max(...values, 1);
  values.forEach((value, index) => {
    const mesh = barMeshes[index].mesh;
    const normalized = Math.max((value / maxValue) * 1.6, 0.12);
    if (typeof gsap !== 'undefined') {
      gsap.to(mesh.scale, { y: normalized, duration: 0.9, ease: 'expo.out' });
      gsap.to(mesh.position, { y: -1 + normalized / 2, duration: 0.9, ease: 'expo.out' });
    } else {
      mesh.scale.y = normalized;
      mesh.position.y = -1 + normalized / 2;
    }
  });
}

function updateCardScene(metrics) {
  const color = cardColorMap[metrics.card.card_id] || 0xffffff;
  const targetColor = new THREE.Color(color);
  if (typeof gsap !== 'undefined') {
    gsap.to(cardMesh.material.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      ease: 'expo.out',
    });
  } else {
    cardMesh.material.color.set(targetColor);
  }
  if (activeCardId !== metrics.card.card_id) {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(
        cardMesh.position,
        { y: 0.15 },
        { y: 0.35, duration: 0.6, ease: 'expo.out', yoyo: true, repeat: 1 }
      );
    }
    activeCardId = metrics.card.card_id;
  }
  updateValueBars(metrics);
}

function updateDashboard() {
  const profile = getProfileFromInputs();
  const preferences = getPreferencesFromInputs();
  const totalSpend = Object.values(profile).reduce((sum, value) => sum + value, 0);
  totalSpendDisplay.textContent = formatCurrency(totalSpend);

  Object.entries(profile).forEach(([key, value]) => {
    if (sliderDisplays[key]) {
      sliderDisplays[key].textContent = Number(value).toLocaleString();
    }
  });

  const metrics = cardData.map((card) => calculateCardMetrics(card, profile));
  const scored = metrics
    .map((metric) => scoreCard(metric, preferences, totalSpend))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  updateSummary(best);
  updateCardScene(best);
  updateCategoryList(best);
  renderComparisonTable(scored);
  lastScoredCards = scored;
  updateRadial(scored);
}

form.addEventListener('input', updateDashboard);

Object.entries(defaultProfile).forEach(([key, value]) => {
  if (form.elements[key]) {
    form.elements[key].value = value;
    sliderDisplays[key].textContent = Number(value).toLocaleString();
  }
});

updateDashboard();
