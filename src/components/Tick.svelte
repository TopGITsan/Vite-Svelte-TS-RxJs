<script lang="ts">
  let tick = 0;
  setInterval(() => {
    tick += 1;
  }, 1000);

  // reactive statement
  $: console.log(tick);
</script>

<h2>
  {tick} {tick === 0 ? 'Starting' : tick === 1 ? 'Second' : 'Seconds'}
</h2>
