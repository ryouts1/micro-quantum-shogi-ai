import { getReactionGeometry, computeBounds } from './chemistry/reactionPath.js';
import {
  getReactionPreset,
  listReactionPresets,
  listBuiltInReactionPresets,
  listCustomReactionPresets,
  importReactionLibraryFromFile,
  resetCustomReactionPresets
} from './chemistry/reactionPresets.js';
import { Scene3D } from './render/scene3d.js';
import { drawEnergyDiagram } from './render/energyDiagram.js';
import { CloudSampler } from './render/cloudSampler.js';
import { legendGradientForView, legendLabelsForView } from './render/colorMap.js';
import { areCloudsCompatible, blendClouds, cloneCloud, createCloudBuffer } from './render/cloudTransition.js';

const viewer = document.getElementById('viewer');
const appTitle = document.getElementById('app-title');
const appLead = document.getElementById('app-lead');
const reactionSelect = document.getElementById('reaction-select');
const reactionMeta = document.getElementById('reaction-meta');
const reactionJsonFileInput = document.getElementById('reaction-json-file');
const loadReactionJsonButton = document.getElementById('load-reaction-json');
const resetReactionLibraryButton = document.getElementById('reset-reaction-library');
const reactionJsonStatus = document.getElementById('reaction-json-status');
const progressRange = document.getElementById('progress-range');
const progressLabel = document.getElementById('progress-label');
const viewModeSelect = document.getElementById('view-mode');
const gridResolutionSelect = document.getElementById('grid-resolution');
const pointCountSelect = document.getElementById('point-count');
const pointSizeRange = document.getElementById('point-size');
const pointSizeLabel = document.getElementById('point-size-label');
const shimmerSelect = document.getElementById('shimmer-rate');
const playbackSpeedSelect = document.getElementById('playback-speed');
const loopPlaybackCheckbox = document.getElementById('loop-playback');
const playToggle = document.getElementById('play-toggle');
const resetViewButton = document.getElementById('reset-view');
const presetReactantsButton = document.getElementById('preset-reactants');
const presetTsButton = document.getElementById('preset-ts');
const presetProductsButton = document.getElementById('preset-products');
const autoRotateCheckbox = document.getElementById('auto-rotate');
const exportFrameButton = document.getElementById('export-frame');
const statusBox = document.getElementById('status-box');
const statusSubline = document.getElementById('status-subline');
const qualityHint = document.getElementById('quality-hint');
const metricCards = document.getElementById('metric-cards');
const frontierSummary = document.getElementById('frontier-summary');
const bondSummary = document.getElementById('bond-summary');
const chargeTableBody = document.querySelector('#charge-table tbody');
const energyDiagram = document.getElementById('energy-diagram');
const legendBar = document.getElementById('legend-bar');
const legendLeft = document.getElementById('legend-left');
const legendCenter = document.getElementById('legend-center');
const legendRight = document.getElementById('legend-right');
const viewerLegend = document.getElementById('viewer-legend');
const stageChip = document.getElementById('stage-chip');
const stageTitle = document.getElementById('stage-title');
const stageDetail = document.getElementById('stage-detail');

const EMPTY_CLOUD = {
  positions: new Float32Array(0),
  colors: new Float32Array(0),
  alphas: new Float32Array(0),
  sizes: new Float32Array(0),
  count: 0
};

const scene = new Scene3D(viewer);
const worker = new Worker(new URL('./worker/densityWorker.js', import.meta.url), { type: 'module' });

const state = {
  reactionId: 'oh-cl',
  progress: 0,
  view: 'reactive-donor',
  resolution: 32,
  pointCount: 3600,
  pointSize: 4.4,
  shimmerHz: 10,
  playing: false,
  autoRotate: true,
  basisScale: 1,
  couplingScale: 1.75,
  playbackRate: 0.095,
  loopPlayback: false,
  cloudPhase: 0,
  cloudTransitionMs: 160
};

const playbackRateLabels = {
  '0.06': 'Slow',
  '0.095': 'Normal',
  '0.15': 'Fast'
};

