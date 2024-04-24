<script lang="ts">
  export let currentPage: number | undefined;
  export let totalPages: number | undefined;
</script>

<section class="container">
  <div class="info">
    <span>Current page {currentPage} / </span>
    <span>Total pages {totalPages}</span>
  </div>
</section>

<style>
  /* .container  is a global class */
  .info {
    text-align: center;
  }
</style>
