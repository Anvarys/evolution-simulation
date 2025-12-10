export interface SimulationParams {
    initialPopulation: number;
    updateInterval: number;
}

export type Parameters = {
    initialPopulation: number,
    updateInterval: number
}

export type SimulationData = {
    population: number,
    time: number
}