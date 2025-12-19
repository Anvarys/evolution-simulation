import { Card } from "./components/ui/card"
import Simulation from "./Simulation"
import { useEffect, useRef, useState } from "react"
import type { Parameters, Species, Traits } from "./types"
import { Slider } from "./components/ui/slider"
import { Label } from "./components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { Button } from "./components/ui/button"


function getInitialParameters(): Parameters {
  return {
    initialPopulation: 10,
    iterationsPerFrame: 5000,
    maxCreatures: 1000
  }
}

function getInitialSpecies(): Species[] {
  return [{
    id: 0,
    traits: {
      timeToMultiply: 20,
      lifeLenght: 50,
      timeToMature: 10,
      mutationChance: 0.0001,
      mutationRate: 0.05
    }
  }]
}


function App() {
  const [parameters, setParameters] = useState<Parameters>(getInitialParameters())
  const [traits, setTraits] = useState<Traits>({
      timeToMultiply: 20,
      lifeLenght: 50,
      timeToMature: 10,
      mutationChance: 0.0001,
      mutationRate: 0.05
    } as Traits)
  const [committedParameters, setCommittedParameters] = useState<Parameters>(getInitialParameters())
  const [restartKey, setRestartKey] = useState(0)
  const speciesRef = useRef<Species[]>(getInitialSpecies())

  useEffect(() => {

  }, [])

  function restartSimulation() {
    speciesRef.current = getInitialSpecies()
    setCommittedParameters(parameters)
    setRestartKey(restartKey+1)
  }

  function setParameter(parameter: keyof Parameters, value: any) {
    setParameters({...parameters, [parameter]: value} )
  }

  return (
    <div className='min-h-[100dvh] min-w-full flex items-center justify-center p-[2dvh] bg-neutral-950'>
      <div className='flex gap-8 w-full max-w-[96dvw] h-[96dvh]'>

      {/* Simulation visual area */}
      <Card className="flex-1 aspect-square bg-neutral-900 p-0 overflow-hidden max-h-full min-w-[96dvh] max-w-[96dvh] border-neutral-800 text-neutral-200">
        <Simulation 
          key={restartKey}
          parameters={committedParameters}
          speciesRef={speciesRef}
        />
      </Card>

      {/* Sidebar */}
      <Card className="grow h-full p-6 bg-neutral-900 grow flex flex-col justify-between border-neutral-800 text-neutral-200">
        <div className="space-y-4 flex flex-col">
          <span className="text-center">Parameters</span>
          <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label>
                  Initial population
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon color="white" width='1rem' height='1rem'/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The initial population<br/>at the start of the<br/>simulation</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                
                <span className="text-sm text-violet-300">{parameters.initialPopulation}</span>
              </div>
              <Slider
                value={[parameters.initialPopulation]}
                onValueChange={([value]) => setParameter("initialPopulation",value)}
                min={10}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label>
                  Iterations/Frame
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon color="white" width='1rem' height='1rem'/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Amount of iterations<br/>performed before each<br/>frame is rendered</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                
                <span className="text-sm text-violet-300">{parameters.iterationsPerFrame}</span>
              </div>
              <Slider
                value={[parameters.iterationsPerFrame]}
                onValueChange={([value]) => setParameter("iterationsPerFrame",value)}
                min={10}
                max={1000}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className='flex items-center justify-between'>
                <Label>
                  Max Population
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon color="white" width='1rem' height='1rem'/>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum allowed population</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                
                <span className="text-sm text-violet-300">{parameters.maxCreatures}</span>
              </div>
              <Slider
                value={[parameters.maxCreatures]}
                onValueChange={([value]) => setParameter("maxCreatures",value)}
                min={100}
                max={10000}
                step={1}
                className="w-full"
              />
            </div>
        </div>


        <Button onClick={restartSimulation}
          className="bg-violet-800 border-violet-700 border hover:bg-violet-700 border-violet-600 cursor-pointer"
        >
          Restart
        </Button>
      </Card>
      </div>
    </div>
  )
}

export default App