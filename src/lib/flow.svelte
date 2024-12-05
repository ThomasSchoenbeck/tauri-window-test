<script lang="ts">
  import { writable, get } from "svelte/store"
  import { SvelteFlow, Background, Controls } from "@xyflow/svelte"

  import ColorPickerNode from "./colorPickerNode.svelte"
  import NodeServer from "./node_server.svelte"

  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import "@xyflow/svelte/dist/style.css"
  import { fail } from "@sveltejs/kit"

  const nodes = writable([
    {
      id: "1", // required and needs to be a string
      position: { x: 0, y: 0 }, // required
      data: { label: "hey" }, // required
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "world" },
    },
    {
      id: "3",
      position: { x: 500, y: 10 },
      type: "colorPicker",
      data: { color: writable("#ff4000") },
    },
    {
      id: "4",
      position: { x: 80, y: 180 },
      type: "serverNode",
      data: {
        serverNode: writable({
          name: "Testserver",
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
      position: { x: 400, y: 160 },
      type: "serverNode",
      data: {
        serverNode: writable({
          name: "Testserver 2",
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
  ])
  const edges = writable([
    { id: "1-2", source: "1", target: "2" },
    { id: "4-5", source: "4", target: "5" },
  ])

  const nodeTypes = {
    colorPicker: ColorPickerNode,
    serverNode: NodeServer,
  }

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
      })
    }
  }

  let failedCalls: FailedCall[] = []

  function runTestPerformance() {
    for (let user of simulatedUsers) {
      // for (let node of newNodes) {
      for (let node of $nodes) {
        if (node.data.serverNode && node.id === user.systemTargetID) {
          let { currentResources, maxResources, usecases } = get(node.data.serverNode)
          // console.log("name", name, currentResources, maxResources)
          if (!user.processing) {
            user.processing = true
            let selectedUsecase = usecases[Math.floor(Math.random() * usecases.length)]
            user.duration = selectedUsecase.duration
            user.resourceCost = selectedUsecase.resourceCost

            let reasons: string[] = []
            if (currentResources.cpu + selectedUsecase.resourceCost.cpu > maxResources.cpu) {
              reasons.push("no cpu left")
              user.duration = -1
            }
            if (currentResources.memory + selectedUsecase.resourceCost.memory > maxResources.memory) {
              reasons.push("no memory left")
              user.duration = -1
            }
            if (currentResources.storage + selectedUsecase.resourceCost.storage > maxResources.storage) {
              reasons.push("no storage left")
              user.duration = -1
            }
            if (currentResources.bandwidth + selectedUsecase.resourceCost.bandwidth > maxResources.bandwidth) {
              reasons.push("no bandwidth left")
              user.duration = -1
            }

            if (reasons.length > 0) {
              failedCalls.push({ user, reasons })
              console.log("user dropped because", user, reasons)
              node.data.serverNode.update((old) => ({ ...old, failedCalls: [...old.failedCalls, { user: user, reasons: reasons }] }))
            }

            if (user.duration > 0) {
              node.data.serverNode.update((old) => {
                console.log("adding resources", user.id, user.resourceCost.cpu)
                return {
                  ...old,
                  currentResources: {
                    cpu: old.currentResources.cpu + user.resourceCost.cpu,
                    memory: old.currentResources.memory + user.resourceCost.memory,
                    storage: old.currentResources.storage + user.resourceCost.storage,
                    bandwidth: old.currentResources.bandwidth + user.resourceCost.bandwidth,
                  },
                  activeUsers: old.activeUsers + 1,
                }
              })
            }
          }
          if (user.duration >= 0) {
            user.duration -= 1
          }

          // Drop of used resources in two steps
          if (user.duration === 0) {
            console.log("removing resources part1", user.id, -user.resourceCost.cpu * 0.5)
            node.data.serverNode.update((old) => ({
              ...old,
              currentResources: {
                cpu: Math.max(old.currentResources.cpu - user.resourceCost.cpu * 0.5, 0),
                memory: Math.max(old.currentResources.memory - user.resourceCost.memory * 0.5, 0),
                storage: Math.max(old.currentResources.storage - user.resourceCost.storage * 0.5, 0),
                bandwidth: Math.max(old.currentResources.bandwidth - user.resourceCost.bandwidth * 0.5, 0),
              },
            }))
          }
          if (user.duration === -1) {
            console.log("removing resources part2", user.id, -user.resourceCost.cpu * 0.5)
            node.data.serverNode.update((old) => ({
              ...old,
              currentResources: {
                cpu: Math.max(old.currentResources.cpu - user.resourceCost.cpu * 0.5, 0),
                memory: Math.max(old.currentResources.memory - user.resourceCost.memory * 0.5, 0),
                storage: Math.max(old.currentResources.storage - user.resourceCost.storage * 0.5, 0),
                bandwidth: Math.max(old.currentResources.bandwidth - user.resourceCost.bandwidth * 0.5, 0),
              },
              activeUsers: Math.max(old.activeUsers - 1, 0),
            }))
          }
        }
      }
    }

    $nodes = $nodes

    simulatedUsers = simulatedUsers.filter((item) => item.duration !== -1)
  }

  function checkArrays() {
    console.log("simulatedUsers", simulatedUsers, "nodes", $nodes, "failedCalls", failedCalls)
  }
</script>

<div class="flow">
  <SvelteFlow {nodes} {edges} {nodeTypes} fitView attributionPosition="top-right">
    <Background bgColor="rgba(126,159,219,0.5)" patternColor="black" />
    <Controls showLock={false} />
  </SvelteFlow>
  <button on:click={addUsers}>add Users</button>
  <button on:click={startIntervalUsers}>start Users</button>
  <button on:click={stopIntervalUsers}>stop Users</button>
  <button on:click={startInterval}>start</button>
  <button on:click={stopInterval}>stop</button>
  <div>Interval running: {intervalRunning}</div>
  <div>currentUsers: {currentUsers}</div>
  <div>failedCalls: {failedCalls.length}</div>

  <button on:click={checkArrays}>checkArrays</button>
  <button on:click={runTestPerformance}>runTestPerformance</button>
</div>

<style>
  .flow {
    margin: 0 auto;
    margin-top: 50px;
    width: 700px;
    height: 500px;
  }
</style>