let lastRequestedId = 0;
let latestPayload = null;
let sampler = null;
let computeTimer = null;
let resampleSeed = 1;
let animationPreviousTimestamp = null;
let lastPlaybackComputeTimestamp = -Infinity;
let lastShimmerTimestamp = -Infinity;
let workerBusy = false;
let pendingWorkerRefresh = false;
let lastStructureProgress = Number.NaN;
let displayedCloud = null;
let cloudTransition = null;

function currentPreset() {
  return getReactionPreset(state.reactionId);
}

function formatNumber(value, digits = 3) {
  return Number(value).toFixed(digits);
}

function formatSigned(value, digits = 3) {
  const number = Number(value);
  return `${number >= 0 ? '+' : ''}${number.toFixed(digits)}`;
}

function setStatus(text, subline = '') {
  statusBox.textContent = text;
  statusSubline.textContent = subline;
}

function syncProgressLabel() {
  progressLabel.textContent = formatNumber(state.progress, 2);
}

function syncPointSizeLabel() {
  pointSizeLabel.textContent = formatNumber(state.pointSize, 1);
}

function currentIntegralLabel(view) {
  if (view === 'reactive-donor' || view === 'reactive-acceptor') {
    return '∫|ψ_reactive|² dV';
  }
  if (view === 'reactive-flow') {
    return '∫Δρ_reactive dV';
  }
  return '∫ρ_reactive dV';
}

function renderReactionHeader(preset = currentPreset()) {
  appTitle.textContent = preset.title;
  appLead.textContent = preset.description;
  const sourceLabel = preset.source === 'custom' ? 'custom JSON' : 'built-in';
  reactionMeta.textContent = `Preset family: ${preset.familyLabel} · source: ${sourceLabel} · substrate: ${preset.substrateLabel} · product side: ${preset.productLabel}`;
}

function renderReactionLibraryStatus(message = '') {
  const builtInCount = listBuiltInReactionPresets().length;
  const customCount = listCustomReactionPresets().length;
  reactionJsonStatus.textContent = message || `${builtInCount} built-in reactions loaded${customCount ? ` · ${customCount} custom JSON reactions merged` : ''}.`;
}

function optionMarkup(presets) {
  return presets
    .map((preset) => `<option value="${preset.id}">${preset.title}</option>`)
    .join('');
}

function populateReactionSelect(selectedId = state.reactionId) {
  const customs = listCustomReactionPresets();
  const customIds = new Set(customs.map((preset) => preset.id));
  const builtIns = listBuiltInReactionPresets().filter((preset) => !customIds.has(preset.id));
  const html = [
    builtIns.length ? `<optgroup label="Built-in">${optionMarkup(builtIns)}</optgroup>` : '',
    customs.length ? `<optgroup label="Imported JSON">${optionMarkup(customs)}</optgroup>` : ''
  ].filter(Boolean).join('');

  reactionSelect.innerHTML = html || optionMarkup(listReactionPresets());
  const selectedPreset = getReactionPreset(selectedId);
  state.reactionId = selectedPreset.id;
  reactionSelect.value = selectedPreset.id;
}

function stageDefinition(progress, preset = currentPreset()) {
  if (progress < 0.16) {
    return {
      chip: 'Reactant basin',
      title: `Separated ${preset.nucleophile.display} and ${preset.substrateLabel}`,
      detail: `${preset.nucleophile.display} is still outside the carbon center while the C–${preset.leavingGroup.symbol} bond remains fully developed.`
    };
  }
  if (progress < 0.42) {
    return {
      chip: 'Backside approach',
      title: `Nucleophile lines up with the σ* axis of C–${preset.leavingGroup.symbol}`,
      detail: `The approaching ${preset.nucleophile.symbol} center contracts its distance to carbon from the backside direction required for SN2 inversion.`
    };
  }
  if (progress < 0.60) {
    return {
      chip: 'Transition-state region',
      title: `Forming ${preset.nucleophile.symbol}–C and breaking C–${preset.leavingGroup.symbol} coexist`,
      detail: 'The central carbon is closest to the characteristic pentacoordinate SN2 picture, with bond formation and cleavage in balance.'
    };
  }
  if (progress < 0.84) {
    return {
      chip: 'Product formation',
      title: `${preset.productLabel} emerges as the leaving group separates`,
      detail: `The ${preset.nucleophile.symbol}–C interaction strengthens while ${preset.leavingGroup.display} continues to detach from the alkyl fragment.`
    };
  }
  return {
    chip: 'Product basin',
    title: `Separated ${preset.nucleophile.productFragment ?? preset.productLabel}`,
    detail: `${preset.productLabel} are now separated on the product side of the reaction coordinate.`
  };
}

