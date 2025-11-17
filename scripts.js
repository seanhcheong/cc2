const creditCards = [
  {
    card_id: "chase-sapphire-preferred",
    card_name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    card_type: "travel_rewards",
    fees: {
      annual_fee: 95,
      foreign_transaction_fee: 0,
      balance_transfer_fee: "5% or $5 minimum",
      cash_advance_fee: "5% or $10 minimum",
      late_payment_fee: "up to $40"
    },
    apr: {
      purchase_apr: "21.49% - 28.49% variable",
      balance_transfer_apr: "21.49% - 28.49% variable",
      cash_advance_apr: "29.99% variable"
    },
    rewards: {
      reward_type: "points",
      points_currency: "Chase Ultimate Rewards",
      base_earn_rate: 1,
      bonus_categories: [
        { category: "travel", earn_rate: 5 },
        { category: "dining", earn_rate: 3 },
        { category: "online_grocery", earn_rate: 3 },
        { category: "streaming", earn_rate: 3 }
      ],
      sign_up_bonus: {
        bonus_amount: 60000,
        spend_requirement: 4000,
        time_period_months: 3,
        estimated_value_usd: 750
      },
      point_value: {
        portal_booking_value: 0.0125,
        cash_value: 0.01
      },
      transfer_partners: ["United", "Southwest", "Hyatt", "Marriott", "IHG"]
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: true,
        trip_interruption: true,
        trip_delay: true,
        baggage_delay: true,
        lost_luggage: true,
        emergency_medical: true,
        rental_car_insurance: true
      },
      purchase_protection: {
        purchase_protection: true,
        extended_warranty: true
      },
      lounge_access: false,
      tsa_precheck_credit: false,
      global_entry_credit: false,
      hotel_status: false,
      airline_status: false,
      concierge: false,
      cell_phone_protection: false
    },
    requirements: {
      min_credit_score: 690,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
        fair_credit: "low"
      }
    }
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
      balance_transfer_fee: "3% or $5 minimum",
      cash_advance_fee: "5% or $10 minimum",
      late_payment_fee: "up to $41"
    },
    apr: {
      purchase_apr: "19.24% - 29.24% variable",
      balance_transfer_apr: "19.24% - 29.24% variable",
      cash_advance_apr: "29.99% variable"
    },
    rewards: {
      reward_type: "cash_back",
      base_earn_rate: 2,
      earning_structure: { on_purchase: 1, on_payment: 1, total: 2 },
      redemption_options: ["statement_credit", "direct_deposit", "check"],
      minimum_redemption: 25
    },
    benefits: {
      travel_insurance: {
        trip_cancellation: false,
        trip_interruption: false,
        trip_delay: false,
        baggage_delay: false,
        lost_luggage: false,
        emergency_medical: false,
        rental_car_insurance: false
      },
      purchase_protection: {
        purchase_protection: false,
        extended_warranty: false
      },
      lounge_access: false,
      cell_phone_protection: false
    },
    requirements: {
      min_credit_score: 670,
      estimated_approval_odds: {
        excellent_credit: "high",
        good_credit: "moderate",
        fair_credit: "low"
      }
    }
  }
];

const state = {
  creditScore: 720,
  travelPreference: 80,
  spend: {
    dining: 4800,
    groceries: 6000,
    travel: 3600,
    gas: 2400,
    other: 13200
  }
};

const dom = {};
let galaxyScene;
let rewardsScene;
let journeyScene;
let podiumScene;
let gui;

function init() {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  dom.themeIndicator = document.getElementById("themeIndicator");
  dom.matchChips = document.getElementById("matchChips");
  dom.summary = document.getElementById("personalizationSummary");
  dom.bucketStats = document.getElementById("bucketStats");
  dom.benefitList = document.getElementById("benefitList");
  dom.podiumTooltip = document.getElementById("podiumTooltip");

  setupGUI();
  galaxyScene = initGalaxyScene();
  rewardsScene = initRewardsScene();
  journeyScene = initJourneyScene();
  podiumScene = initPodiumScene();
  setupScrollStory();
  setupAudio();
  window.addEventListener("resize", handleResize);
  updateModel();
}

document.addEventListener("DOMContentLoaded", init);

