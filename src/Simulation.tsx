import React, { useEffect, useRef, useState } from "react";
import type { SimulationData, SimulationParams } from "./types";

const Simulation: React.FC<SimulationParams> = ({
  initialPopulation,
  updateInterval
}) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    population: initialPopulation, time: 0
  })

  const frameIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let time = 0

    const loop = () => {
      time += 1
    }

    
    const frameLoop = () => {
      setSimulationData({
        population: initialPopulation,
        time: time
      })

      for (let i = 0; i < updateInterval; i++){
        loop()
      }

      frameIdRef.current = requestAnimationFrame(frameLoop);
    }

    frameIdRef.current = requestAnimationFrame(frameLoop);
  }, [])

  return <div>Simulation<br/>initial population: {initialPopulation}<br/>current time: {simulationData.time}</div>;
};

export default Simulation;