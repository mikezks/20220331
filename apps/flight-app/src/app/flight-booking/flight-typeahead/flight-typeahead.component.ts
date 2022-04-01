import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { catchError, debounceTime, delay, distinctUntilChanged, EMPTY, filter, iif, map, UnaryFunction, Observable, of, share, Subscription, switchMap, tap, timer, withLatestFrom, pipe } from 'rxjs';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit, OnDestroy {
  timer$: Observable<number> = timer(0, 2_000).pipe(
    tap(value => console.log('stream producer', value)),
    share()
  );
  subscription = new Subscription();

  control = new FormControl();
  flights$: Observable<Flight[]> = this.getFlightsStream$();
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.rxjsDemo();
  }

  getFlightsStream$(): Observable<Flight[]> {
    const state$ = of({
      city: 'Berlin'
    });

    const customFilter = <T>(
      filterFn: (value: T) => boolean,
      debounceTimeValue: number
    ): UnaryFunction<
      Observable<T>, Observable<T>
    > => pipe(
      filter(filterFn),
      debounceTime(debounceTimeValue),
      distinctUntilChanged()
    );

    /**
     * Stream 1: Input control -> value changes
     * - Trigger
     * - Data Provider
     */
    return this.control.valueChanges.pipe(
      // Get additional state
      // withLatestFrom(state$),
      // Transformation
      // map(([, state]) => state.city),
      // Filtering START
      // filter(city => city.length > 2),
      /* debounceTime(300),
      distinctUntilChanged(), */
      customFilter(
        city => city.length > 2,
        300
      ),
      // Filtering END
      // Side-Effect
      tap(() => this.loading = true),
      /**
       * Stream 2: Backend HTTP call -> Array of Flights
       * - Data Provider
       */
      // delay(2_000),
      switchMap(city => iif(
        () => city.length > 2,
        this.load(city).pipe(
          catchError(() => of([]))
        ),
        of([])
      )),
      // Side-Effect
      tap(() => this.loading = false)
    );
  }

  /**
   * Stream 2: Backend HTTP call -> Array of Flights
   * - Data Provider
   */
  load(from: string): Observable<Flight[]> {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
  }

  rxjsDemo(): void {
    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

/*
const flight = {
  id: 0,
  from: { value: 'Graz'},
  to: 'London'
};

const { id, from: { value } } = flight;
 */
