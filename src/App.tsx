import { Card } from "./components/ui/card"
import Simulation from "./Simulation"
import { useEffect, useRef, useState } from "react"
import type { Parameters, Species } from "./types"


function getInitialParameters(): Parameters {
  return {
    initialPopulation: 10,
    iterationsPerFrame: 50,
    maxCreatures: 100000
  }
}

function getInitialSpecies(): Species[] {
  return [{
    id: 0,
    traits: {
      timeToMultiply: 20,
      lifeLenght: 50,
      timeToMature: 10,
      mutationChance: 0.00001,
      mutationRate: 0.1
    }
  }]
}


function App() {
  const [parameters, setParameters] = useState<Parameters>(getInitialParameters())
  const speciesRef = useRef<Species[]>(getInitialSpecies())

  useEffect(() => {

  }, [])

  return (
    <div className='min-h-[100dvh] min-w-full flex items-center justify-center p-[2dvh] bg-neutral-950'>
      <div className='flex gap-8 w-full max-w-[96dvw] h-[96dvh]'>

      {/* Simulation visual area */}
      <Card className="flex-1 aspect-square bg-neutral-900 p-0 overflow-hidden max-h-full min-w-[96dvh] max-w-[96dvh] border-neutral-800 text-neutral-200">
        <Simulation 
          initialPopulation={parameters.initialPopulation}
          iterationsPerFrame={parameters.iterationsPerFrame}
          maxCreatures={parameters.maxCreatures}
          speciesRef={speciesRef}
        />
      </Card>

      {/* Sidebar */}
      <Card className="grow h-full p-6 space-y-6 bg-neutral-900 grow flex flex-col justify-between border-neutral-800 text-neutral-200">
        Sidebar
      </Card>
      </div>
    </div>
  )
}

export default App