<script lang="ts">
  import Counter from './lib/Counter.svelte';
  import Tick from './components/Tick.svelte';
  import TickStore from './components/Tick-Store.svelte';
</script>

<main>
  <h1>Vite + Svelte+ RxJs</h1>

  <div class="card">
    <Counter />
  </div>

  <div class="card">
    <Tick />
  </div>
  <div class="card">
    <TickStore />
  </div>
</main>

<style>
</style>
