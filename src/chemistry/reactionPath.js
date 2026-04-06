import { lerp, smoothstep } from '../math/numerics.js';
import { getReactionPreset } from './reactionPresets.js';

const DEFAULT_ALPHA_C_H_BOND_LENGTH = 1.09;
const DEFAULT_BETA_C_C_BOND_LENGTH = 1.53;
const DEFAULT_BETA_C_H_BOND_LENGTH = 1.09;
const FULL_ROTATION = Math.PI * 2;
const TETRAHEDRAL_X_COMPONENT_MAGNITUDE = 1 / 3;

function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function unitVectorFromPolar(angle, azimuth) {
  const sine = Math.sin(angle);
  return [
    Math.cos(angle),
    sine * Math.cos(azimuth),
    sine * Math.sin(azimuth)
  ];
}

function normalizeVector([x, y, z]) {
  const magnitude = Math.hypot(x, y, z);
  if (magnitude < 1e-12) {
    return [1, 0, 0];
  }
  return [x / magnitude, y / magnitude, z / magnitude];
}

function dotProduct([ax, ay, az], [bx, by, bz]) {
  return (ax * bx) + (ay * by) + (az * bz);
}

function crossProduct([ax, ay, az], [bx, by, bz]) {
  return [
    (ay * bz) - (az * by),
    (az * bx) - (ax * bz),
    (ax * by) - (ay * bx)
  ];
}

function piecewiseDistance(progress, distances) {
  const { reactant, transition, product } = distances;
  if (progress <= 0.5) {
    const t = smoothstep(0, 0.5, progress);
    return lerp(reactant, transition, t);
  }
  const t = smoothstep(0.5, 1, progress);
  return lerp(transition, product, t);
}

