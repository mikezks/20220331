/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FlightsLoad, FlightUpdate } from '../+state/flight-booking/flight-booking.actions';
import { FlightBookingState } from '../+state/flight-booking/flight-booking.state';

@Component({
  selector: 'flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from = 'Hamburg'; // in Germany
  to = 'Graz'; // in Austria
  urgent = false;

  @Select(FlightBookingState.getFlights)
  flights$!: Observable<Flight[]>;

  // "shopping basket" with selected flights
  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  constructor(
    private flightService: FlightService,
    private store: Store) {
  }

  ngOnInit() {
  }

  search(): void {
    if (!this.from || !this.to) return;

    this.store.dispatch(
      new FlightsLoad(this.from, this.to, this.urgent)
    );
  }

  delay(flight: Flight): void {
    this.store.dispatch(
      new FlightUpdate({
        ...flight,
        date: addMinutesToDate(flight.date, 15).toISOString(),
        delayed: true
      })
    );
  }
}

export const addMinutesToDate = (date: Date | string, minutes: number): Date => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Date(dateObj.getTime() + minutes * 60 * 1_000);
};
