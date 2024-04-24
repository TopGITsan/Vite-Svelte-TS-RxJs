import { switchMap, of, catchError, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";

// TODO add return type Response and ErrorResponse
export function getShows(query: string): Observable<any> {
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
}