function stageDetailFromPayload(progress, payload = latestPayload) {
  const preset = payload?.reaction ? getReactionPreset(payload.reaction.id) : currentPreset();
  const stage = stageDefinition(progress, preset);
  if (!payload) {
    return stage;
  }

  const { metrics, summary, labels } = payload;
  if (progress < 0.16) {
    stage.detail = `${labels.nucleophileSymbol}···C = ${formatNumber(metrics.nucleophileCarbonDistance, 2)} Å, C···${labels.leavingGroupSymbol} = ${formatNumber(metrics.carbonLeavingGroupDistance, 2)} Å. The leaving group still dominates the carbon-side overlap.`;
    return stage;
  }
  if (progress < 0.42) {
    stage.detail = `${labels.nucleophileSymbol}···C contracts to ${formatNumber(metrics.nucleophileCarbonDistance, 2)} Å while ${labels.nucleophileCarbonBond} overlap population climbs to ${formatNumber(summary.overlapPopulations.nucleophileCarbon, 3)}.`;
    return stage;
  }
  if (progress < 0.60) {
    stage.detail = `Near the TS window, ${labels.nucleophileCarbonBond} overlap is ${formatNumber(summary.overlapPopulations.nucleophileCarbon, 3)} and ${labels.carbonLeavingGroupBond} overlap is ${formatNumber(summary.overlapPopulations.carbonLeavingGroup, 3)}.`;
    return stage;
  }
  if (progress < 0.84) {
    stage.detail = `Carbon inversion is underway. ${labels.nucleophileCarbonBond} overlap is now ${formatNumber(summary.overlapPopulations.nucleophileCarbon, 3)}, while ${labels.carbonLeavingGroupBond} has fallen to ${formatNumber(summary.overlapPopulations.carbonLeavingGroup, 3)}.`;
    return stage;
  }
  stage.detail = `Final ${labels.nucleophileSymbol}···C = ${formatNumber(metrics.nucleophileCarbonDistance, 2)} Å and C···${labels.leavingGroupSymbol} = ${formatNumber(metrics.carbonLeavingGroupDistance, 2)} Å. ${labels.leavingGroupDisplay} is well separated from the substituted alkyl fragment.`;
  return stage;
}

function renderStageBanner(progress, payload = latestPayload) {
  const stage = stageDetailFromPayload(progress, payload);
  stageChip.textContent = stage.chip;
  stageTitle.textContent = stage.title;
  stageDetail.textContent = stage.detail;
}

function setLegend(view, payload = latestPayload) {
  legendBar.style.background = legendGradientForView(view);
  const labels = legendLabelsForView(view);
  legendLeft.textContent = labels.left;
  legendCenter.textContent = labels.center;
  legendRight.textContent = labels.right;

  const reactionLabels = payload?.labels ?? {
    nucleophileSymbol: currentPreset().nucleophile.symbol,
    leavingGroupSymbol: currentPreset().leavingGroup.symbol,
    carbonLeavingGroupBond: `C–${currentPreset().leavingGroup.symbol}`
  };

  const pills = {
    'reactive-donor': [
      `${reactionLabels.nucleophileSymbol}-side donor cloud only`,
      'spectator X–H / C–H channels removed',
      'color = signed ψ_donor'
    ],
    'reactive-acceptor': [
      `${reactionLabels.carbonLeavingGroupBond} σ* acceptor only`,
      'backside SN2 acceptor emphasized',
      'color = signed ψ_acceptor'
    ],
    'reactive-flow': [
      'sampled from |Δρ_reactive(r)|',
      'cyan = gain in reactive channel',
      'magenta = loss from reactive channel'
    ],
    'reactive-channel': [
      `${reactionLabels.nucleophileSymbol} / C / ${reactionLabels.leavingGroupSymbol} reaction-axis channel only`,
      'hydrogen spectator density removed',
      'sequential gradient for magnitude'
    ]
  };

  viewerLegend.innerHTML = (pills[view] ?? [])
    .map((label) => `<span class="legend-pill">${label}</span>`)
    .join('');
}

