<script lang="ts">
  import Counter from './lib/Counter.svelte';
  import Tick from './components/Tick.svelte';
  import TickStore from './components/Tick-Store.svelte';
  import TickRxJs from './components/Tick-RxJs.svelte';
  import TvShows from './containers/TvShows.svelte';
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

  <div class="card">
    <TickRxJs />
  </div>

  <div class="card">
    <TvShows />
  </div>

</main>

<style>
</style>
