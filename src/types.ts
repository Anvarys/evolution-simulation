export interface SimulationParams {
    initialPopulation: number;
    iterationsPerFrame: number;
    maxCreatures: number;
    speciesRef: React.RefObject<Species[]>;
}

export type Parameters = {
    initialPopulation: number,
    iterationsPerFrame: number,
    maxCreatures: number
}

export type SimulationData = {
    population: number,
    time: number
}

export type Species = {
    id: number,
    traits: Traits
}

export type Traits = {
    timeToMultiply: number,
    lifeLenght: number,
    timeToMature: number
}