function opacityBoostForView(view) {
  if (view === 'reactive-flow') {
    return 0.94;
  }
  if (view === 'reactive-channel') {
    return 1.08;
  }
  return 1.0;
}

function renderMetricCards(payload) {
  const netCharge = Object.values(payload.summary.charges)
    .reduce((sum, charge) => sum + charge, 0);
  const reactive = payload.summary.reactiveOrbitals;

  const cards = [
    [`${payload.labels.nucleophileSymbol}···C distance`, `${formatNumber(payload.metrics.nucleophileCarbonDistance, 2)} Å`],
    [`C···${payload.labels.leavingGroupSymbol} distance`, `${formatNumber(payload.metrics.carbonLeavingGroupDistance, 2)} Å`],
    [currentIntegralLabel(payload.view), formatNumber(payload.stats.integral, 3)],
    ['Reactive-channel electrons', formatNumber(reactive.channelElectronCount, 3)],
    ['Donor→acceptor gap', `${formatNumber(reactive.donorAcceptorGap, 2)} eV`],
    ['Net charge', formatSigned(netCharge, 3)]
  ];

  metricCards.innerHTML = cards
    .map(([label, value]) => `
      <article class="metric-card">
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </article>
    `)
    .join('');
}

function renderKeyValueList(container, rows) {
  container.innerHTML = rows
    .map(([label, value]) => `<span>${label}</span><strong>${value}</strong>`)
    .join('');
}

function renderChargeTable(charges, atoms) {
  const atomLabelMap = Object.fromEntries(atoms.map((atom) => [atom.id, atom.displayLabel ?? atom.id]));
  chargeTableBody.innerHTML = Object.entries(charges)
    .map(([atomId, charge]) => `
      <tr>
        <td>${atomLabelMap[atomId] ?? atomId}</td>
        <td>${formatSigned(charge, 3)}</td>
      </tr>
    `)
    .join('');
}

function renderQualityHint(payload) {
  qualityHint.textContent = `Color scale: ${payload.stats.colorScaleSource} = ${formatNumber(payload.stats.colorScale, 3)} · field solve + sampling ${formatNumber(payload.stats.computeMs, 0)} ms`;
}

function updateStatusFromPayload(payload) {
  setStatus(
    `${payload.reaction.shortTitle} · ${payload.resolution}³ grid · ${state.pointCount.toLocaleString()} particles · ${currentIntegralLabel(payload.view)} = ${formatNumber(payload.stats.integral, 3)}`,
    `Playback ${playbackRateLabels[String(state.playbackRate)] ?? formatNumber(state.playbackRate, 3)} · shimmer ${state.shimmerHz === 0 ? 'static' : `${state.shimmerHz} Hz`} · cloud morph ${state.cloudTransitionMs} ms`
  );
}

function clearCloud() {
  displayedCloud = null;
  cloudTransition = null;
  sampler = null;
  scene.updateCloud(EMPTY_CLOUD);
}

function queueCloud(cloud, durationMs = state.cloudTransitionMs) {
  if (!cloud) {
    return;
  }

  if (!displayedCloud || !areCloudsCompatible(displayedCloud, cloud) || durationMs <= 0) {
    displayedCloud = cloneCloud(cloud);
    cloudTransition = null;
    scene.updateCloud(displayedCloud);
    return;
  }

  cloudTransition = {
    from: cloneCloud(displayedCloud),
    to: cloneCloud(cloud),
    buffer: cloudTransition?.buffer && areCloudsCompatible(cloudTransition.buffer, cloud)
      ? cloudTransition.buffer
      : createCloudBuffer(cloud.count),
    startedAt: performance.now(),
    durationMs
  };
  displayedCloud = cloneCloud(cloud);
}

function updateCloudTransition(timestamp) {
  if (!cloudTransition) {
    return;
  }

  const progress = Math.min((timestamp - cloudTransition.startedAt) / cloudTransition.durationMs, 1);
  const eased = progress * progress * (3 - (2 * progress));
  const blended = blendClouds(cloudTransition.from, cloudTransition.to, eased, cloudTransition.buffer);
  scene.updateCloud(blended);

  if (progress >= 1) {
    scene.updateCloud(cloudTransition.to);
    cloudTransition = null;
  }
}

