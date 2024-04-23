<script lang="ts">
  import { writable } from "svelte/store";

  let tick = writable(0, () => {
    let interval = setInterval(() => {
      tick.update((value: number) => value + 1);
    }, 1000);

    return (): void => {
      clearInterval(interval);
    };
  });

  let tickValue: number = 0;
  tick.subscribe((v: number) => {
    tickValue = v;
  });
</script>

<h2>Store value: {tickValue}</h2>
