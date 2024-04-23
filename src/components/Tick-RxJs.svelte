<script lang="ts">
  import { Observable, timer } from "rxjs";
  // use RxJs timer
  const tick: Observable<number> = timer(0, 1000);
</script>

<!-- provide the variable to the HTML and prefix it with a $ to mark it as an Observable -->
<h2>
  RxJs timer: {$tick}
</h2>
