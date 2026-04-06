const CATALOG_URL = new URL('../data/reactions/catalog.json', import.meta.url);

function isNodeRuntime() {
  return typeof process !== 'undefined' && Boolean(process.versions?.node);
}

async function readJson(url) {
  if (isNodeRuntime()) {
    const { readFile } = await import('node:fs/promises');
    const content = await readFile(url, 'utf8');
    return JSON.parse(content);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load JSON: ${url}`);
  }
  return response.json();
}

function assertNonEmptyString(value, label, sourceLabel) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${sourceLabel}: ${label} must be a non-empty string`);
  }
}

function assertFiniteNumber(value, label, sourceLabel) {
  if (!Number.isFinite(value)) {
    throw new Error(`${sourceLabel}: ${label} must be a finite number`);
  }
}

function assertObject(value, label, sourceLabel) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${sourceLabel}: ${label} must be an object`);
  }
}

function validateDistanceProfile(profile, label, sourceLabel) {
  assertObject(profile, label, sourceLabel);
  assertFiniteNumber(profile.reactant, `${label}.reactant`, sourceLabel);
  assertFiniteNumber(profile.transition, `${label}.transition`, sourceLabel);
  assertFiniteNumber(profile.product, `${label}.product`, sourceLabel);
}

function validatePreset(preset, sourceLabel) {
  assertObject(preset, 'preset', sourceLabel);
  assertNonEmptyString(preset.id, 'id', sourceLabel);
  assertNonEmptyString(preset.name, 'name', sourceLabel);
  assertNonEmptyString(preset.equationHtml, 'equationHtml', sourceLabel);
  assertNonEmptyString(preset.equationText, 'equationText', sourceLabel);
  assertNonEmptyString(preset.lead, 'lead', sourceLabel);
  assertNonEmptyString(preset.reactantsLabel, 'reactantsLabel', sourceLabel);
  assertNonEmptyString(preset.productsLabel, 'productsLabel', sourceLabel);
  assertFiniteNumber(preset.totalCharge, 'totalCharge', sourceLabel);

  assertObject(preset.donor, 'donor', sourceLabel);
  assertNonEmptyString(preset.donor.element, 'donor.element', sourceLabel);
  assertNonEmptyString(preset.donor.symbol, 'donor.symbol', sourceLabel);
  assertNonEmptyString(preset.donor.name, 'donor.name', sourceLabel);
  assertNonEmptyString(preset.donor.template, 'donor.template', sourceLabel);
  assertNonEmptyString(preset.donor.attachedBondLabel ?? preset.donor.supportBondLabel ?? 'context', 'donor bond label', sourceLabel);

  assertObject(preset.substrate, 'substrate', sourceLabel);
  assertNonEmptyString(preset.substrate.template, 'substrate.template', sourceLabel);
  assertNonEmptyString(preset.substrate.name, 'substrate.name', sourceLabel);
  assertNonEmptyString(preset.substrate.leavingElement, 'substrate.leavingElement', sourceLabel);
  assertNonEmptyString(preset.substrate.leavingSymbol, 'substrate.leavingSymbol', sourceLabel);
  assertNonEmptyString(preset.substrate.leavingName, 'substrate.leavingName', sourceLabel);

  assertObject(preset.distances, 'distances', sourceLabel);
  validateDistanceProfile(preset.distances.donorCarbon, 'distances.donorCarbon', sourceLabel);
  validateDistanceProfile(preset.distances.carbonLeaving, 'distances.carbonLeaving', sourceLabel);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  Object.values(value).forEach((child) => deepFreeze(child));
  return value;
}

async function loadReactionCatalog() {
  const catalog = await readJson(CATALOG_URL);
  if (!catalog || typeof catalog !== 'object') {
    throw new Error('Reaction catalog must be a JSON object');
  }

  const reactionFiles = Array.isArray(catalog.reactionFiles) ? catalog.reactionFiles : [];
  if (!reactionFiles.length) {
    throw new Error('Reaction catalog must include at least one reaction file');
  }

  const presets = await Promise.all(
    reactionFiles.map(async (entry, index) => {
      const descriptor = typeof entry === 'string' ? { file: entry } : entry;
      assertObject(descriptor, `catalog.reactionFiles[${index}]`, 'catalog.json');
      assertNonEmptyString(descriptor.file, `catalog.reactionFiles[${index}].file`, 'catalog.json');

      const preset = await readJson(new URL(`../data/reactions/${descriptor.file}`, import.meta.url));
      validatePreset(preset, descriptor.file);

      if (descriptor.id && descriptor.id !== preset.id) {
        throw new Error(`catalog.json: ${descriptor.file} id mismatch (${descriptor.id} !== ${preset.id})`);
      }

      return deepFreeze(preset);
    })
  );

  const seenIds = new Set();
  for (const preset of presets) {
    if (seenIds.has(preset.id)) {
      throw new Error(`Duplicate reaction id detected: ${preset.id}`);
    }
    seenIds.add(preset.id);
  }

  const defaultReactionId = catalog.defaultReactionId ?? presets[0].id;
  if (!seenIds.has(defaultReactionId)) {
    throw new Error(`Default reaction id not found in catalog: ${defaultReactionId}`);
  }

  return {
    defaultReactionId,
    presets: Object.freeze(presets)
  };
}

const catalog = await loadReactionCatalog();

export const REACTION_PRESETS = catalog.presets;
export const DEFAULT_REACTION_ID = catalog.defaultReactionId;

export function getReactionCatalogMeta() {
  return {
    defaultReactionId: DEFAULT_REACTION_ID,
    count: REACTION_PRESETS.length,
    ids: REACTION_PRESETS.map((preset) => preset.id)
  };
}
