const SUPPORTED_FAMILIES = new Set(['sn2', 'methyl-sn2', 'primary-sn2']);

function ensureNumber(value, label) {
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid numeric value for ${label}.`);
  }
  return value;
}

function normalizeHydrogenConfig(hydrogens) {
  if (!hydrogens || !hydrogens.count) {
    return null;
  }

  const count = Math.max(Math.floor(ensureNumber(hydrogens.count, 'hydrogens.count')), 0);
  const azimuthDegs = hydrogens.azimuthDegs ?? hydrogens.azimuthsDeg ?? hydrogens.azimuths ?? [];

  return {
    count,
    bondLength: ensureNumber(hydrogens.bondLength, 'hydrogens.bondLength'),
    polarAngleDeg: ensureNumber(hydrogens.polarAngleDeg ?? 105, 'hydrogens.polarAngleDeg'),
    azimuthDegs: Array.isArray(azimuthDegs)
      ? azimuthDegs.map((value) => ensureNumber(value, 'hydrogens.azimuthDegs[]'))
      : []
  };
}

function normalizeSubstrateConfig(substrate = {}) {
  const type = substrate.type ?? 'methyl';
  if (type !== 'methyl' && type !== 'ethyl') {
    throw new Error(`Unsupported substrate.type: ${type}`);
  }

  return {
    type,
    label: substrate.label ?? (type === 'ethyl' ? 'CH₃CH₂' : 'CH₃'),
    alphaHydrogenBondLength: ensureNumber(substrate.alphaHydrogenBondLength ?? 1.09, 'substrate.alphaHydrogenBondLength'),
    betaCarbonBondLength: ensureNumber(substrate.betaCarbonBondLength ?? 1.53, 'substrate.betaCarbonBondLength'),
    betaHydrogenBondLength: ensureNumber(substrate.betaHydrogenBondLength ?? 1.09, 'substrate.betaHydrogenBondLength')
  };
}

function tagReactionSource(preset, source = 'built-in', libraryName = null) {
  return Object.freeze({
    ...preset,
    source,
    libraryName
  });
}

export function normalizeReactionPreset(rawPreset, { source = 'built-in', libraryName = null } = {}) {
  if (!rawPreset?.id) {
    throw new Error('Each reaction preset requires an id.');
  }
  if (!rawPreset?.nucleophile?.element) {
    throw new Error(`Reaction ${rawPreset.id} is missing nucleophile.element.`);
  }
  if (!rawPreset?.leavingGroup?.element) {
    throw new Error(`Reaction ${rawPreset.id} is missing leavingGroup.element.`);
  }

  const family = rawPreset.family ?? 'sn2';
  if (!SUPPORTED_FAMILIES.has(family)) {
    throw new Error(`Reaction family \"${family}\" is not supported yet.`);
  }

  return tagReactionSource({
    id: String(rawPreset.id),
    family,
    familyLabel: rawPreset.familyLabel ?? (family === 'primary-sn2' ? 'primary alkyl SN2' : 'methyl SN2'),
    title: rawPreset.title ?? rawPreset.id,
    shortTitle: rawPreset.shortTitle ?? rawPreset.title ?? rawPreset.id,
    description: rawPreset.description ?? '',
    substrateLabel: rawPreset.substrateLabel ?? 'alkyl halide',
    productLabel: rawPreset.productLabel ?? 'substitution products',
    totalCharge: ensureNumber(rawPreset.totalCharge ?? 0, `${rawPreset.id}.totalCharge`),
    substrate: normalizeSubstrateConfig(rawPreset.substrate),
    nucleophile: {
      symbol: rawPreset.nucleophile.symbol ?? rawPreset.nucleophile.element ?? 'Nu',
      display: rawPreset.nucleophile.display ?? rawPreset.nucleophile.symbol ?? 'Nu⁻',
      atomLabel: rawPreset.nucleophile.atomLabel ?? rawPreset.nucleophile.symbol ?? rawPreset.nucleophile.element ?? 'Nu',
      element: rawPreset.nucleophile.element,
      productFragment: rawPreset.nucleophile.productFragment ?? rawPreset.productLabel,
      distances: {
        reactant: ensureNumber(rawPreset.nucleophile?.distances?.reactant, `${rawPreset.id}.nucleophile.distances.reactant`),
        transition: ensureNumber(rawPreset.nucleophile?.distances?.transition, `${rawPreset.id}.nucleophile.distances.transition`),
        product: ensureNumber(rawPreset.nucleophile?.distances?.product, `${rawPreset.id}.nucleophile.distances.product`)
      },
      hydrogens: normalizeHydrogenConfig(rawPreset.nucleophile.hydrogens)
    },
    leavingGroup: {
      symbol: rawPreset.leavingGroup.symbol ?? rawPreset.leavingGroup.element ?? 'LG',
      display: rawPreset.leavingGroup.display ?? rawPreset.leavingGroup.symbol ?? 'LG⁻',
      atomLabel: rawPreset.leavingGroup.atomLabel ?? rawPreset.leavingGroup.symbol ?? rawPreset.leavingGroup.element ?? 'LG',
      element: rawPreset.leavingGroup.element,
      distances: {
        reactant: ensureNumber(rawPreset.leavingGroup?.distances?.reactant, `${rawPreset.id}.leavingGroup.distances.reactant`),
        transition: ensureNumber(rawPreset.leavingGroup?.distances?.transition, `${rawPreset.id}.leavingGroup.distances.transition`),
        product: ensureNumber(rawPreset.leavingGroup?.distances?.product, `${rawPreset.id}.leavingGroup.distances.product`)
      }
    }
  }, source, libraryName);
}

export function normalizeReactionLibrary(rawLibrary, options = {}) {
  const rawList = Array.isArray(rawLibrary)
    ? rawLibrary
    : Array.isArray(rawLibrary?.reactions)
      ? rawLibrary.reactions
      : [];

  if (!rawList.length) {
    throw new Error('Reaction JSON must contain an array of reactions or a { reactions: [...] } object.');
  }

  const libraryName = options.libraryName ?? rawLibrary?.name ?? null;
  const reactions = [];
  const ids = new Set();

  rawList.forEach((entry) => {
    const normalized = normalizeReactionPreset(entry, { ...options, libraryName });
    if (ids.has(normalized.id)) {
      throw new Error(`Duplicate reaction preset id: ${normalized.id}`);
    }
    ids.add(normalized.id);
    reactions.push(normalized);
  });

  return {
    schemaVersion: rawLibrary?.schemaVersion ?? 1,
    name: libraryName,
    reactions
  };
}

export function parseReactionLibraryText(sourceText, options = {}) {
  let parsed;
  try {
    parsed = JSON.parse(sourceText);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
  }

  return normalizeReactionLibrary(parsed, options);
}
