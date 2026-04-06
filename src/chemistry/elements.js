export const ELEMENTS = {
  H: {
    symbol: 'H',
    atomicNumber: 1,
    valenceElectrons: 1,
    color: '#f8fafc',
    covalentRadius: 0.31,
    renderRadius: 0.18,
    basis: {
      s: { exponent: 1.15, onsiteEnergy: -13.6, principalQuantumNumber: 1 }
    },
    coreDensity: []
  },
  C: {
    symbol: 'C',
    atomicNumber: 6,
    valenceElectrons: 4,
    color: '#d8e0ea',
    covalentRadius: 0.76,
    renderRadius: 0.28,
    basis: {
      s: { exponent: 1.55, onsiteEnergy: -21.4, principalQuantumNumber: 2 },
      p: { exponent: 1.32, onsiteEnergy: -11.4, principalQuantumNumber: 2 }
    },
    coreDensity: [
      { electrons: 2, exponent: 18.0 }
    ]
  },
  N: {
    symbol: 'N',
    atomicNumber: 7,
    valenceElectrons: 5,
    color: '#7dd3fc',
    covalentRadius: 0.71,
    renderRadius: 0.30,
    basis: {
      s: { exponent: 2.05, onsiteEnergy: -26.0, principalQuantumNumber: 2 },
      p: { exponent: 1.70, onsiteEnergy: -13.4, principalQuantumNumber: 2 }
    },
    coreDensity: [
      { electrons: 2, exponent: 24.0 }
    ]
  },
  O: {
    symbol: 'O',
    atomicNumber: 8,
    valenceElectrons: 6,
    color: '#ff8f8f',
    covalentRadius: 0.66,
    renderRadius: 0.30,
    basis: {
      s: { exponent: 2.30, onsiteEnergy: -32.3, principalQuantumNumber: 2 },
      p: { exponent: 1.95, onsiteEnergy: -14.8, principalQuantumNumber: 2 }
    },
    coreDensity: [
      { electrons: 2, exponent: 28.0 }
    ]
  },
  F: {
    symbol: 'F',
    atomicNumber: 9,
    valenceElectrons: 7,
    color: '#a7f3d0',
    covalentRadius: 0.57,
    renderRadius: 0.30,
    basis: {
      s: { exponent: 2.55, onsiteEnergy: -37.0, principalQuantumNumber: 2 },
      p: { exponent: 2.15, onsiteEnergy: -17.5, principalQuantumNumber: 2 }
    },
    coreDensity: [
      { electrons: 2, exponent: 32.0 }
    ]
  },
  S: {
    symbol: 'S',
    atomicNumber: 16,
    valenceElectrons: 6,
    color: '#fde68a',
    covalentRadius: 1.05,
    renderRadius: 0.34,
    basis: {
      s: { exponent: 1.72, onsiteEnergy: -20.0, principalQuantumNumber: 3 },
      p: { exponent: 1.42, onsiteEnergy: -10.8, principalQuantumNumber: 3 }
    },
    coreDensity: [
      { electrons: 10, exponent: 15.5 }
    ]
  },
  Cl: {
    symbol: 'Cl',
    atomicNumber: 17,
    valenceElectrons: 7,
    color: '#a5f3b5',
    covalentRadius: 1.02,
    renderRadius: 0.36,
    basis: {
      s: { exponent: 1.55, onsiteEnergy: -25.3, principalQuantumNumber: 3 },
      p: { exponent: 1.18, onsiteEnergy: -13.0, principalQuantumNumber: 3 }
    },
    coreDensity: [
      { electrons: 10, exponent: 14.0 }
    ]
  },
  Br: {
    symbol: 'Br',
    atomicNumber: 35,
    valenceElectrons: 7,
    color: '#fca5a5',
    covalentRadius: 1.20,
    renderRadius: 0.40,
    basis: {
      s: { exponent: 1.34, onsiteEnergy: -22.8, principalQuantumNumber: 4 },
      p: { exponent: 1.02, onsiteEnergy: -11.8, principalQuantumNumber: 4 }
    },
    coreDensity: [
      { electrons: 28, exponent: 10.5 }
    ]
  },
  I: {
    symbol: 'I',
    atomicNumber: 53,
    valenceElectrons: 7,
    color: '#c4b5fd',
    covalentRadius: 1.39,
    renderRadius: 0.46,
    basis: {
      s: { exponent: 1.18, onsiteEnergy: -20.5, principalQuantumNumber: 5 },
      p: { exponent: 0.92, onsiteEnergy: -10.4, principalQuantumNumber: 5 }
    },
    coreDensity: [
      { electrons: 46, exponent: 7.6 }
    ]
  }
};

export function atomValenceElectronMap(atoms) {
  return Object.fromEntries(atoms.map((atom) => [atom.id, ELEMENTS[atom.element].valenceElectrons]));
}

export function countValenceElectrons(atoms, totalCharge = 0) {
  const neutralValence = atoms.reduce((sum, atom) => sum + ELEMENTS[atom.element].valenceElectrons, 0);
  return neutralValence - totalCharge;
}

export function countTotalElectrons(atoms, totalCharge = 0) {
  const neutralElectrons = atoms.reduce((sum, atom) => sum + ELEMENTS[atom.element].atomicNumber, 0);
  return neutralElectrons - totalCharge;
}

export function countPseudoCoreElectrons(atoms) {
  return atoms.reduce((sum, atom) => {
    const shells = ELEMENTS[atom.element].coreDensity ?? [];
    return sum + shells.reduce((shellSum, shell) => shellSum + shell.electrons, 0);
  }, 0);
}