function resampleCloud(force = false, durationMs = state.cloudTransitionMs) {
  if (!sampler) {
    return;
  }

  const cloud = sampler.sample({
    count: state.pointCount,
    pointSize: state.pointSize,
    jitter: 1,
    seed: resampleSeed += 1,
    phaseOffset: state.cloudPhase
  });

  queueCloud(cloud, force ? 0 : durationMs);

  if (force && latestPayload) {
    updateStatusFromPayload(latestPayload);
  }
}

function applyPayload(payload) {
  latestPayload = {
    ...payload,
    weightField: payload.weightField instanceof Float32Array
      ? payload.weightField
      : new Float32Array(payload.weightField),
    colorMetricField: payload.colorMetricField instanceof Float32Array
      ? payload.colorMetricField
      : new Float32Array(payload.colorMetricField)
  };

  sampler = CloudSampler.fromPayload(latestPayload);
  scene.updateStructure(latestPayload);
  scene.setCloudOpacityBoost(opacityBoostForView(latestPayload.view));
  lastStructureProgress = latestPayload.progress;
  resampleCloud(!displayedCloud, displayedCloud ? 180 : 0);
  renderMetricCards(latestPayload);
  renderKeyValueList(frontierSummary, [
    ['Reaction preset', latestPayload.reaction.shortTitle],
    ['Reactive donor index', String(latestPayload.summary.reactiveOrbitals.donorIndex)],
    ['Reactive donor energy', `${formatNumber(latestPayload.summary.reactiveOrbitals.donorEnergy, 3)} eV`],
    ['Donor channel norm', formatNumber(latestPayload.summary.reactiveOrbitals.donorNorm, 3)],
    ['Reactive acceptor index', String(latestPayload.summary.reactiveOrbitals.acceptorIndex)],
    ['Reactive acceptor energy', `${formatNumber(latestPayload.summary.reactiveOrbitals.acceptorEnergy, 3)} eV`],
    ['Acceptor channel norm', formatNumber(latestPayload.summary.reactiveOrbitals.acceptorNorm, 3)],
    ['Basis / valence e⁻', `${latestPayload.summary.basisFunctionCount} / ${latestPayload.summary.valenceElectronCount}`]
  ]);

  const bondRows = [
    [
      `${latestPayload.labels.nucleophileCarbonBond} overlap population`,
      formatNumber(latestPayload.summary.overlapPopulations.nucleophileCarbon, 4)
    ],
    [
      `${latestPayload.labels.carbonLeavingGroupBond} overlap population`,
      formatNumber(latestPayload.summary.overlapPopulations.carbonLeavingGroup, 4)
    ]
  ];
  if (latestPayload.labels.nucleophileHydrogenBond && latestPayload.summary.overlapPopulations.nucleophileHydrogenAverage !== null) {
    bondRows.push([
      `${latestPayload.labels.nucleophileHydrogenBond} average overlap`,
      formatNumber(latestPayload.summary.overlapPopulations.nucleophileHydrogenAverage, 4)
    ]);
  }
  renderKeyValueList(bondSummary, bondRows);
  renderChargeTable(latestPayload.summary.charges, latestPayload.atoms);
  drawEnergyDiagram(
    energyDiagram,
    latestPayload.summary.orbitalEnergies,
    {
      homoIndex: latestPayload.summary.homoIndex,
      lumoIndex: latestPayload.summary.lumoIndex,
      donorIndex: latestPayload.summary.reactiveOrbitals.donorIndex,
      acceptorIndex: latestPayload.summary.reactiveOrbitals.acceptorIndex
    }
  );
  renderStageBanner(latestPayload.progress, latestPayload);
  renderQualityHint(latestPayload);
  setLegend(latestPayload.view, latestPayload);
  updateStatusFromPayload(latestPayload);
}

function requestFieldComputation(force = false) {
  if (workerBusy && !force) {
    pendingWorkerRefresh = true;
    return;
  }

  lastRequestedId += 1;
  workerBusy = true;
  pendingWorkerRefresh = false;
  setStatus('Recomputing reactive probability cloud…', 'Atom geometry stays interactive while the electronic field catches up.');
  worker.postMessage({
    requestId: lastRequestedId,
    reactionId: state.reactionId,
    reactionDefinition: currentPreset(),
    progress: state.progress,
    resolution: state.resolution,
    view: state.view,
    basisScale: state.basisScale,
    couplingScale: state.couplingScale
  });
}

