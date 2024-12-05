<script lang="ts">
  import type { Writable } from "svelte/store"
  import { Handle, Position, type NodeProps as origNodeProps } from "@xyflow/svelte"

  type $$Props = NodeProps

  export let data: { color: Writable<string> }

  const { color } = data

  interface NodeProps extends origNodeProps {
    // ... other properties
    data: {
      color: Writable<string>
      // ... other data properties
    }
  }
</script>

<div class="colorpicker">
  <Handle type="target" position={Position.Left} />
  <div>
    color: <strong>{$color}</strong>
  </div>
  <input class="nodrag" type="color" on:input={(evt: any) => data.color.set(evt.target?.value)} value={$color} />
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .colorpicker {
    background: white;
    padding: 15px;
    border: 1px solid black;
    border-radius: 3px;
  }
</style>