function buildOrthonormalFrame(axis) {
  const normalizedAxis = normalizeVector(axis);
  const helper = Math.abs(normalizedAxis[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const tangent = normalizeVector(crossProduct(normalizedAxis, helper));
  const bitangent = normalizeVector(crossProduct(normalizedAxis, tangent));
  return { axis: normalizedAxis, tangent, bitangent };
}

function buildTetrahedralTriad(axis, phase = 0) {
  const { axis: normalizedAxis, tangent, bitangent } = buildOrthonormalFrame(axis);
  const axialComponent = -TETRAHEDRAL_X_COMPONENT_MAGNITUDE;
  const radialComponent = Math.sqrt(1 - (axialComponent ** 2));

  return [0, 1, 2].map((index) => {
    const azimuth = phase + ((index / 3) * FULL_ROTATION);
    const tangentScale = radialComponent * Math.cos(azimuth);
    const bitangentScale = radialComponent * Math.sin(azimuth);
    return normalizeVector([
      (axialComponent * normalizedAxis[0]) + (tangentScale * tangent[0]) + (bitangentScale * bitangent[0]),
      (axialComponent * normalizedAxis[1]) + (tangentScale * tangent[1]) + (bitangentScale * bitangent[1]),
      (axialComponent * normalizedAxis[2]) + (tangentScale * tangent[2]) + (bitangentScale * bitangent[2])
    ]);
  });
}

function buildAlphaSubstituentDirections(progress) {
  const xComponent = lerp(-TETRAHEDRAL_X_COMPONENT_MAGNITUDE, TETRAHEDRAL_X_COMPONENT_MAGNITUDE, smoothstep(0, 1, progress));
  const radialComponent = Math.sqrt(Math.max(1 - (xComponent ** 2), 0));

  return [0, 1, 2].map((index) => {
    const azimuth = (index / 3) * FULL_ROTATION;
    return [
      xComponent,
      radialComponent * Math.cos(azimuth),
      radialComponent * Math.sin(azimuth)
    ];
  });
}

function buildNucleophileHydrogenDirections(config) {
  if (!config?.count) {
    return [];
  }

  const angle = degreesToRadians(config.polarAngleDeg ?? 105);
  const azimuthValues = config.azimuthDegs?.length
    ? config.azimuthDegs.map((azimuthDeg) => degreesToRadians(azimuthDeg))
    : config.azimuths?.length
      ? config.azimuths
      : Array.from({ length: config.count }, (_, index) => ((index / config.count) * FULL_ROTATION));

  return azimuthValues.map((azimuth) => unitVectorFromPolar(angle, azimuth));
}

function scaleVector([x, y, z], scalar) {
  return [x * scalar, y * scalar, z * scalar];
}

function addVectors([ax, ay, az], [bx, by, bz]) {
  return [ax + bx, ay + by, az + bz];
}

function distance(left, right) {
  const dx = left.x - right.x;
  const dy = left.y - right.y;
  const dz = left.z - right.z;
  return Math.sqrt((dx * dx) + (dy * dy) + (dz * dz));
}

function bondOrder(progress, mode) {
  if (mode === 'forming') {
    return smoothstep(0.2, 0.95, progress);
  }
  if (mode === 'breaking') {
    return 1 - smoothstep(0.05, 0.8, progress);
  }
  return 1;
}

function buildAtom(id, element, position, options = {}) {
  return {
    id,
    element,
    label: options.label ?? element,
    displayLabel: options.displayLabel ?? options.label ?? element,
    x: position[0],
    y: position[1],
    z: position[2],
    kind: options.kind ?? 'main',
    role: options.role ?? 'context'
  };
}

function buildSubstrateFragment(progress, preset, atoms, bonds) {
  const substrate = preset.substrate ?? { type: 'methyl' };
  const alphaDirections = buildAlphaSubstituentDirections(progress);
  const alphaCarbonPosition = [0, 0, 0];
  const alphaHydrogenBondLength = substrate.alphaHydrogenBondLength ?? DEFAULT_ALPHA_C_H_BOND_LENGTH;

  if (substrate.type === 'ethyl') {
    const betaCarbonDirection = alphaDirections[0];
    const betaCarbonPosition = addVectors(alphaCarbonPosition, scaleVector(betaCarbonDirection, substrate.betaCarbonBondLength ?? DEFAULT_BETA_C_C_BOND_LENGTH));
    atoms.push(buildAtom('C_beta', 'C', betaCarbonPosition, {
      label: 'C',
      displayLabel: 'Cβ',
      kind: 'spectator',
      role: 'substrate-beta-carbon'
    }));
    bonds.push({ atoms: ['C', 'C_beta'], order: 1, role: 'spectator' });

    const betaToAlphaDirection = normalizeVector([
      alphaCarbonPosition[0] - betaCarbonPosition[0],
      alphaCarbonPosition[1] - betaCarbonPosition[1],
      alphaCarbonPosition[2] - betaCarbonPosition[2]
    ]);
    const betaHydrogenDirections = buildTetrahedralTriad(betaToAlphaDirection, Math.PI / 6);
    betaHydrogenDirections.forEach((direction, index) => {
      const position = addVectors(
        betaCarbonPosition,
        scaleVector(direction, substrate.betaHydrogenBondLength ?? DEFAULT_BETA_C_H_BOND_LENGTH)
      );
      const atomId = `H_beta${index + 1}`;
      atoms.push(buildAtom(atomId, 'H', position, {
        label: 'H',
        displayLabel: `Hβ${index + 1}`,
        kind: 'spectator',
        role: 'substrate-beta-hydrogen'
      }));
      bonds.push({ atoms: ['C_beta', atomId], order: 1, role: 'spectator' });
    });

    const alphaSubstituentPositions = [betaCarbonPosition];

    alphaDirections.slice(1).forEach((direction, index) => {
      const position = addVectors(alphaCarbonPosition, scaleVector(direction, alphaHydrogenBondLength));
      const atomId = `H_c${index + 1}`;
      atoms.push(buildAtom(atomId, 'H', position, {
        label: 'H',
        displayLabel: `Hα${index + 1}`,
        kind: 'spectator',
        role: 'methyl-hydrogen'
      }));
      bonds.push({ atoms: ['C', atomId], order: 1, role: 'spectator' });
      alphaSubstituentPositions.push(position);
    });

    return alphaSubstituentPositions;
  }

  alphaDirections.forEach((direction, index) => {
    const position = addVectors(alphaCarbonPosition, scaleVector(direction, alphaHydrogenBondLength));
    const atomId = `H_c${index + 1}`;
    atoms.push(buildAtom(atomId, 'H', position, {
      label: 'H',
      displayLabel: `H𝒄${index + 1}`,
      kind: 'spectator',
      role: 'methyl-hydrogen'
    }));
    bonds.push({ atoms: ['C', atomId], order: 1, role: 'spectator' });
  });

  return alphaDirections.map((direction) => addVectors(alphaCarbonPosition, scaleVector(direction, alphaHydrogenBondLength)));
}

export function getReactionGeometry(progress, reactionId = 'oh-cl') {
  const preset = typeof reactionId === 'string' ? getReactionPreset(reactionId) : reactionId;
  const nucleophileCarbonDistance = piecewiseDistance(progress, preset.nucleophile.distances);
  const carbonLeavingGroupDistance = piecewiseDistance(progress, preset.leavingGroup.distances);

  const carbonPosition = [0, 0, 0];
  const nucleophilePosition = [-nucleophileCarbonDistance, 0, 0];
  const leavingGroupPosition = [carbonLeavingGroupDistance, 0, 0];

  const atoms = [
    buildAtom('Nu', preset.nucleophile.element, nucleophilePosition, {
      label: preset.nucleophile.atomLabel,
      displayLabel: `Nu (${preset.nucleophile.atomLabel})`,
      kind: 'reactive',
      role: 'nucleophile'
    })
  ];

  const nucleophileHydrogenDirections = buildNucleophileHydrogenDirections(preset.nucleophile.hydrogens);
  nucleophileHydrogenDirections.forEach((direction, index) => {
    const position = addVectors(
      nucleophilePosition,
      scaleVector(direction, preset.nucleophile.hydrogens.bondLength)
    );
    atoms.push(buildAtom(`H_nu${index + 1}`, 'H', position, {
      label: 'H',
      displayLabel: `Hₙᵤ${index + 1}`,
      kind: 'spectator',
      role: 'nucleophile-hydrogen'
    }));
  });

  atoms.push(buildAtom('C', 'C', carbonPosition, {
    label: 'C',
    displayLabel: 'Cα',
    kind: 'reactive',
    role: 'carbon'
  }));
  atoms.push(buildAtom('LG', preset.leavingGroup.element, leavingGroupPosition, {
    label: preset.leavingGroup.atomLabel,
    displayLabel: `LG (${preset.leavingGroup.atomLabel})`,
    kind: 'reactive',
    role: 'leaving-group'
  }));

  const bonds = [
    ...atoms
      .filter((atom) => atom.role === 'nucleophile-hydrogen')
      .map((atom) => ({ atoms: ['Nu', atom.id], order: 1, role: 'context' })),
    { atoms: ['Nu', 'C'], order: bondOrder(progress, 'forming'), role: 'reactive' },
    { atoms: ['C', 'LG'], order: bondOrder(progress, 'breaking'), role: 'reactive' }
  ];

  const alphaSubstituentPositions = buildSubstrateFragment(progress, preset, atoms, bonds);
  const atomMap = Object.fromEntries(atoms.map((atom) => [atom.id, atom]));

  const nucleophileHydrogenDistances = atoms
    .filter((atom) => atom.role === 'nucleophile-hydrogen')
    .map((atom) => distance(atomMap.Nu, atom));

  return {
    progress,
    reactionId: preset.id,
    reaction: preset,
    totalCharge: preset.totalCharge,
    atoms,
    bonds,
    labels: {
      familyLabel: preset.familyLabel,
      substrateLabel: preset.substrateLabel,
      nucleophileSymbol: preset.nucleophile.symbol,
      nucleophileDisplay: preset.nucleophile.display,
      leavingGroupSymbol: preset.leavingGroup.symbol,
      leavingGroupDisplay: preset.leavingGroup.display,
      nucleophileCarbonBond: `${preset.nucleophile.symbol}–C`,
      carbonLeavingGroupBond: `C–${preset.leavingGroup.symbol}`,
      nucleophileHydrogenBond: preset.nucleophile.hydrogens?.count ? `${preset.nucleophile.symbol}–H` : null
    },
    metrics: {
      nucleophileCarbonDistance,
      carbonLeavingGroupDistance,
      carbonInversionX: alphaSubstituentPositions.reduce((sum, position) => sum + position[0], 0) / alphaSubstituentPositions.length,
      nucleophileHydrogenDistances,
      averageNucleophileHydrogenDistance: nucleophileHydrogenDistances.length
        ? nucleophileHydrogenDistances.reduce((sum, value) => sum + value, 0) / nucleophileHydrogenDistances.length
        : null
    }
  };
}

export function computeBounds(atoms, padding = 2.2) {
  const xs = atoms.map((atom) => atom.x);
  const ys = atoms.map((atom) => atom.y);
  const zs = atoms.map((atom) => atom.z);

  return {
    minX: Math.min(...xs) - padding,
    maxX: Math.max(...xs) + padding,
    minY: Math.min(...ys) - padding,
    maxY: Math.max(...ys) + padding,
    minZ: Math.min(...zs) - padding,
    maxZ: Math.max(...zs) + padding
  };
}