function setupGUI() {
  const container = document.getElementById("guiContainer");
  gui = new dat.GUI({ autoPlace: false, width: 300 });
  container.appendChild(gui.domElement);

  gui.add(state, "creditScore", 500, 850, 5).name("Credit score").onChange(updateModel);
  gui.add(state, "travelPreference", 0, 100, 5).name("Travel preference").onChange(updateModel);

  const spendFolder = gui.addFolder("Annual spend");
  Object.keys(state.spend).forEach((key) => {
    spendFolder
      .add(state.spend, key, 0, 20000, 100)
      .name(key.charAt(0).toUpperCase() + key.slice(1))
      .onChange(updateModel);
  });
  spendFolder.open();
}

function setupAudio() {
  const ding = document.getElementById("rewardDing");
  const whoosh = document.getElementById("whoosh");
  document.addEventListener("click", () => {
    if (ding.dataset.ready) return;
    ding.dataset.ready = "true";
    ding.play().catch(() => {});
    ding.pause();
    ding.currentTime = 0;
    whoosh.play().catch(() => {});
    whoosh.pause();
    whoosh.currentTime = 0;
  }, { once: true });
}

function formatCurrency(value) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function computeSpendTotal(spend) {
  return Object.values(spend).reduce((sum, val) => sum + Number(val), 0);
}

function evaluateRewards(card, spend) {
  const total = computeSpendTotal(spend);
  const catValues = [];
  if (card.rewards.reward_type === "cash_back") {
    const rate = (card.rewards.base_earn_rate || card.rewards.earning_structure?.total || 1) / 100;
    const value = total * rate;
    catValues.push({ name: "All spend", value });
    return { totalValue: value, breakdown: catValues, bonus: 0 };
  }

  const pointValue = card.rewards.point_value?.portal_booking_value || card.rewards.point_value?.cash_value || 0.01;
  const categoryRates = {};
  card.rewards.bonus_categories?.forEach((bonus) => {
    categoryRates[bonus.category] = bonus.earn_rate;
  });
  let totalPoints = 0;
  Object.entries(spend).forEach(([category, amount]) => {
    const normalized = category === "groceries" ? "online_grocery" : category;
    const rate = categoryRates[normalized] || card.rewards.base_earn_rate || 1;
    const points = amount * rate;
    totalPoints += points;
    catValues.push({ name: category, value: points * pointValue });
  });
  const bonus = card.rewards.sign_up_bonus?.estimated_value_usd || 0;
  return { totalValue: totalPoints * pointValue, breakdown: catValues, bonus };
}

function scoreCard(card, spend, prefs) {
  const rewardInfo = evaluateRewards(card, spend);
  const netValue = rewardInfo.totalValue + rewardInfo.bonus - card.fees.annual_fee;
  const travelWeight = prefs.travelPreference / 100;
  const benefitStrength = card.card_type === "travel_rewards" ? 1 : 0.5;
  const scoreMultiplier = 0.5 + travelWeight * benefitStrength;
  const creditGap = Math.max(0, card.requirements.min_credit_score - prefs.creditScore);
  const creditPenalty = creditGap > 0 ? Math.max(0.4, 1 - creditGap / 300) : 1;
  const score = netValue * scoreMultiplier * creditPenalty;
  return {
    card,
    rewardInfo,
    netValue,
    score,
    matchQuality: Math.min(1, scoreMultiplier * creditPenalty),
    ratio: netValue / Math.max(1, card.fees.annual_fee || 1)
  };
}

function updateModel() {
  const metrics = creditCards.map((card) => scoreCard(card, state.spend, state));
  metrics.sort((a, b) => b.score - a.score);
  const best = metrics[0];
  updateTheme(best);
  updateChips(metrics);
  updateSummary(best);
  galaxyScene?.highlight(best.card.card_id);
  rewardsScene?.update(best);
  journeyScene?.update(best);
  podiumScene?.update(metrics);
}

function updateTheme(bestMetric) {
  const prefersTravelMode = state.travelPreference >= 50 && bestMetric.card.card_type === "travel_rewards";
  document.body.classList.toggle("cashback-mode", !prefersTravelMode);
  dom.themeIndicator.textContent = prefersTravelMode ? "Travel mode" : "Cash-back mode";
}

function updateChips(metrics) {
  dom.matchChips.innerHTML = "";
  metrics.forEach((metric, index) => {
    const chip = document.createElement("div");
    chip.className = "card-chip";
    chip.dataset.state = index === 0 ? "highlight" : "base";
    chip.innerHTML = `<span>${metric.card.card_name}</span><span>${formatCurrency(metric.netValue)}</span>`;
    dom.matchChips.appendChild(chip);
    gsap.fromTo(
      chip,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, delay: index * 0.05, duration: 0.4, ease: "power2.out" }
    );
  });
}

