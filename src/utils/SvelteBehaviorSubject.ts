import { BehaviorSubject } from "rxjs";

export class SvelteBehaviorSubject<T> extends BehaviorSubject<T> {
  set(value: T) {
    super.next(value);
  }
}