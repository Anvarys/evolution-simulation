import React, { useEffect, useRef, useState } from "react";
import { mutateSpecies, traitsToString, type ChartDataPoint, type SimulationData, type SimulationParams, type Species } from "./types";
import { ChartContainer, type ChartConfig } from "./components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const chartConfig = {
  mostPopularSpeciesTimeToMultiply: {
    label: "Time to Multiply",
    color: "#16a34a",
  },
} satisfies ChartConfig

const Simulation: React.FC<SimulationParams> = ({
  initialPopulation,
  iterationsPerFrame,
  maxCreatures,
  speciesRef
}) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    population: initialPopulation, time: 0, mostPopularSpeciesId: 0, mostPopularSpeciesCount: 0
  })

  const frameIdRef = useRef<number>(-1);
  const [iterationsPerSecond, setIterationsPerSecond] = useState(0);
  const simulationStartTimeRef = useRef<number>(performance.now());
  const [updateChartLines, setUpdateChartLines] = useState(0);

  const chartDataRef = useRef<ChartDataPoint[]>([]);

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

      if (Math.random() < species.traits.mutationChance) {
        const newSpecies = mutateSpecies(species)
        newSpecies.id = speciesRef.current.length
        speciesRef.current.push(newSpecies)

        species = newSpecies
      }
      
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

      const creatureCount: {[key: number]: number} = {}

      for (let i = 0; i < creatures.length / dataPerCreature; i++){
        if (!(creatures[i * dataPerCreature] in creatureCount)){
          creatureCount[creatures[i * dataPerCreature]] = 1
        }
        else {
          creatureCount[creatures[i * dataPerCreature]] += 1
        }
      }

      const keys = Object.keys(creatureCount).map(Number); 
      const popularSpeciesId = keys.length
        ? keys.reduce((a, b) => creatureCount[a] > creatureCount[b] ? a : b)
        : 0;

      setSimulationData({
        population: creatures.length / dataPerCreature,
        time: time,
        mostPopularSpeciesId: popularSpeciesId,
        mostPopularSpeciesCount: creatureCount[popularSpeciesId]
      })

      chartDataRef.current.push({
        time: time,
        population: creatures.length / dataPerCreature,
        mostPopularSpeciesCount: creatureCount[popularSpeciesId] || 0,
        mostPopularSpeciesTimeToMultiply: speciesRef.current[popularSpeciesId].traits.timeToMultiply
      } as ChartDataPoint)

      if (frameIdRef.current % 10 === 0)
      setIterationsPerSecond(time/(performance.now()-simulationStartTimeRef.current)*1000)
    
      console.log(Math.max(Math.floor(simulationData.time/15/iterationsPerFrame)*iterationsPerFrame-1, (iterationsPerFrame*120)-1))

      if (creatures.length !== 0)
      frameIdRef.current = requestAnimationFrame(frameLoop);
    }

    frameIdRef.current = requestAnimationFrame(frameLoop);
  }, [])

  return (<>
  
  <div>iterations per frame: {iterationsPerFrame}<br/>population: {simulationData.population}<br/>current time: {simulationData.time}<br/>Avg iterations per second: {iterationsPerSecond.toFixed(0)}<br/><br/>Most popular species:<br/>{traitsToString(speciesRef.current[simulationData.mostPopularSpeciesId].traits)}<br/>popular population: {simulationData.mostPopularSpeciesCount}</div>
  <div>
    <ChartContainer config={chartConfig} className="p-2 w-full flex-1 min-h-0">
      <LineChart 
        key={frameIdRef.current+updateChartLines}
        accessibilityLayer
        data={chartDataRef.current}
        margin={{}}
      >
        <CartesianGrid vertical={false}/>
        <XAxis dataKey="time" 
          tickMargin={0}
          tickLine={false}
          startOffset={1}
          interval={Math.max(Math.floor(chartDataRef.current.length/12/100)*100-1, iterationsPerFrame/15)}
        />
        <YAxis
            tickLine={false}
        />
        <Line 
          dataKey="mostPopularSpeciesTimeToMultiply"
          type="monotone"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ChartContainer>
  </div>

</>);
};

export default Simulation;