import React, { useEffect, useRef, useState } from "react";
import { mutateSpecies, traitsToString, type ChartDataPoint, type SimulationData, type SimulationParams, type Species } from "./types";
import { ChartContainer, type ChartConfig } from "./components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const timesChartConfig = {
  mostPopularSpeciesTimeToMultiply: {
    label: "Time to Multiply",
    color: "#5f38faff",
  },
  mostPopularSpeciesLifeLenght: {
    label: "Life Length",
    color: "#eb255dff",
  },
  mostPopularSpeciesTimeToMature: {
    label: "Time to Mature",
    color: "#3ceb25ff",
  },
} satisfies ChartConfig

const Simulation: React.FC<SimulationParams> = ({
  parameters,
  speciesRef
}) => {
  const [simulationData, setSimulationData] = useState<SimulationData>({
    population: parameters.initialPopulation, time: 0, mostPopularSpeciesId: 0, mostPopularSpeciesCount: 0
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

    for (let i = 0; i < parameters.initialPopulation; i++){
      for (let species of speciesRef.current){
        creatures.push(species.id) // species id
        creatures.push(0) // Alive since
        creatures.push(species.traits.timeToMature) // since when trying to multiply
      }
    }

    function createOffspring(species: Species) {
      if (creatures.length / dataPerCreature >= parameters.maxCreatures) {return}

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
      console.log(parameters)

      for (let i = 0; i < parameters.iterationsPerFrame; i++){
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
        mostPopularSpeciesTimeToMultiply: speciesRef.current[popularSpeciesId].traits.timeToMultiply,
        mostPopularSpeciesLifeLenght: speciesRef.current[popularSpeciesId].traits.lifeLenght,
        mostPopularSpeciesTimeToMature: speciesRef.current[popularSpeciesId].traits.timeToMature,
      } as ChartDataPoint)

      if (frameIdRef.current % 10 === 0)
      setIterationsPerSecond(time/(performance.now()-simulationStartTimeRef.current)*1000)

      if (creatures.length !== 0)
      frameIdRef.current = requestAnimationFrame(frameLoop);
    }

    frameIdRef.current = requestAnimationFrame(frameLoop);
  }, [])

  return (<>
  
  <div>iterations per frame: {parameters.iterationsPerFrame}<br/>population: {simulationData.population}<br/>current time: {simulationData.time}<br/>Avg iterations per second: {iterationsPerSecond.toFixed(0)}<br/><br/>Most popular species:<br/>{traitsToString(speciesRef.current[simulationData.mostPopularSpeciesId].traits)}</div>
  <div>
    <ChartContainer config={timesChartConfig} className="p-2 w-full flex-1 min-h-0">
      <LineChart 
        key={frameIdRef.current+updateChartLines}
        data={chartDataRef.current}
        margin={{}}
      >
        <CartesianGrid vertical={false}/>
        <XAxis dataKey="time" 
          tickMargin={0}
          tickLine={false}
          startOffset={1}
          interval={Math.floor(Math.max(Math.floor(chartDataRef.current.length/12/100)*100-1, parameters.iterationsPerFrame/10))}
        />
        <YAxis
            tickLine={false}
        />
        <Line 
          dataKey="mostPopularSpeciesTimeToMultiply"
          type="monotone"
          stroke="#5f38faff"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line 
          dataKey="mostPopularSpeciesLifeLenght"
          type="monotone"
          stroke="#eb255dff"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line 
          dataKey="mostPopularSpeciesTimeToMature"
          type="monotone"
          stroke="#3ceb25ff"
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