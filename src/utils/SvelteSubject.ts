import { Subject } from "rxjs";

export class SvelteSubject<T> extends Subject<T> {
  set(value: T) {
    super.next(value);
  }
}