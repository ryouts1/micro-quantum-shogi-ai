import { getReactionGeometry, computeBounds } from '../chemistry/reactionPath.js';
import { countTotalElectrons, countValenceElectrons } from '../chemistry/elements.js';
import { computeReactionSnapshot, sampleFieldOnGrid } from '../physics/sampler.js';

function summarizeOrbitalEnergies(model) {
  return model.orbitalEnergies.map((energy, index) => ({
    index,
    energy,
    occupancy: model.occupancies[index]
  }));
}

self.addEventListener('message', (event) => {
  const {
    requestId,
    progress,
    resolution,
    view,
    reactionId = 'oh-cl',
    reactionDefinition = null,
    basisScale = 1,
    couplingScale = 1.75
  } = event.data;

  try {
    const startedAt = performance.now();
    const selectedReaction = reactionDefinition ?? reactionId;
    const geometry = getReactionGeometry(progress, selectedReaction);
    const bounds = computeBounds(geometry.atoms, 2.4);
    const currentModel = computeReactionSnapshot(geometry, { basisScale, couplingScale });
    const referenceModel = (view === 'delta-density' || view === 'reactive-flow')
      ? computeReactionSnapshot(getReactionGeometry(0, selectedReaction), { basisScale, couplingScale })
      : null;

    const sampled = sampleFieldOnGrid({
      currentModel,
      referenceModel,
      atoms: geometry.atoms,
      bounds,
      resolution,
      view
    });

    const payload = {
      requestId,
      reactionId,
      reaction: {
        id: geometry.reaction.id,
        title: geometry.reaction.title,
        shortTitle: geometry.reaction.shortTitle,
        description: geometry.reaction.description,
        substrateLabel: geometry.reaction.substrateLabel,
        productLabel: geometry.reaction.productLabel,
        totalCharge: geometry.totalCharge
      },
      labels: geometry.labels,
      progress,
      view,
      resolution,
      atoms: geometry.atoms,
      bonds: geometry.bonds,
      metrics: geometry.metrics,
      bounds: sampled.bounds,
      step: sampled.step,
      stats: {
        ...sampled.stats,
        computeMs: performance.now() - startedAt
      },
      summary: {
        basisFunctionCount: currentModel.basisFunctions.length,
        valenceElectronCount: countValenceElectrons(geometry.atoms, geometry.totalCharge),
        totalElectronCount: countTotalElectrons(geometry.atoms, geometry.totalCharge),
        electronCountCheck: currentModel.electronCountCheck,
        charges: currentModel.charges,
        populations: currentModel.populations,
        overlapPopulations: currentModel.overlapPopulations,
        orbitalEnergies: summarizeOrbitalEnergies(currentModel),
        homoIndex: currentModel.homoIndex,
        lumoIndex: currentModel.lumoIndex,
        homoEnergy: currentModel.orbitalEnergies[currentModel.homoIndex],
        lumoEnergy: currentModel.orbitalEnergies[currentModel.lumoIndex],
        gap: currentModel.orbitalEnergies[currentModel.lumoIndex] - currentModel.orbitalEnergies[currentModel.homoIndex],
        reactiveOrbitals: {
          donorIndex: currentModel.reactiveOrbitals.donorIndex,
          donorEnergy: currentModel.reactiveOrbitals.donorEnergy,
          donorNorm: currentModel.reactiveOrbitals.donorNorm,
          donorScore: currentModel.reactiveOrbitals.donorScore,
          acceptorIndex: currentModel.reactiveOrbitals.acceptorIndex,
          acceptorEnergy: currentModel.reactiveOrbitals.acceptorEnergy,
          acceptorNorm: currentModel.reactiveOrbitals.acceptorNorm,
          acceptorScore: currentModel.reactiveOrbitals.acceptorScore,
          donorAcceptorGap: currentModel.reactiveOrbitals.donorAcceptorGap,
          channelElectronCount: currentModel.reactiveOrbitals.channelElectronCount
        }
      },
      weightField: sampled.weightField.buffer,
      colorMetricField: sampled.colorMetricField.buffer
    };

    self.postMessage(payload, [sampled.weightField.buffer, sampled.colorMetricField.buffer]);
  } catch (error) {
    self.postMessage({
      requestId,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});
