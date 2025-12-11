import React, { useEffect, useRef, useState } from "react";
import type { SimulationData, SimulationParams, Species } from "./types";

const Simulation: React.FC<SimulationParams> = ({
  initialPopulation,
  iterationsPerFrame,
  maxCreatures,
  speciesRef
}) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    population: initialPopulation, time: 0
  })

  const frameIdRef = useRef<number>(-1);
  const [iterationsPerSecond, setIterationsPerSecond] = useState(0);
  const simulationStartTimeRef = useRef<number>(performance.now());


  useEffect(() => {
    let time = 0

    const dataPerCreature = 3
    const creatures: number[] = []

    for (let i = 0; i < initialPopulation; i++){
      for (let species of speciesRef.current){
        creatures.push(species.id) // species id
        creatures.push(0) // Alive since
        creatures.push(species.traits.timeToMature) // since when trying to multiply
      }
    }

    function createOffspring(species: Species) {
      if (creatures.length / dataPerCreature >= maxCreatures) {return}
      
      creatures.push(species.id) // species id
      creatures.push(time) // Alive since
      creatures.push(species.traits.timeToMature + time) // since when trying to multiply
    }

    const loop = () => {
      time += 1
      const deathList: number[] = []
      for (let i = 0; i < creatures.length / dataPerCreature; i++){
        const ii = i * dataPerCreature
        const species = speciesRef.current[creatures[ii]]
        if (creatures[ii + 1] + species.traits.lifeLenght < time) {
          deathList.push(i)
          continue
        }
        if (creatures[ii + 2] + species.traits.timeToMultiply <= time) {
          createOffspring(species)
          creatures[ii + 2] = time
        }
        
      }

      for (let i = 0; i < deathList.length; i++){
        creatures.splice( (deathList[i]-i) * dataPerCreature, dataPerCreature)
      }
    }

    
    const frameLoop = () => {
      for (let i = 0; i < iterationsPerFrame; i++){
        loop()
      }

      setSimulationData({
        population: creatures.length / dataPerCreature,
        time: time
      })

      if (frameIdRef.current % 10 === 0)
      setIterationsPerSecond(time/(performance.now()-simulationStartTimeRef.current)*1000)
    

      frameIdRef.current = requestAnimationFrame(frameLoop);
    }

    frameIdRef.current = requestAnimationFrame(frameLoop);
  }, [])

  return <div>iterations per frame: {iterationsPerFrame}<br/>population: {simulationData.population}<br/>current time: {simulationData.time}<br/>Avg iterations per second: {iterationsPerSecond.toFixed(0)}</div>;
};

export default Simulation;