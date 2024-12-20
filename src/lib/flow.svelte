<script lang="ts">
  import { writable, get } from "svelte/store"
  import { SvelteFlow, Background, Controls } from "@xyflow/svelte"

  import ColorPickerNode from "./colorPickerNode.svelte"
  import NodeServer from "./node_server.svelte"
  import NodeUser from "./node_user.svelte"

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css"

  // ███    ██  ██████  ██████  ███████ ███████
  // ████   ██ ██    ██ ██   ██ ██      ██
  // ██ ██  ██ ██    ██ ██   ██ █████   ███████
  // ██  ██ ██ ██    ██ ██   ██ ██           ██
  // ██   ████  ██████  ██████  ███████ ███████

  const nodes = writable([
    {
      id: "1", // required and needs to be a string
      position: { x: 0, y: 63 }, // required
      type: "userNode",
      data: {
        userNode: writable({
          name: "User",
          type: "start",
          mapped_user_journeys: [
            {
              user_journey_id: "uj1",
              number_of_users: 200,
              how_many_added: 0,
            },
            {
              user_journey_id: "uj2",
              number_of_users: 300,
              how_many_added: 0,
            },
          ],
        }),
      }, // required
    },
    {
      id: "4",
      position: { x: 300, y: 0 },
      type: "serverNode",
      data: {
        serverNode: writable({
          name: "webserver",
          type: "webserver",
          currentResources: { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
          maxResources: { cpu: 1000, memory: 4096, storage: 10000, bandwidth: 1000 },
          usecases: [
            {
              id: "someId10",
              name: "UC01",
              description: "some description",
              duration: 1,
              resourceCost: { cpu: 5, memory: 75, storage: 5, bandwidth: 5 },
            },
            {
              id: "someId",
              name: "UC1",
              description: "some description",
              duration: 3,
              resourceCost: { cpu: 10, memory: 150, storage: 10, bandwidth: 11 },
            },
            {
              id: "someId2",
              name: "UC2",
              description: "some description",
              duration: 10,
              resourceCost: { cpu: 100, memory: 250, storage: 600, bandwidth: 210 },
            },
          ],
          failedCalls: [] as FailedCall[],
          activeUsers: 0,
        }),
      },
    },
    {
      id: "5",
      position: { x: 525, y: 0 },
      type: "serverNode",
      data: {
        serverNode: writable({
          name: "api",
          type: "api",
          currentResources: { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
          maxResources: { cpu: 1000, memory: 4096, storage: 10000, bandwidth: 1000 },
          usecases: [
            {
              id: "someotherID",
              name: "UC1",
              description: "something",
              duration: 2,
              resourceCost: { cpu: 5, memory: 64, storage: 5, bandwidth: 10 },
            },
          ],
          failedCalls: [] as FailedCall[],
          activeUsers: 0,
        }),
      },
    },
    {
      id: "6",
      position: { x: 750, y: 0 },
      type: "serverNode",
      data: {
        serverNode: writable({
          name: "database",
          type: "database",
          currentResources: { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
          maxResources: { cpu: 1000, memory: 4096, storage: 10000, bandwidth: 1000 },
          usecases: [],
          failedCalls: [] as FailedCall[],
          activeUsers: 0,
        }),
      },
    },
  ])

  // ███████ ██████   ██████  ███████ ███████
  // ██      ██   ██ ██       ██      ██
  // █████   ██   ██ ██   ███ █████   ███████
  // ██      ██   ██ ██    ██ ██           ██
  // ███████ ██████   ██████  ███████ ███████

  const edges = writable([
    { id: "1-4", source: "1", target: "4" },
    { id: "4-5", source: "4", target: "5" },
    { id: "5-6", source: "5", target: "6" },
  ])

  //      ██  ██████  ██    ██ ██████  ███    ██ ███████ ██    ██ ███████
  //      ██ ██    ██ ██    ██ ██   ██ ████   ██ ██       ██  ██  ██
  //      ██ ██    ██ ██    ██ ██████  ██ ██  ██ █████     ████   ███████
  // ██   ██ ██    ██ ██    ██ ██   ██ ██  ██ ██ ██         ██         ██
  //  █████   ██████   ██████  ██   ██ ██   ████ ███████    ██    ███████

  const userjourneys = writable<UserJourney[]>([
    {
      id: "uj1",
      steps: [
        {
          step_id: 1,
          node_type: "webserver",
          resource_cost: { cpu: 1, memory: 2, storage: 1, bandwidth: 15 },
          duration: 3,
          mapped_node_id: "4",
          step_processing: false,
        },
        {
          step_id: 2,
          node_type: "api",
          resource_cost: { cpu: 10, memory: 2, storage: 1, bandwidth: 15 },
          duration: 2,
          mapped_node_id: "5",
          step_processing: false,
        },
        {
          step_id: 3,
          node_type: "database",
          resource_cost: { cpu: 100, memory: 2, storage: 1, bandwidth: 15 },
          duration: 1,
          mapped_node_id: "6",
          step_processing: false,
        },
      ],
    },
    {
      id: "uj2",
      steps: [
        {
          step_id: 1,
          node_type: "webserver",
          resource_cost: { cpu: 1, memory: 2, storage: 1, bandwidth: 5 },
          duration: 3,
          mapped_node_id: "4",
          step_processing: false,
        },
        {
          step_id: 2,
          node_type: "api",
          resource_cost: { cpu: 1, memory: 2, storage: 1, bandwidth: 5 },
          duration: 2,
          mapped_node_id: "5",
          step_processing: false,
        },
        {
          step_id: 3,
          node_type: "database",
          resource_cost: { cpu: 1, memory: 2, storage: 1, bandwidth: 5 },
          duration: 2,
          mapped_node_id: "6",
          step_processing: false,
        },
      ],
    },
  ])

  // ███    ██  ██████  ██████  ███████     ████████ ██    ██ ██████  ███████ ███████
  // ████   ██ ██    ██ ██   ██ ██             ██     ██  ██  ██   ██ ██      ██
  // ██ ██  ██ ██    ██ ██   ██ █████          ██      ████   ██████  █████   ███████
  // ██  ██ ██ ██    ██ ██   ██ ██             ██       ██    ██      ██           ██
  // ██   ████  ██████  ██████  ███████        ██       ██    ██      ███████ ███████

  const nodeTypes = {
    colorPicker: ColorPickerNode,
    serverNode: NodeServer,
    userNode: NodeUser,
  }

  // ██ ███    ██ ████████ ███████ ██████  ██    ██  █████  ██
  // ██ ████   ██    ██    ██      ██   ██ ██    ██ ██   ██ ██
  // ██ ██ ██  ██    ██    █████   ██████  ██    ██ ███████ ██
  // ██ ██  ██ ██    ██    ██      ██   ██  ██  ██  ██   ██ ██
  // ██ ██   ████    ██    ███████ ██   ██   ████   ██   ██ ███████

  let intervalRunningUsers: boolean = false
  let intervalUsers: number
  let intervalRunning: boolean = false
  let interval: number
  let simulatedUsers: SimulatedUser[] = []
  $: currentUsers = simulatedUsers.length

  function startIntervalUsers() {
    if (intervalRunningUsers) return
    intervalRunningUsers = true
    intervalUsers = setInterval(() => {
      addUsers()
    }, 1000)
  }
  function stopIntervalUsers() {
    clearInterval(intervalUsers)
    intervalRunningUsers = false
  }

  function startInterval() {
    if (intervalRunning) return
    intervalRunning = true
    interval = setInterval(() => {
      runTestPerformance()
    }, 1000)
  }

  function stopInterval() {
    clearInterval(interval)
    intervalRunning = false
  }

  // ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  // ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  // █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  // ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  // ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████

  function addUsers() {
    let numOfUsers = Math.floor(Math.random() * 11)
    console.log("addUsers", numOfUsers)

    for (let i = 0; i <= numOfUsers; i++) {
      console.log("numOfUsers", numOfUsers, i)
      let availableSystems = ["4", "5"]
      simulatedUsers.push({
        id: (Math.random() + 1).toString(36).substring(7),
        processing: false,
        duration: 0,
        systemTargetID: availableSystems[Math.floor(Math.random() * availableSystems.length)],
        resourceCost: { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
        userJourney: {} as UserJourney,
      })
    }
  }

  let failedCalls: FailedCall[] = []

  function allocateUsers(amountOfUsers: number, useCases: UserJourneyStep[], systemCapacity) {
    const overutilizedResource = Object.keys(systemCapacity).find((resource) => {
      const totalDemand = useCases.reduce(
        (acc, useCase) => acc + amountOfUsers * useCase.resource_cost[resource],
        0
      )
      return totalDemand > systemCapacity[resource]
    })

    if (!overutilizedResource) {
      return useCases.map((useCase) => 0) // No overutilization, all users can be allocated
    }

    const maxCapacity = systemCapacity[overutilizedResource]
    const totalDemand = useCases.reduce(
      (acc, useCase) => acc + amountOfUsers * useCase.resource_cost[overutilizedResource],
      0
    )
    const excessDemand = totalDemand - maxCapacity

    const allocatedUsers = useCases.map((useCase) => {
      const maxUsers = Math.floor(maxCapacity / useCase.resource_cost[overutilizedResource])
      let ration = maxUsers / useCases.length
      // const rejectedUsers = Math.ceil(excessDemand / useCases.length)
      console.log({ maxUsers, ration })
      if (ration > amountOfUsers) ration = amountOfUsers
      return Math.max(0, ration)
    })

    console.log("allocatedUsers", allocatedUsers, {
      overutilizedResource,
      totalDemand,
      excessDemand,
      maxCapacity,
    })

    return useCases.map((useCase, index) => amountOfUsers - allocatedUsers[index])
  }

  function calculateRejectedUsers(
    amountOfUsers: number,
    ujss: UserJourneyStep[],
    sr: SystemResources
  ) {
    // Calculate total resource demand for each resource type
    // const totalDemand: Map<string, any> = new Map<string, any>();
    // let totalDemand: SystemResources = {cpu: 0, memory: 0, storage: 0, bandwidth: 0};
    const totalDemand = {}
    for (const ujs of ujss) {
      // totalDemand.cpu = totalDemand.cpu + ujs.resource_cost.cpu * amountOfUsers;
      // totalDemand.memory = totalDemand.memory + ujs.resource_cost.memory * amountOfUsers;
      // totalDemand.storage = totalDemand.storage + ujs.resource_cost.storage * amountOfUsers;
      // totalDemand.bandwidth = totalDemand.bandwidth + ujs.resource_cost.bandwidth * amountOfUsers;

      for (const [key, value] of Object.entries(ujs.resource_cost)) {
        totalDemand[key] = (totalDemand[key] || 0) + amountOfUsers * value
        // totalDemand[key] = (totalDemand[key] || 0) + amountOfUsers * value;
      }
    }

    // Identify overutilized resources
    // const overutilizedResources = Object.keys(totalDemand).filter(resource => totalDemand[resource as keyof SystemResources] > sr[resource as keyof SystemResources]);
    const overutilizedResources = Object.keys(totalDemand).filter(
      (resource) => totalDemand[resource] > sr[resource]
    )

    // // Calculate rejection ratios for each use case
    // const rejectionRatios = ujss.map((useCase) => {
    //   let minRatio = 1
    //   for (const resource of overutilizedResources) {
    //     const resourceRatio =
    //       (totalDemand[resource] - sr[resource]) / (amountOfUsers * useCase.resource_cost[resource])
    //     console.log(
    //       "resourceRation for",
    //       resource,
    //       resourceRatio,
    //       totalDemand[resource],
    //       sr[resource],
    //       useCase.resource_cost[resource]
    //     )
    //     // minRatio = Math.min(minRatio, resourceRatio)
    //     minRatio = Math.min(minRatio, resourceRatio)
    //   }
    //   return minRatio
    // })

    //     // Calculate the number of rejected users for each use case
    //     const rejectedUsers = ujss.map((useCase, index) => {
    //   return Math.floor(amountOfUsers * rejectionRatios[index])
    // })

    const rejectedUsers = ujss.map((useCase) => {
      let maxRatio = 0
      for (const resource in totalDemand) {
        if (totalDemand[resource] > sr[resource]) {
          const resourceRatio = Math.min(
            1,
            (totalDemand[resource] - sr[resource]) /
              (amountOfUsers * useCase.resource_cost[resource])
          )
          maxRatio = Math.max(maxRatio, resourceRatio)
        }
      }
      console.log("max ration", maxRatio)
      return Math.floor(amountOfUsers * maxRatio)
    })

    // console.log({ totalDemand, overutilizedResources, rejectionRatios, rejectedUsers })
    console.log({ totalDemand, overutilizedResources, rejectedUsers })

    return rejectedUsers
  }

  function runTestPerformance() {
    // 1. loop through user journeys and add users to simulatedUsers
    // either shuffel simulatedUsers to allow for failing requests
    // or calculate all users at once to minimize calculations but then how do we fail users?
    // 2. loop through simulatedUsers and apply costs

    // uj1 200 system

    let startTime = performance.now()

    let copyOfuserjourneys = get(userjourneys)

    for (let node of $nodes) {
      if (node.type === "userNode" && node.data.userNode) {
        const { mapped_user_journeys } = get(node.data.userNode)

        let jobsOK: number = 0

        while (jobsOK < mapped_user_journeys.length) {
          // console.log("while is running", jobsOK, mapped_user_journeys.length, mapped_user_journeys)
          for (let muj of mapped_user_journeys) {
            if (muj.how_many_added === muj.number_of_users) {
              muj.how_many_added += 1
              jobsOK += 1
              // console.log(`adding ${muj.user_journey_id} to jobsOK = ${jobsOK}`)
              break
            }
            if (muj.how_many_added < muj.number_of_users) {
              for (let uj of $userjourneys) {
                if (uj.id === muj.user_journey_id) {
                  // add amount of users of this userjourney to the simulatedUsers
                  simulatedUsers.push({
                    id: (Math.random() + 1).toString(36).substring(7),
                    processing: false,
                    duration: 0,
                    systemTargetID: "",
                    resourceCost: { cpu: 0, memory: 0, storage: 0, bandwidth: 0 },
                    // userJourney: Object.assign({}, uj),
                    userJourney: JSON.parse(JSON.stringify(uj)),
                  })

                  muj.how_many_added += 1
                  // console.log(
                  //   `adding user ${muj.how_many_added} of ${muj.number_of_users} for ${muj.user_journey_id}`
                  // )

                  break // userjourneys
                }
              }
            }
          }
        }

        // cleanup
        for (let muj of mapped_user_journeys) {
          muj.how_many_added = 0
        }
      }
    }

    let endTime = performance.now()
    let executionTime = endTime - startTime
    console.log(`Execution time: ${executionTime} milliseconds`)
    // return

    startTime = performance.now()

    for (let user of simulatedUsers) {
      console.log("➡️ [USER]:", user.id, "and journey:", user.userJourney.id)
      // if (!user.processing)
      for (let ujs of user.userJourney.steps) {
        if (user.duration === -1) {
          console.log(user.id, ujs.step_id, "💥 BREAKING - ujs")
          break
        }
        console.log(user.id, ujs.step_id, "getting step", JSON.stringify(ujs))
        for (let node of $nodes) {
          if (node.data.serverNode && node.id === ujs.mapped_node_id) {
            let { currentResources, maxResources } = get(node.data.serverNode)
            if (!ujs.step_processing) {
              ujs.step_processing = true

              let reasons: string[] = []
              if (currentResources.cpu + ujs.resource_cost.cpu > maxResources.cpu) {
                reasons.push("no cpu left")
                ujs.duration = -1
                user.duration = -1
              }
              if (currentResources.memory + ujs.resource_cost.memory > maxResources.memory) {
                reasons.push("no memory left")
                ujs.duration = -1
                user.duration = -1
              }
              if (currentResources.storage + ujs.resource_cost.storage > maxResources.storage) {
                reasons.push("no storage left")
                ujs.duration = -1
                user.duration = -1
              }
              if (
                currentResources.bandwidth + ujs.resource_cost.bandwidth >
                maxResources.bandwidth
              ) {
                reasons.push("no bandwidth left")
                ujs.duration = -1
                user.duration = -1
              }

              if (reasons.length > 0) {
                failedCalls.push({ user, reasons })
                console.log(user.id, ujs.step_id, "🎈 user dropped because", user, reasons)
                node.data.serverNode.update((old) => ({
                  ...old,
                  failedCalls: [...old.failedCalls, { user: user, reasons: reasons }],
                }))
                console.log(user.id, ujs.step_id, "💥 BREAKING - reason")
                break
              }

              if (ujs.duration > 0) {
                node.data.serverNode.update((old) => {
                  console.log(
                    user.id,
                    ujs.step_id,
                    "adding resources to",
                    node.id,
                    ujs.resource_cost.cpu
                  )
                  return {
                    ...old,
                    currentResources: {
                      cpu: old.currentResources.cpu + ujs.resource_cost.cpu,
                      memory: old.currentResources.memory + ujs.resource_cost.memory,
                      storage: old.currentResources.storage + ujs.resource_cost.storage,
                      bandwidth: old.currentResources.bandwidth + ujs.resource_cost.bandwidth,
                    },
                    activeUsers: old.activeUsers + 1,
                  }
                })
              }
            }

            // Drop of used resources in two steps
            if (ujs.duration === 0) {
              console.log(
                user.id,
                ujs.step_id,
                "removing resources part1",
                -ujs.resource_cost.cpu * 0.5
              )
              node.data.serverNode.update((old) => ({
                ...old,
                currentResources: {
                  cpu: Math.max(old.currentResources.cpu - ujs.resource_cost.cpu * 0.5, 0),
                  memory: Math.max(old.currentResources.memory - ujs.resource_cost.memory * 0.5, 0),
                  storage: Math.max(
                    old.currentResources.storage - ujs.resource_cost.storage * 0.5,
                    0
                  ),
                  bandwidth: Math.max(
                    old.currentResources.bandwidth - ujs.resource_cost.bandwidth * 0.5,
                    0
                  ),
                },
              }))
            }
            if (ujs.duration === -1) {
              user.duration = -1
              console.log(
                user.id,
                ujs.step_id,
                "removing resources part2",
                -ujs.resource_cost.cpu * 0.5
              )
              node.data.serverNode.update((old) => ({
                ...old,
                currentResources: {
                  cpu: Math.max(old.currentResources.cpu - ujs.resource_cost.cpu * 0.5, 0),
                  memory: Math.max(old.currentResources.memory - ujs.resource_cost.memory * 0.5, 0),
                  storage: Math.max(
                    old.currentResources.storage - ujs.resource_cost.storage * 0.5,
                    0
                  ),
                  bandwidth: Math.max(
                    old.currentResources.bandwidth - ujs.resource_cost.bandwidth * 0.5,
                    0
                  ),
                },
                activeUsers: Math.max(old.activeUsers - 1, 0),
              }))
            }

            if (ujs.duration >= 0) {
              ujs.duration -= 1
              console.log(user.id, ujs.step_id, "ujs.duration is now", ujs.duration)
            }
          }
        }
      }

      // for (let node of $nodes) {
      //   if (node.data.serverNode && node.id === user.systemTargetID) {
      //     let { currentResources, maxResources, usecases } = get(node.data.serverNode)
      //     // console.log("name", name, currentResources, maxResources)
      //     if (!user.processing) {
      //       user.processing = true
      //       let selectedUsecase = usecases[Math.floor(Math.random() * usecases.length)]
      //       user.duration = selectedUsecase.duration
      //       user.resourceCost = selectedUsecase.resourceCost

      //       let reasons: string[] = []
      //       if (currentResources.cpu + selectedUsecase.resourceCost.cpu > maxResources.cpu) {
      //         reasons.push("no cpu left")
      //         user.duration = -1
      //       }
      //       if (
      //         currentResources.memory + selectedUsecase.resourceCost.memory >
      //         maxResources.memory
      //       ) {
      //         reasons.push("no memory left")
      //         user.duration = -1
      //       }
      //       if (
      //         currentResources.storage + selectedUsecase.resourceCost.storage >
      //         maxResources.storage
      //       ) {
      //         reasons.push("no storage left")
      //         user.duration = -1
      //       }
      //       if (
      //         currentResources.bandwidth + selectedUsecase.resourceCost.bandwidth >
      //         maxResources.bandwidth
      //       ) {
      //         reasons.push("no bandwidth left")
      //         user.duration = -1
      //       }

      //       if (reasons.length > 0) {
      //         failedCalls.push({ user, reasons })
      //         console.log("user dropped because", user, reasons)
      //         node.data.serverNode.update((old) => ({
      //           ...old,
      //           failedCalls: [...old.failedCalls, { user: user, reasons: reasons }],
      //         }))
      //       }

      //       if (user.duration > 0) {
      //         node.data.serverNode.update((old) => {
      //           console.log("adding resources", user.id, user.resourceCost.cpu)
      //           return {
      //             ...old,
      //             currentResources: {
      //               cpu: old.currentResources.cpu + user.resourceCost.cpu,
      //               memory: old.currentResources.memory + user.resourceCost.memory,
      //               storage: old.currentResources.storage + user.resourceCost.storage,
      //               bandwidth: old.currentResources.bandwidth + user.resourceCost.bandwidth,
      //             },
      //             activeUsers: old.activeUsers + 1,
      //           }
      //         })
      //       }
      //     }
      //     if (user.duration >= 0) {
      //       user.duration -= 1
      //     }

      //     // Drop of used resources in two steps
      //     if (user.duration === 0) {
      //       console.log("removing resources part1", user.id, -user.resourceCost.cpu * 0.5)
      //       node.data.serverNode.update((old) => ({
      //         ...old,
      //         currentResources: {
      //           cpu: Math.max(old.currentResources.cpu - user.resourceCost.cpu * 0.5, 0),
      //           memory: Math.max(old.currentResources.memory - user.resourceCost.memory * 0.5, 0),
      //           storage: Math.max(
      //             old.currentResources.storage - user.resourceCost.storage * 0.5,
      //             0
      //           ),
      //           bandwidth: Math.max(
      //             old.currentResources.bandwidth - user.resourceCost.bandwidth * 0.5,
      //             0
      //           ),
      //         },
      //       }))
      //     }
      //     if (user.duration === -1) {
      //       console.log("removing resources part2", user.id, -user.resourceCost.cpu * 0.5)
      //       node.data.serverNode.update((old) => ({
      //         ...old,
      //         currentResources: {
      //           cpu: Math.max(old.currentResources.cpu - user.resourceCost.cpu * 0.5, 0),
      //           memory: Math.max(old.currentResources.memory - user.resourceCost.memory * 0.5, 0),
      //           storage: Math.max(
      //             old.currentResources.storage - user.resourceCost.storage * 0.5,
      //             0
      //           ),
      //           bandwidth: Math.max(
      //             old.currentResources.bandwidth - user.resourceCost.bandwidth * 0.5,
      //             0
      //           ),
      //         },
      //         activeUsers: Math.max(old.activeUsers - 1, 0),
      //       }))
      //     }
      //   }
      // }
    }

    $nodes = $nodes

    simulatedUsers = simulatedUsers.filter((item) => item.duration !== -1)

    endTime = performance.now()
    executionTime = endTime - startTime
    console.log(`Execution time: ${executionTime} milliseconds`)
  }

  function checkArrays() {
    console.log(
      "simulatedUsers",
      simulatedUsers,
      "nodes",
      $nodes,
      "failedCalls",
      failedCalls,
      "userjourneys",
      $userjourneys
    )
  }

  function resetArrays() {
    simulatedUsers = []
    failedCalls = []
  }
</script>

<!-- 
██   ██ ████████ ███    ███ ██      
██   ██    ██    ████  ████ ██      
███████    ██    ██ ████ ██ ██      
██   ██    ██    ██  ██  ██ ██      
██   ██    ██    ██      ██ ███████ 
-->

<div class="flow">
  <div class="flowContainer">
    <SvelteFlow {nodes} {edges} {nodeTypes} fitView attributionPosition="top-right">
      <Background bgColor="rgba(126,159,219,0.5)" patternColor="black" />
      <Controls showLock={false} buttonColor="rgba(0,0,0,1)" />
    </SvelteFlow>
  </div>
  <button on:click={addUsers}>add Users</button>
  <button on:click={startIntervalUsers}>start Users</button>
  <button on:click={stopIntervalUsers}>stop Users</button>
  <button on:click={startInterval}>start</button>
  <button on:click={stopInterval}>stop</button>
  <div>Interval running: {intervalRunning}</div>
  <div>currentUsers: {currentUsers}</div>
  <div>failedCalls: {failedCalls.length}</div>

  <button on:click={checkArrays}>checkArrays</button>
  <button on:click={resetArrays}>reset Arrays</button>
  <button on:click={runTestPerformance}>runTestPerformance</button>
  <button
    on:click={() =>
      allocateUsers(200, $userjourneys[0].steps, get($nodes[2].data.serverNode!).maxResources)}
    >allocatedUsers</button
  >
</div>

<!-- 
███████ ████████ ██    ██ ██      ███████ ███████ 
██         ██     ██  ██  ██      ██      ██      
███████    ██      ████   ██      █████   ███████ 
     ██    ██       ██    ██      ██           ██ 
███████    ██       ██    ███████ ███████ ███████ 
-->

<style>
  .flow {
    margin: 0 auto;
    margin-top: 50px;
    width: 900px;
    height: 600px;
  }
  .flowContainer {
    display: block;
    height: 100%;
  }

  @media (prefers-color-scheme: dark) {
    button {
      color: #2f2f2f;
    }
    .flowContainer {
      color: black;
    }
  }
</style>
