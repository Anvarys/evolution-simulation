import { Card } from "./components/ui/card"
import Simulation from "./Simulation"
import { useEffect, useRef, useState } from "react"
import type { Parameters, Species, Traits } from "./types"
import { Slider } from "./components/ui/slider"
import { Label } from "./components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "./components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Checkbox } from "./components/ui/checkbox"


function getInitialParameters(): Parameters {
  return {
    initialPopulation: 10,
    iterationsPerFrame: 5000,
    maxCreatures: 1000
  }
}

function App() {
  const [parameters, setParameters] = useState<Parameters>(getInitialParameters())
  const [traitsInput, setTraitsInput] = useState({
      timeToMultiply: "20",
      lifeLenght: "50",
      timeToMature: "10",
      mutationChance: "0.0001",
      mutationRate: "0.05"
    })
  const [committedParameters, setCommittedParameters] = useState<Parameters>(getInitialParameters())
  const [restartKey, setRestartKey] = useState(0)
  const speciesRef = useRef<Species[]>([getInitialSpecies()])
  const [restartOnUpdate, setRestartOnUpdate] = useState<boolean>(false)

  useEffect(() => {
    if (restartOnUpdate) {
      restartSimulation()
    }
  }, [parameters, traitsInput])

  function getInitialSpecies(): Species {
    return {
      id: 0,
      traits: {
        timeToMultiply: Number(traitsInput.timeToMultiply),
        lifeLenght: Number(traitsInput.lifeLenght),
        timeToMature: Number(traitsInput.timeToMature),
        mutationChance: Number(traitsInput.mutationChance),
        mutationRate: Number(traitsInput.mutationRate)
      } as Traits
    }
  }

  function restartSimulation() {
    speciesRef.current = [getInitialSpecies()]
    setCommittedParameters(parameters)
    setRestartKey(restartKey+1)
  }

  function setParameter(parameter: keyof Parameters, value: any) {
    setParameters({...parameters, [parameter]: value} )
  }

  function areParametersValid(): boolean {
    const initialSpecies = getInitialSpecies()
    for (const trait in initialSpecies.traits){
      if (Number.isNaN(initialSpecies.traits[trait as keyof Traits])) {
        return false
      }
    }
    return true
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
      <Card className="grow h-full p-6 bg-neutral-900 grow flex flex-col border-neutral-800 text-neutral-200">
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

        <div className="flex flex-col gap-3">
          <span className="text-center">Initial species</span>
          <div className="flex flex-col justify-between gap-1">
            <Label className="text-[var(--life-length)]">Life length
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width='1rem' height='1rem'/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Life length of creatures</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              inputMode="numeric"
              placeholder="42"
              value={traitsInput.lifeLenght}
              aria-invalid={Number.isNaN(Number(traitsInput.lifeLenght))}
              min={1}
              onChange={(e) => {
                setTraitsInput({...traitsInput, lifeLenght: e.target.value.replace(/[^0-9\.]/g, "")})
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <Label className="text-[var(--time-to-mature)]">Time to mature
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width="1rem" height="1rem"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time that the creature<br/>needs to live until<br/>it can multiply</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              inputMode="numeric"
              placeholder="42"
              value={traitsInput.timeToMature}
              aria-invalid={Number.isNaN(Number(traitsInput.timeToMature))}
              min={1}
              onChange={(e) => {
                setTraitsInput({...traitsInput, timeToMature: e.target.value.replace(/[^0-9\.]/g, "")})
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <Label className="text-[var(--time-to-multiply)]">Time to multiply
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width="1rem" height="1rem"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time a creature<br/>takes to multiply</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              inputMode="numeric"
              placeholder="42"
              value={traitsInput.timeToMultiply}
              aria-invalid={Number.isNaN(Number(traitsInput.timeToMultiply))}
              min={1}
              onChange={(e) => {
                setTraitsInput({...traitsInput, timeToMultiply: e.target.value.replace(/[^0-9\.]/g, "")})
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <Label className="text-[var(--mutation-chance)]">Mutation chance
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width="1rem" height="1rem"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Probabilty of a mutation of<br/>a gene in an offspring</p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              inputMode="numeric"
              placeholder="0.42"
              value={traitsInput.mutationChance}
              aria-invalid={Number.isNaN(Number(traitsInput.mutationChance))}
              min={1}
              onChange={(e) => {
                setTraitsInput({...traitsInput, mutationChance: e.target.value.replace(/[^0-9\.]/g, "")})
              }}
            />
          </div>

          <div className="flex flex-col justify-between gap-1">
            <Label className="text-[var(--mutation-rate)]">Mutation rate
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width="1rem" height="1rem"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Max proportion of the gene mutation<br/><br/>Example:<br/>Trait's value is <span className="text-violet-200">100</span> and mutation rate<br/>is <span className="text-violet-200">0.1</span>, then when gene mutates it would<br/>change by <span className="text-violet-200">±5</span> from <span className="text-violet-200">-100*0.1/2</span> to <span className="text-violet-200">+100*0.1/2</span></p>
                </TooltipContent>
              </Tooltip>
            </Label>
            <Input
              inputMode="numeric"
              placeholder="0.42"
              value={traitsInput.mutationRate}
              aria-invalid={Number.isNaN(Number(traitsInput.mutationRate))}
              min={1}
              onChange={(e) => {
                setTraitsInput({...traitsInput, mutationRate: e.target.value.replace(/[^0-9\.]/g, "")})
              }}
            />
          </div>
        </div>
        <div className="flex-1 w-full flex flex-col justify-end gap-2">
          <div className="flex flex-row justify-between items-center">
            <Checkbox onCheckedChange={(checked: boolean) => {setRestartOnUpdate(checked)}}/>
            <Label>Restart on update
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon color="white" width="1rem" height="1rem"/>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Automatically restarts the<br/>simulation after you change<br/>any parameter</p>
                </TooltipContent>
              </Tooltip>
            </Label>
          </div>

          <Button onClick={restartSimulation}
            className="bg-violet-800 border-violet-700 border hover:bg-violet-700 border-violet-600 cursor-pointer"
            disabled={!areParametersValid()}
          >
            Restart
          </Button>
        </div>
      </Card>
      </div>
    </div>
  )
}

export default App