<script lang="ts">
  import type { Writable } from "svelte/store"
  import { Handle, Position, type NodeProps as origNodeProps } from "@xyflow/svelte"
  import ResourceLine from "./node_server_components/resource_line.svelte"

  type $$Props = ServerNodeProps
  // type $$Props = origNodeProps

  // export let data: { serverNode: Writable<ServerNode> }
  // // export let data: $$Props["data"]

  // // const { serverNode } = data
  // $: serverNode = data.serverNode

  // interface ServerNodeProps extends origNodeProps {
  //   // ... other properties
  //   data: {
  //     serverNode: Writable<ServerNode>
  //     // ... other data properties
  //   }
  // }

  type ServerNodeProps = origNodeProps & {
    data: {
      serverNode: Writable<ServerNode> // Custom interface with Writable data store
    }
  }
  export let data: { serverNode: Writable<ServerNode> }
  // const { name, resources }: { name: string; resources: SystemResources } = data.serverNode
  const { serverNode } = data

  function checkColor() {
    let value1 = $serverNode.maxResources.cpu
    let value2 = $serverNode.currentResources?.cpu || 0

    if (value1 > value2) {
      return "green"
    } else if (value1 > value2 * 0.5) {
      return "yellow"
    } else if (value1 > value2 * 0.8) {
      return "red"
    }
    return "green"
  }
</script>

<div class="custom-node">
  <Handle type="target" position={Position.Left} />
  <div>
    name: <strong>{$serverNode.name}</strong>
  </div>
  <div>
    <div>Resources:</div>
    <div>
      <ResourceLine labelText={"CPU"} currentValue={$serverNode.currentResources?.cpu || 0} maxValue={$serverNode.maxResources.cpu} />
      <ResourceLine labelText={"Memory"} currentValue={$serverNode.currentResources?.memory || 0} maxValue={$serverNode.maxResources.memory} />
      <ResourceLine labelText={"Storage"} currentValue={$serverNode.currentResources?.storage || 0} maxValue={$serverNode.maxResources.storage} />
      <ResourceLine
        labelText={"Bandwidth"}
        currentValue={$serverNode.currentResources?.bandwidth || 0}
        maxValue={$serverNode.maxResources.bandwidth}
      />
    </div>
  </div>
  <div>Failed Calls: {$serverNode.failedCalls.length}</div>
  <div>Active Users: {$serverNode.activeUsers}</div>

  <Handle type="source" position={Position.Right} />
</div>

<style>
  .custom-node {
    background: white;
    padding: 15px;
    border: 1px solid black;
    border-radius: 3px;
  }
</style>