function scheduleComputation(delay = 70) {
  if (computeTimer !== null) {
    clearTimeout(computeTimer);
  }
  computeTimer = window.setTimeout(() => {
    computeTimer = null;
    requestFieldComputation();
  }, delay);
}

function setProgress(nextProgress, { triggerCompute = false, updateGeometry = true } = {}) {
  state.progress = Math.min(Math.max(nextProgress, 0), 1);
  progressRange.value = String(Math.round(state.progress * 100));
  syncProgressLabel();
  if (updateGeometry) {
    updateStructurePreview(true);
  }
  if (triggerCompute) {
    scheduleComputation(90);
  }
}

function updateStructurePreview(force = false) {
  if (!force && Math.abs(state.progress - lastStructureProgress) < 0.002) {
    return;
  }

  const geometry = getReactionGeometry(state.progress, currentPreset());
  scene.updateStructure({
    atoms: geometry.atoms,
    bonds: geometry.bonds,
    bounds: computeBounds(geometry.atoms, 2.4)
  });
  renderStageBanner(state.progress, latestPayload && latestPayload.reactionId === state.reactionId && Math.abs(latestPayload.progress - state.progress) < 0.06 ? latestPayload : null);
  lastStructureProgress = state.progress;
}

worker.addEventListener('message', (event) => {
  const payload = event.data;
  workerBusy = false;

  if (payload.requestId !== lastRequestedId) {
    if (pendingWorkerRefresh) {
      requestFieldComputation();
    }
    return;
  }

  if (payload.error) {
    setStatus(`Error: ${payload.error}`, 'Check the browser console for details.');
    if (pendingWorkerRefresh) {
      requestFieldComputation();
    }
    return;
  }

  applyPayload(payload);
  if (pendingWorkerRefresh) {
    requestFieldComputation();
  }
});

loadReactionJsonButton.addEventListener('click', async () => {
  const file = reactionJsonFileInput.files?.[0];
  if (!file) {
    renderReactionLibraryStatus('Choose a JSON file before pressing Load JSON.');
    return;
  }

  try {
    const importedLibrary = await importReactionLibraryFromFile(file, { replace: false, source: 'custom', name: file.name });
    const firstImported = importedLibrary.reactions[0];
    populateReactionSelect(firstImported?.id ?? state.reactionId);
    latestPayload = null;
    clearCloud();
    renderReactionHeader();
    renderStageBanner(0, null);
    setLegend(state.view, null);
    renderReactionLibraryStatus(`Loaded ${importedLibrary.reactions.length} custom reaction(s) from ${file.name}.`);
    setProgress(0, { triggerCompute: true, updateGeometry: true });
  } catch (error) {
    renderReactionLibraryStatus(`JSON import failed: ${error instanceof Error ? error.message : String(error)}`);
  }
});

resetReactionLibraryButton.addEventListener('click', () => {
  resetCustomReactionPresets();
  populateReactionSelect('oh-cl');
  if (state.playing) {
    state.playing = false;
    playToggle.textContent = 'Play';
  }
  latestPayload = null;
  clearCloud();
  renderReactionHeader();
  renderStageBanner(0, null);
  setLegend(state.view, null);
  renderReactionLibraryStatus('Removed imported JSON reactions. Built-in library only.');
  setProgress(0, { triggerCompute: true, updateGeometry: true });
});

reactionSelect.addEventListener('change', () => {
  if (state.playing) {
    state.playing = false;
    playToggle.textContent = 'Play';
  }
  state.reactionId = reactionSelect.value;
  latestPayload = null;
  clearCloud();
  renderReactionHeader();
  renderStageBanner(0, null);
  setLegend(state.view, null);
  setProgress(0, { triggerCompute: true, updateGeometry: true });
});

progressRange.addEventListener('input', () => {
  if (state.playing) {
    state.playing = false;
    playToggle.textContent = 'Play';
  }
  setProgress(Number(progressRange.value) / 100, { triggerCompute: true, updateGeometry: true });
});

