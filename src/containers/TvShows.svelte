<script lang="ts">
  import InputSearch from "../components/InputSearch.svelte";
  import ShowsPagesInfo from "../components/ShowsPagesInfo.svelte";
  import ShowsList from "../components/ShowsList.svelte";

  import { Observable, distinctUntilChanged, map, of, startWith, switchMap } from "rxjs";
  import { SvelteBehaviorSubject } from "../utils/SvelteBehaviorSubject";
  import { getShows } from "../data/showsHTTP";

  const typeAhead$: SvelteBehaviorSubject<string> = new SvelteBehaviorSubject("");

  const episodateResponse$ = typeAhead$.pipe(
    distinctUntilChanged(),
    switchMap((query) => {
      if (!query) {
        return of([]);
      }
      return getShows(query);
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
    typeAhead$.next(event.detail);
  }
</script>

<InputSearch on:eventSearch={handleOnEventSearch}></InputSearch>

<ShowsPagesInfo currentPage={$currentPage$} totalPages={$totalPages$}></ShowsPagesInfo>

<ShowsList tvShows={$tvShows$}></ShowsList>

