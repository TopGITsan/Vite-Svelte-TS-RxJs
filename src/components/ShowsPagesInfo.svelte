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
  /* input */
  .container {
    position: relative;
    margin: auto;
    width: 300px;
    height: 100px;
  }
  .info {
    text-align: center;
  }
</style>
