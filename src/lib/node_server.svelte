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

  function getLineColor() {
    const currentType = $serverNode.type
    switch (currentType) {
      case "webserver":
        return "green"
        break
      default:
        return "red"
    }
  }
</script>

<div
  class="custom-node"
  class:blue={$serverNode.type === "webserver"}
  class:red={$serverNode.type === "api"}
  class:yellow={$serverNode.type === "database"}
>
  <div class="node_line"></div>
  <div class="node_header">{$serverNode.name}</div>
  <div class="custom-node-body">
    <Handle type="target" position={Position.Left} />
    <!-- <div>
      name: <strong>{$serverNode.name}</strong>
    </div> -->
    <div>
      <div>Resources:</div>
      <div>
        <ResourceLine
          labelText={"CPU"}
          currentValue={$serverNode.currentResources?.cpu || 0}
          maxValue={$serverNode.maxResources.cpu}
        />
        <ResourceLine
          labelText={"Memory"}
          currentValue={$serverNode.currentResources?.memory || 0}
          maxValue={$serverNode.maxResources.memory}
        />
        <ResourceLine
          labelText={"Storage"}
          currentValue={$serverNode.currentResources?.storage || 0}
          maxValue={$serverNode.maxResources.storage}
        />
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
</div>

<style>
  .custom-node {
    background: white;
    border: 1px solid black;
    border-radius: 5px;
    overflow: hidden;
    /* width: 300px; */
  }
  .custom-node .node_line {
    background: gray;
    width: 100%;
    height: 10px;
  }

  .custom-node.blue .node_line {
    background: rgb(14, 98, 194);
  }
  .custom-node.red .node_line {
    background: rgb(177, 28, 17);
  }
  .custom-node.yellow .node_line {
    background: rgb(228, 231, 18);
  }

  .custom-node .node_header {
    line-height: 40px;
    background: #f8fafc;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  }

  .custom-node .custom-node-body {
    padding: 15px;
  }

  .custom-node.blue .custom-node-body {
    padding: 15px;
    background-color: rgba(14, 98, 194, 0.3);
  }
  .custom-node.red .custom-node-body {
    padding: 15px;
    background-color: rgba(177, 28, 17, 0.3);
  }
  .custom-node.yellow .custom-node-body {
    padding: 15px;
    background-color: rgba(228, 231, 18, 0.3);
  }
</style>
