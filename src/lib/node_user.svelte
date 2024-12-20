<script lang="ts">
  import type { Writable } from "svelte/store"
  import {
    Handle,
    Position,
    useHandleConnections,
    type NodeProps as origNodeProps,
  } from "@xyflow/svelte"

  type $$Props = UserNodeProps
  export let id: $$Props["id"]
  const connections = useHandleConnections({
    nodeId: id,
    type: "target",
  })
  type UserNodeProps = origNodeProps & {
    data: {
      userNode: Writable<UserNode> // Custom interface with Writable data store
    }
  }
  export let data: { userNode: Writable<UserNode> }
  const { userNode } = data
</script>

<div class="custom-node">
  <div class="node_line"></div>
  <div class="node_header">{$userNode.name}</div>
  <div class="custom-node-body">
    <Handle type="target" position={Position.Left} isConnectable={$connections.length === 0} />

    <div>
      {#each $userNode.mapped_user_journeys as uj}
        <div>
          {uj.user_journey_id.toUpperCase()}
          <span class="number_of_users">{uj.number_of_users}</span> :
          <input class="nodrag" type="range" max="500" bind:value={uj.number_of_users} />
        </div>
      {/each}
    </div>

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
    background: rgb(34, 179, 34);
    width: 100%;
    height: 10px;
  }

  .custom-node .node_header {
    line-height: 30px;
    background: #f8fafc;
    text-align: center;
    font-weight: bold;
  }

  .custom-node .custom-node-body {
    padding: 15px;
    background: rgba(34, 179, 34, 0.3);
  }
  .custom-node .custom-node-body .number_of_users {
    width: 50px;
    text-align: right;
    display: inline-block;
  }

  /* .custom-node input[type="range"]::-webkit-slider-runnable-track {
    background-color: rgba(34, 179, 34, 0.3);
  } */
</style>