function updateSummary(bestMetric) {
  dom.summary.innerHTML = `
    <h3>${bestMetric.card.card_name}</h3>
    <p><strong>${formatCurrency(bestMetric.netValue)}</strong> first-year net value</p>
    <p>Annual fee: ${bestMetric.card.fees.annual_fee ? formatCurrency(bestMetric.card.fees.annual_fee) : "$0"}</p>
    <p>Approval odds: ${bestMetric.card.requirements.estimated_approval_odds.good_credit}</p>
  `;
}

function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

function createCardTexture(card) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  const colors = card.card_type === "travel_rewards" ? ["#1f6feb", "#7cf4ff"] : ["#ff5f6d", "#ffc371"];
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 36px Space Grotesk";
  ctx.fillText(card.card_name, 30, 80);
  ctx.font = "24px Space Grotesk";
  ctx.fillText(card.issuer, 30, 130);
  ctx.font = "20px Space Grotesk";
  ctx.fillText(`${card.network} · ${card.card_type.replace("_", " ")}`, 30, 170);
  ctx.fillText(`Annual fee ${card.fees.annual_fee ? formatCurrency(card.fees.annual_fee) : "$0"}`, 30, 210);
  return new THREE.CanvasTexture(canvas);
}

function initGalaxyScene() {
  const container = document.getElementById("galaxyCanvas");
  const renderer = createRenderer(container);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 2.5, 10);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const point = new THREE.PointLight(0xffffff, 1.2);
  point.position.set(5, 5, 5);
  scene.add(point);

  const cardGroup = new THREE.Group();
  const typeRadius = {
    travel_rewards: 6,
    cash_back: 4,
    default: 5
  };
  const textures = {};
  creditCards.forEach((card, idx) => {
    const texture = (textures[card.card_id] = createCardTexture(card));
    const material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
    const geometry = new THREE.PlaneGeometry(2.4, 1.5);
    const mesh = new THREE.Mesh(geometry, material);
    const radius = typeRadius[card.card_type] || typeRadius.default;
    mesh.userData = { card, radius, speed: 0.15 + idx * 0.03 };
    mesh.position.set(Math.cos(idx) * radius, 0.3 * idx, Math.sin(idx) * radius);
    mesh.lookAt(0, 0, 0);
    cardGroup.add(mesh);
  });
  scene.add(cardGroup);

  const starsGeometry = new THREE.BufferGeometry();
  const starCount = 400;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 40;
  }
  starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  const tooltip = document.getElementById("cardTooltip");
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerEvent;

  function handlePointerMove(event) {
    pointerEvent = event;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  renderer.domElement.addEventListener("pointermove", handlePointerMove);
  renderer.domElement.addEventListener("mouseleave", () => {
    tooltip.hidden = true;
  });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#scene1",
      start: "top center",
      end: "+=500",
      scrub: true
    }
  });
  timeline.fromTo(
    camera.position,
    { z: 25 },
    { z: 8, duration: 1, ease: "power2.out" }
  );

  function animate() {
    requestAnimationFrame(animate);
    cardGroup.children.forEach((mesh, index) => {
      const time = performance.now() * 0.0002;
      const { radius, speed } = mesh.userData;
      const angle = time * speed + index;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.position.y = Math.sin(angle * 1.5) * 1.5;
      mesh.lookAt(0, 0, 0);
    });

    if (pointerEvent) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(cardGroup.children);
      if (intersects.length) {
        const mesh = intersects[0].object;
        gsap.to(mesh.scale, { x: 1.1, y: 1.1, duration: 0.2, overwrite: true });
        const { card } = mesh.userData;
        tooltip.innerHTML = `<h3>${card.card_name}</h3><p>${card.card_type.replace(/_/g, " ")}</p>`;
        tooltip.style.left = `${pointerEvent.clientX + 10}px`;
        tooltip.style.top = `${pointerEvent.clientY - 20}px`;
        tooltip.hidden = false;
      } else {
        tooltip.hidden = true;
      }
    }

    renderer.render(scene, camera);
  }
  animate();

  return {
    highlight(id) {
      cardGroup.children.forEach((mesh) => {
        mesh.material.opacity = mesh.userData.card.card_id === id ? 1 : 0.3;
      });
    },
    resize() {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
  };
}

