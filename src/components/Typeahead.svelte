<script lang="ts">
  import {
    Observable,
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    of,
    startWith,
    switchMap,
  } from "rxjs";
  import { fromFetch } from "rxjs/fetch";
  import { SvelteBehaviorSubject } from "../utils/SvelteBehaviorSubject";

  const typeAhead$: SvelteBehaviorSubject<string> = new SvelteBehaviorSubject("");

  const episodateResponse$ = typeAhead$.pipe(
    debounceTime(450),
    distinctUntilChanged(),
    switchMap((query) => {
      if (!query) {
        return of([]);
      }
      return fromFetch(`https://www.episodate.com/api/search?q=${query}`).pipe(
        switchMap((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return of({ error: true, message: `Error ${response.status}` });
          }
        }),
        catchError((err) => of({ error: true, message: err.message })),
      );
    }),
    startWith({}),
  );
  const currentPage$: Observable<number> = episodateResponse$.pipe(
    map((response) => (response?.page ? response.page : 0)),
    distinctUntilChanged(),
  );
  const totalPages$: Observable<number> = episodateResponse$.pipe(
    map((response) => (response?.pages ? response.pages : 0)),
    distinctUntilChanged(),
  );
  const tvShows$: Observable<Array<any>> = episodateResponse$.pipe(
    map((response) => (response?.tv_shows ? response.tv_shows : [])),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
  );
</script>

<section class="container">
  <input
    bind:value={$typeAhead$}
    type="search"
    name="typeahead"
    id="typeahead"
    data-test="test-typeahead"
    placeholder="Search"
  />
  <div class="search"></div>
</section>

<section class="container">
  <div class="info">
    <span>Current page {$currentPage$} / </span>
    <span>Total pages {$totalPages$}</span>
  </div>
</section>

<ul class="shows">
  {#each $tvShows$ as show}
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
  .search {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 80px;
    background: crimson;
    border-radius: 50%;
    transition: all 1s;
    z-index: 4;
    box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.4);
    /* box-shadow: 0 0 25px 0 crimson; */
  }
  .search:hover {
    cursor: pointer;
  }
  .search::before {
    content: "";
    position: absolute;
    margin: auto;
    top: 22px;
    right: 0;
    bottom: 0;
    left: 22px;
    width: 12px;
    height: 2px;
    background: white;
    transform: rotate(45deg);
    transition: all 0.5s;
  }
  .search::after {
    content: "";
    position: absolute;
    margin: auto;
    top: -5px;
    right: 0;
    bottom: 0;
    left: -5px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid white;
    transition: all 0.5s;
  }

  input {
    position: absolute;
    font-family: "Inconsolata", monospace;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 50px;
    outline: none;
    border: none;
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.2); */
    background: crimson;
    color: white;
    text-shadow: 0 0 10px crimson;
    padding: 0 80px 0 20px;
    border-radius: 30px;
    box-shadow:
      0 0 25px 0 crimson,
      0 20px 25px 0 rgba(0, 0, 0, 0.2);
    /* box-shadow: inset 0 0 25px 0 rgba(0, 0, 0, 0.5); */
    transition: all 1s;
    opacity: 0;
    z-index: 5;
    font-weight: bolder;
    letter-spacing: 0.1em;
  }
  input:hover {
    cursor: pointer;
  }
  input:focus {
    width: 300px;
    opacity: 1;
    cursor: text;
  }
  input:focus ~ .search {
    right: -250px;
    background: #151515;
    z-index: 6;
    &::before {
      top: 0;
      left: 0;
      width: 25px;
    }
    &::after {
      top: 0;
      left: 0;
      width: 25px;
      height: 2px;
      border: none;
      background: white;
      border-radius: 0%;
      transform: rotate(-45deg);
    }
  }
  input::placeholder {
    color: white;
    opacity: 0.5;
    font-weight: bolder;
  }

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