viewModeSelect.addEventListener('change', () => {
  state.view = viewModeSelect.value;
  setLegend(state.view, latestPayload);
  scene.setCloudOpacityBoost(opacityBoostForView(state.view));
  scheduleComputation(60);
});

gridResolutionSelect.addEventListener('change', () => {
  state.resolution = Number(gridResolutionSelect.value);
  scheduleComputation(60);
});

pointCountSelect.addEventListener('change', () => {
  state.pointCount = Number(pointCountSelect.value);
  resampleCloud(true, 0);
});

pointSizeRange.addEventListener('input', () => {
  state.pointSize = Number(pointSizeRange.value);
  syncPointSizeLabel();
  resampleCloud(false, 120);
});

shimmerSelect.addEventListener('change', () => {
  state.shimmerHz = Number(shimmerSelect.value);
  lastShimmerTimestamp = -Infinity;
});

playbackSpeedSelect.addEventListener('change', () => {
  state.playbackRate = Number(playbackSpeedSelect.value);
  if (latestPayload) {
    updateStatusFromPayload(latestPayload);
  }
});

loopPlaybackCheckbox.addEventListener('change', () => {
  state.loopPlayback = loopPlaybackCheckbox.checked;
});

playToggle.addEventListener('click', () => {
  state.playing = !state.playing;
  playToggle.textContent = state.playing ? 'Pause' : 'Play';
  lastPlaybackComputeTimestamp = -Infinity;
});

resetViewButton.addEventListener('click', () => scene.resetCamera());
presetReactantsButton.addEventListener('click', () => setProgress(0, { triggerCompute: true, updateGeometry: true }));
presetTsButton.addEventListener('click', () => setProgress(0.5, { triggerCompute: true, updateGeometry: true }));
presetProductsButton.addEventListener('click', () => setProgress(1, { triggerCompute: true, updateGeometry: true }));

autoRotateCheckbox.addEventListener('change', () => {
  state.autoRotate = autoRotateCheckbox.checked;
  scene.setAutoRotate(state.autoRotate);
});

exportFrameButton.addEventListener('click', () => scene.downloadFrame(`sn2-${state.reactionId}-${state.view}-${Math.round(state.progress * 100)}.png`));

function animationLoop(timestamp) {
  if (animationPreviousTimestamp === null) {
    animationPreviousTimestamp = timestamp;
  }
  const deltaSeconds = (timestamp - animationPreviousTimestamp) / 1000;
  animationPreviousTimestamp = timestamp;

  if (state.playing) {
    const nextProgress = state.progress + (deltaSeconds * state.playbackRate);
    if (nextProgress >= 1) {
      if (state.loopPlayback) {
        setProgress(0, { triggerCompute: true, updateGeometry: true });
      } else {
        setProgress(1, { triggerCompute: true, updateGeometry: true });
        state.playing = false;
        playToggle.textContent = 'Play';
      }
    } else {
      setProgress(nextProgress, { updateGeometry: true });
      if ((timestamp - lastPlaybackComputeTimestamp) > 115) {
        requestFieldComputation();
        lastPlaybackComputeTimestamp = timestamp;
      }
    }
  }

  if (sampler && state.shimmerHz > 0 && (timestamp - lastShimmerTimestamp) >= (1000 / state.shimmerHz)) {
    state.cloudPhase = (state.cloudPhase + 0.071) % 1;
    resampleCloud(false, 110);
    lastShimmerTimestamp = timestamp;
  }

  updateCloudTransition(timestamp);
  requestAnimationFrame(animationLoop);
}

pointCountSelect.value = String(state.pointCount);
pointSizeRange.value = String(state.pointSize);
autoRotateCheckbox.checked = state.autoRotate;
loopPlaybackCheckbox.checked = state.loopPlayback;

populateReactionSelect();
renderReactionHeader();
renderReactionLibraryStatus();
syncProgressLabel();
syncPointSizeLabel();
renderStageBanner(state.progress, null);
scene.setAutoRotate(state.autoRotate);
scene.setCloudOpacityBoost(opacityBoostForView(state.view));
setLegend(state.view, null);
updateStructurePreview(true);
requestFieldComputation();
requestAnimationFrame(animationLoop);
