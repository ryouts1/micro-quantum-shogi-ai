import { normalizeReactionLibrary, parseReactionLibraryText } from './reactionSchema.js';

const FALLBACK_PRESET = {
  id: 'oh-cl',
  family: 'methyl-sn2',
  familyLabel: 'methyl SN2',
  title: 'OH⁻ + CH₃Cl → CH₃OH + Cl⁻',
  shortTitle: 'Hydroxide + methyl chloride',
  description: 'Fallback preset used when the JSON reaction catalog is unavailable.',
  substrateLabel: 'methyl chloride',
  productLabel: 'methanol + chloride',
  totalCharge: -1,
  substrate: {
    type: 'methyl',
    label: 'CH₃',
    alphaHydrogenBondLength: 1.09,
    betaCarbonBondLength: 1.53,
    betaHydrogenBondLength: 1.09
  },
  nucleophile: {
    symbol: 'O',
    display: 'OH⁻',
    atomLabel: 'O',
    element: 'O',
    productFragment: 'CH₃OH',
    distances: { reactant: 3.2, transition: 2.08, product: 1.43 },
    hydrogens: {
      count: 1,
      bondLength: 0.96,
      polarAngleDeg: 108.5,
      azimuthDegs: [90]
    }
  },
  leavingGroup: {
    symbol: 'Cl',
    display: 'Cl⁻',
    atomLabel: 'Cl',
    element: 'Cl',
    distances: { reactant: 1.78, transition: 2.08, product: 3.85 }
  }
};

async function loadCatalogFromJson() {
  const catalogUrl = new URL('../data/reactions/catalog.json', import.meta.url);

  if (catalogUrl.protocol === 'file:') {
    const { readFile } = await import('node:fs/promises');
    const source = await readFile(catalogUrl, 'utf8');
    return JSON.parse(source);
  }

  const response = await fetch(catalogUrl);
  if (!response.ok) {
    throw new Error(`Failed to load reaction catalog: ${response.status}`);
  }
  return response.json();
}

let builtInLibrary;
try {
  builtInLibrary = normalizeReactionLibrary(await loadCatalogFromJson(), { source: 'built-in' });
} catch (error) {
  console.warn('Falling back to embedded reaction preset.', error);
  builtInLibrary = normalizeReactionLibrary([FALLBACK_PRESET], { source: 'built-in' });
}

let customLibrary = { schemaVersion: 1, name: null, reactions: [] };

function buildPresetMap() {
  return Object.freeze(Object.fromEntries([
    ...builtInLibrary.reactions,
    ...customLibrary.reactions
  ].map((preset) => [preset.id, preset])));
}

let presetMap = buildPresetMap();
const DEFAULT_PRESET_ID = presetMap['oh-cl'] ? 'oh-cl' : builtInLibrary.reactions[0]?.id;

function refreshPresetMap() {
  presetMap = buildPresetMap();
}

export function listBuiltInReactionPresets() {
  return builtInLibrary.reactions;
}

export function listCustomReactionPresets() {
  return customLibrary.reactions;
}

export function listReactionPresets() {
  return [...builtInLibrary.reactions, ...customLibrary.reactions];
}

export function getReactionPreset(reactionId = DEFAULT_PRESET_ID) {
  return presetMap[reactionId] ?? presetMap[DEFAULT_PRESET_ID];
}

export function hasReactionPreset(reactionId) {
  return Object.hasOwn(presetMap, reactionId);
}

export function defaultReactionPresetId() {
  return DEFAULT_PRESET_ID;
}

export function importReactionLibraryFromText(sourceText, options = {}) {
  const importedLibrary = parseReactionLibraryText(sourceText, {
    source: options.source ?? 'custom',
    libraryName: options.name ?? null
  });

  if (options.replace) {
    customLibrary = importedLibrary;
  } else {
    const merged = new Map(customLibrary.reactions.map((preset) => [preset.id, preset]));
    importedLibrary.reactions.forEach((preset) => merged.set(preset.id, preset));
    customLibrary = {
      ...importedLibrary,
      reactions: [...merged.values()]
    };
  }

  refreshPresetMap();
  return {
    ...importedLibrary,
    totalBuiltIns: builtInLibrary.reactions.length,
    totalCustom: customLibrary.reactions.length
  };
}

export async function importReactionLibraryFromFile(file, options = {}) {
  const sourceText = await file.text();
  return importReactionLibraryFromText(sourceText, {
    ...options,
    name: options.name ?? file.name ?? null
  });
}

export function resetCustomReactionPresets() {
  customLibrary = { schemaVersion: 1, name: null, reactions: [] };
  refreshPresetMap();
}
