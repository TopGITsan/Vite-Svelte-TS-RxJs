<script lang="ts">
  import InputSearch from "./InputSearch.svelte";

  import ShowsPagesInfo from "./ShowsPagesInfo.svelte";
  import ShowsList from "./ShowsList.svelte";

  import {
    Observable,
    catchError,
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

  function handleOnEventSearch(event: CustomEvent<string>) {
    typeAhead$.next(event.detail)
  }
</script>

<InputSearch on:eventSearch={handleOnEventSearch}></InputSearch>

<ShowsPagesInfo currentPage={$currentPage$} totalPages={$totalPages$}></ShowsPagesInfo>

<ShowsList tvShows={$tvShows$}></ShowsList>

<style>
</style>
