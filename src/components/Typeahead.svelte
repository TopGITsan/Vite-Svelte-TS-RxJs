<script lang="ts">
  import ShowsPagesInfo from "./ShowsPagesInfo.svelte";
  import ShowsList from "./ShowsList.svelte";

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

<ShowsPagesInfo currentPage={$currentPage$} totalPages={$totalPages$}></ShowsPagesInfo>
<ShowsList tvShows={$tvShows$}></ShowsList>

<style>
  /* input */
  /* .container  is a global class */
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
</style>
