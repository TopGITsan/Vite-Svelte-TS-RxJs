<script lang="ts">
  export let tvShows: Array<any> = [];
</script>

<ul class="shows">
  {#each tvShows as show}
    <li>
      <a href="" class="show">
        <img src={show.image_thumbnail_path} class="show__image" alt={show.name} />
        <div class="show__overlay">
          <div class="show__header">
            <svg class="show__arc" xmlns="http://www.w3.org/2000/svg"><path /></svg>
            <img class="show__thumb" src={show.image_thumbnail_path} alt={show.id} />
            <div class="show__header-text">
              <h3 class="show__title">{show.name}</h3>
              {#if show?.network}
                <span class="show__status">Network: {show.network}</span>
              {/if}
            </div>
          </div>
          <section class="show__description">
            <p>
              {#if show?.start_date}
                <span>Start date: {show.start_date}</span>
              {/if}
              <span>Status: {show.status}</span>
            </p>
            {#if show?.country}
              <p>Country: {show.country}</p>
            {/if}
          </section>
        </div>
      </a>
    </li>
  {/each}
</ul>

<style>
  /* shows list */
  .shows {
    --surface-color: #fff;
    --curve: 40;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2rem;
    margin: 4rem 5vw;
    padding: 0;
    list-style-type: none;
  }

  .show {
    position: relative;
    display: block;
    height: 100%;
    border-radius: calc(var(--curve) * 1px);
    overflow: hidden;
    text-decoration: none;
  }

  .show__image {
    width: 100%;
    height: auto;
  }

  .show__overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    border-radius: calc(var(--curve) * 1px);
    background-color: var(--surface-color);
    transform: translateY(100%);
    transition: 0.2s ease-in-out;
  }

  .show:hover .show__overlay {
    transform: translateY(0);
  }

  .show__header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 2em;
    padding: 2em;
    border-radius: calc(var(--curve) * 1px) 0 0 0;
    background-color: var(--surface-color);
    transform: translateY(-100%);
    transition: 0.2s ease-in-out;
  }

  .show__arc {
    width: 80px;
    height: 80px;
    position: absolute;
    bottom: 100%;
    right: 0;
    z-index: 1;
  }

  .show__arc path {
    fill: var(--surface-color);
    d: path("M 40 80 c 22 0 40 -22 40 -40 v 40 Z");
  }

  .show:hover .show__header {
    transform: translateY(0);
  }

  .show__thumb {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .show__title {
    font-size: 1em;
    margin: 0 0 0.3em;
    color: #6a515e;
  }

  .show__status {
    font-size: 0.8em;
    color: #d7bdca;
  }

  .show__description {
    padding: 0 2em 2em;
    margin: 0;
    color: #d7bdca;
    font-family: "MockFlowFont";
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
</style>
