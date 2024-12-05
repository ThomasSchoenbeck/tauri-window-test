<script lang="ts">
  export let labelText: string
  export let currentValue: number
  export let maxValue: number
</script>

<div
  class:green={maxValue > (currentValue || 0)}
  class:yellow={(currentValue || 0) > maxValue * 0.55}
  class:red={(currentValue || 0) > maxValue * 0.85}
>
  {labelText}: {currentValue} / {maxValue}
</div>

<style>
  .green {
    color: greenyellow;
    background: green;
  }

  .yellow {
    color: black;
    background: yellow;
  }

  .red {
    color: red;
    background: darkred;
  }
</style>
