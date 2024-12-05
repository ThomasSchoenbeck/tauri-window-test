
interface UseCase {
  id: string
  name: string
  description: string
  duration: number
  resourceCost: SystemResources
  dependency?: UseCase
}

interface SystemResources {
  cpu: number
  memory: number
  storage: number
  bandwidth: number
}

interface ServerNode {
  name: string
  currentResources?: SystemResources
  maxResources: SystemResources
  usecases: UseCase[]
  failedCalls: FailedCall[]
  activeUsers: number
}

interface SimulatedUser {
  id: string
  processing: boolean
  duration: number
  systemTargetID: string
  resourceCost: SystemResources
}


interface FailedCall {
  user: SimulatedUser
  reasons: string[]
}