function initRewardsScene() {
  const container = document.getElementById("rewardsCanvas");
  const renderer = createRenderer(container);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x020409, 2, 18);
  const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
  camera.position.set(0, 3, 9);

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 5, 4);
  scene.add(dir);

  const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2), new THREE.MeshStandardMaterial({ color: 0xffffff }));
  cardMesh.position.set(0, 1.8, 0);
  scene.add(cardMesh);

  const pieGroup = new THREE.Group();
  scene.add(pieGroup);

  function rebuildPie(values) {
    pieGroup.clear();
    const sum = values.reduce((total, item) => total + item.value, 0) || 1;
    let startAngle = 0;
    values.forEach((item, idx) => {
      const angle = (item.value / sum) * Math.PI * 2;
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.absarc(0, 0, 2, startAngle, startAngle + angle, false);
      const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.5, bevelEnabled: false });
      const material = new THREE.MeshStandardMaterial({
        color: [0x7cf4ff, 0xff6ad5, 0xffd166, 0x9b5de5][idx % 4],
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = -0.5;
      pieGroup.add(mesh);
      startAngle += angle;
    });
  }

  const coins = [];
  for (let i = 0; i < 50; i++) {
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16),
      new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xffd166, emissiveIntensity: 0.6 })
    );
    coin.position.set((Math.random() - 0.5) * 2, 4 + Math.random() * 3, (Math.random() - 0.5) * 1.5);
    scene.add(coin);
    coins.push(coin);
  }

  function animateCoins() {
    coins.forEach((coin, idx) => {
      gsap.to(coin.position, {
        y: -1.5,
        duration: 2 + Math.random(),
        repeat: -1,
        delay: idx * 0.05,
        ease: "power1.in",
        modifiers: {
          y: (y) => {
            if (y <= -1.5) {
              coin.position.x = (Math.random() - 0.5) * 2;
              coin.position.z = (Math.random() - 0.5) * 1.5;
              return 4 + Math.random() * 3;
            }
            return y;
          }
        }
      });
    });
  }
  animateCoins();

  const bucketDom = document.getElementById("bucketStats");

  function updateBuckets(best) {
    bucketDom.innerHTML = "";
    const values = [...best.rewardInfo.breakdown, { name: "Sign-up bonus", value: best.rewardInfo.bonus }];
    values.forEach((entry) => {
      const card = document.createElement("div");
      card.className = "bucket-card";
      card.innerHTML = `<h4>${entry.name}</h4><p>${formatCurrency(entry.value)}</p>`;
      bucketDom.appendChild(card);
    });
  }

  function animateCard(texture) {
    cardMesh.material.map = texture;
    cardMesh.material.needsUpdate = true;
    gsap.fromTo(cardMesh.position, { z: -2, opacity: 0 }, { z: 0, duration: 1, ease: "power3.out" });
  }

  function animatePie(values) {
    rebuildPie(values);
    pieGroup.children.forEach((segment, idx) => {
      gsap.fromTo(segment.scale, { y: 0 }, { y: 1, delay: idx * 0.05, duration: 0.6, ease: "back.out(1.4)" });
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    pieGroup.rotation.y += 0.003;
    renderer.render(scene, camera);
  }
  animate();

  ScrollTrigger.create({
    trigger: "#scene3",
    start: "top center",
    end: "+=400",
    onEnter: () => document.getElementById("rewardDing").play().catch(() => {})
  });

  return {
    update(best) {
      animateCard(createCardTexture(best.card));
      updateBuckets(best);
      animatePie(best.rewardInfo.breakdown);
    },
    resize() {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
  };
}

function buildBenefits(card) {
  return {
    "Trip protections": card.benefits.travel_insurance?.trip_cancellation,
    "Luggage support": card.benefits.travel_insurance?.baggage_delay,
    "Emergency medical": card.benefits.travel_insurance?.emergency_medical,
    "Rental car": card.benefits.travel_insurance?.rental_car_insurance,
    "Purchase protection": card.benefits.purchase_protection?.purchase_protection,
    "Extended warranty": card.benefits.purchase_protection?.extended_warranty,
    "Lounge access": card.benefits.lounge_access,
    "Cell phone": card.benefits.cell_phone_protection
  };
}

function initJourneyScene() {
  const container = document.getElementById("journeyCanvas");
  const renderer = createRenderer(container);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(-6, 4, 8);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enableRotate = false;
  controls.enablePan = false;

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const hemi = new THREE.HemisphereLight(0x7cf4ff, 0x040404, 0.6);
  scene.add(hemi);

  const pathPoints = [
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(-2, 1, -2),
    new THREE.Vector3(1, 1.5, 1),
    new THREE.Vector3(4, 0.5, -1),
    new THREE.Vector3(6, 1, 2)
  ];
  const curve = new THREE.CatmullRomCurve3(pathPoints);
  const geometry = new THREE.TubeGeometry(curve, 64, 0.15, 8, false);
  const material = new THREE.MeshStandardMaterial({ color: 0x7cf4ff, transparent: true, opacity: 0.4 });
  const tube = new THREE.Mesh(geometry, material);
  scene.add(tube);

  const checkpoints = [];
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const position = curve.getPointAt(t);
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7cf4ff })
    );
    sphere.position.copy(position);
    scene.add(sphere);
    checkpoints.push(sphere);
  }

  const traveler = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xff6ad5 })
  );
  scene.add(traveler);

  ScrollTrigger.create({
    trigger: "#scene4",
    start: "top center",
    end: "bottom center",
    scrub: true,
    onUpdate: (self) => {
      const point = curve.getPointAt(self.progress);
      traveler.position.copy(point);
      camera.lookAt(traveler.position);
    },
    onEnter: () => document.getElementById("whoosh").play().catch(() => {})
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return {
    update(best) {
      const benefits = buildBenefits(best.card);
      dom.benefitList.innerHTML = "";
      Object.entries(benefits).forEach(([name, active], idx) => {
        const li = document.createElement("li");
        li.textContent = name;
        li.dataset.active = active ? "true" : "false";
        dom.benefitList.appendChild(li);
        if (!active && checkpoints[idx]) {
          checkpoints[idx].material.opacity = 0.15;
        } else if (checkpoints[idx]) {
          checkpoints[idx].material.opacity = 1;
        }
      });
    },
    resize() {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
  };
}

function initPodiumScene() {
  const container = document.getElementById("podiumCanvas");
  const renderer = createRenderer(container);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 4, 9);

  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);
  const spot = new THREE.SpotLight(0xffffff, 1.2, 20, Math.PI / 6, 0.25);
  spot.position.set(0, 7, 5);
  scene.add(spot);

  const podiumGroup = new THREE.Group();
  scene.add(podiumGroup);

  const tooltip = dom.podiumTooltip;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let pointerEvent;

  renderer.domElement.addEventListener("pointermove", (event) => {
    pointerEvent = event;
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  renderer.domElement.addEventListener("mouseleave", () => {
    tooltip.hidden = true;
  });

  function buildColumns(metrics) {
    podiumGroup.clear();
    const maxRatio = Math.max(...metrics.map((m) => m.ratio));
    metrics.forEach((metric, idx) => {
      const height = (metric.ratio / maxRatio) * 4;
      const geometry = new THREE.BoxGeometry(1, height, 1);
      const material = new THREE.MeshStandardMaterial({ color: idx === 0 ? 0x7cf4ff : 0xff6ad5, emissive: 0x111111 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((idx - (metrics.length - 1) / 2) * 1.5, height / 2 - 1.5, 0);
      mesh.userData = metric;
      podiumGroup.add(mesh);
      gsap.fromTo(mesh.scale, { y: 0 }, { y: 1, delay: idx * 0.15, duration: 0.6, ease: "power2.out" });
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    podiumGroup.rotation.y += 0.002;
    if (pointerEvent) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(podiumGroup.children);
      if (intersects.length) {
        const { card } = intersects[0].object.userData;
        tooltip.hidden = false;
        tooltip.innerHTML = `<strong>${card.card_name}</strong><p>${card.apr.purchase_apr}</p><p>Bonus: ${card.rewards.sign_up_bonus?.bonus_amount ? card.rewards.sign_up_bonus.bonus_amount.toLocaleString() + " pts" : "None"}</p>`;
        tooltip.style.left = `${pointerEvent.clientX + 12}px`;
        tooltip.style.top = `${pointerEvent.clientY - 20}px`;
      } else {
        tooltip.hidden = true;
      }
    }
    renderer.render(scene, camera);
  }
  animate();

  ScrollTrigger.create({
    trigger: "#scene5",
    start: "top center",
    onEnter: () => document.getElementById("rewardDing").play().catch(() => {})
  });

  return {
    update(metrics) {
      buildColumns(metrics);
    },
    resize() {
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
  };
}

function setupScrollStory() {
  gsap.utils.toArray(".scene-block").forEach((block, index) => {
    gsap.from(block, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: block,
        start: "top 80%"
      }
    });
  });
}

function handleResize() {
  galaxyScene?.resize();
  rewardsScene?.resize();
  journeyScene?.resize();
  podiumScene?.resize();
}
