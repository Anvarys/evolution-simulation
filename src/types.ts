export interface SimulationParams {
    parameters: Parameters,
    speciesRef: React.RefObject<Species[]>;
}

export type Parameters = {
    initialPopulation: number,
    iterationsPerFrame: number,
    maxCreatures: number
}

export type SimulationData = {
    population: number,
    time: number,
    mostPopularSpeciesId: number,
    mostPopularSpeciesCount: number
}

export type ChartDataPoint = {
    time: number,
    population: number,
    mostPopularSpeciesTimeToMultiply: number,
    mostPopularSpeciesCount: number,
    mostPopularSpeciesLifeLenght: number,
    mostPopularSpeciesTimeToMature: number,
    mostPopularSpeciesMutationChance: number,
    mostPopularSpeciesMutationRate: number
}

export type Species = {
    id: number,
    traits: Traits
}

export type Traits = {
    timeToMultiply: number,
    lifeLenght: number,
    timeToMature: number,
    mutationChance: number,
    mutationRate: number
}

export function mutateSpecies(species: Species): Species {
    const traitsKeys = Object.keys(species.traits) as (keyof Traits)[]
    const trait = traitsKeys[Math.floor(Math.random() * traitsKeys.length)]
    species.traits[trait as keyof Traits] += (Math.random() - 0.5) * species.traits.mutationRate * species.traits[trait as keyof Traits]
    return species
}

export function traitsToString(traits: Traits): string {
    return `Time to multiply: ${traits.timeToMultiply.toFixed(2)}\nLife length: ${traits.lifeLenght.toFixed(2)}\nTime to mature: ${traits.timeToMature.toFixed(2)}\nMutation chance: ${traits.mutationChance.toFixed(6)}\nMutation rate: ${traits.mutationRate.toFixed(4)}`
}