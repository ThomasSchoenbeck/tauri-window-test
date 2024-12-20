interface UseCase {
  id: string
  name: string
  description: string
  duration: number
  resourceCost: SystemResources
  dependency?: UseCase
}

interface SystemResourcesIndex {
  cpu: "cpu"
  memory: "memory"
  storage: "storage"
  bandwidth: "bandwidth"
}

interface SystemResources {
  cpu: number
  memory: number
  storage: number
  bandwidth: number
}

interface ServerNode {
  name: string
  type: string | "webserver"
  proxy
  api
  database
  firewall
  loadbalancer
  currentResources?: SystemResources
  maxResources: SystemResources
  usecases: UseCase[]
  failedCalls: FailedCall[]
  activeUsers: number
}

interface UserNode {
  name: string
  type: string | "start"
  mapped_user_journeys: {
    user_journey_id: string
    number_of_users: number
    how_many_added: number
  }[]
}

interface SimulatedUser {
  id: string
  processing: boolean
  duration: number
  systemTargetID: string
  resourceCost: SystemResources
  userJourney: UserJourney
}

interface FailedCall {
  user: SimulatedUser
  reasons: string[]
}

interface UserJourney {
  id: string // uj1
  steps: UserJourneyStep[]
}

interface UserJourneyStep {
  step_id: number // 1
  node_type: string // || "webserver"
  resource_cost: SystemResources
  duration: number // 1
  mapped_node_id: string // 1
  users?: number
  step_processing: boolean
}
