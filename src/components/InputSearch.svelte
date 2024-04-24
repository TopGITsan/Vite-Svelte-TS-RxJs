<script lang="ts">
  import { Subscription, debounceTime, distinctUntilChanged } from "rxjs";
  import { createEventDispatcher, type EventDispatcher } from "svelte";
  import { onDestroy } from "svelte";
  import { SvelteSubject } from "../utils/SvelteSubject";

  const inputValue$: SvelteSubject<string> = new SvelteSubject();

  const inputValueSub: Subscription = inputValue$
    .asObservable()
    .pipe(debounceTime(450), distinctUntilChanged())
    .subscribe(outputSearchTerm);

  const dispatch: EventDispatcher<Record<string, string>> = createEventDispatcher();

  function outputSearchTerm(term: string) {
    dispatch("eventSearch", term);
  }

  // or install rx-svelte with onDestroy$
  onDestroy(() => {
    inputValueSub.unsubscribe();
  });
</script>

<section class="container">
  <input
    bind:value={$inputValue$}
    type="search"
    name="typeahead"
    id="typeahead"
    data-test="test-typeahead"
    placeholder="Search"
  />
  <div class="search"></div>
</section>

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
