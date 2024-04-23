<script lang="ts">
  import { writable } from "svelte/store";

  const tick = writable(0, () => {
    let interval = setInterval(() => {
      tick.update((value: number) => value + 1);
    }, 1000);

    return (): void => {
      clearInterval(interval);
    };
  });
</script>

<h2>Svelte store value: {$tick}</h2>
