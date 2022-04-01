import { Injectable } from '@angular/core';
import { Flight, FlightService } from '@flight-workspace/flight-lib';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { FlightsLoad, FlightsLoaded, FlightUpdate } from './flight-booking.actions';

export interface FlightBookingStateModel {
  flights: Flight[];
}

@State<FlightBookingStateModel>({
  name: 'flightBooking',
  defaults: {
    flights: []
  }
})
@Injectable()
export class FlightBookingState {

  constructor(private flightService: FlightService) {}

  @Selector()
  public static getState(state: FlightBookingStateModel) {
    return state;
  }

  @Selector()
  public static getFlights(state: FlightBookingStateModel) {
    return state.flights;
  }

  @Action(FlightsLoad)
  public loadFlights(
    ctx: StateContext<FlightBookingStateModel>,
    { from, to, urgent }: FlightsLoad): Observable<void> {

    return this.flightService.find(from, to, urgent).pipe(
      switchMap(flights => ctx.dispatch(
        new FlightsLoaded(flights)
      )),
      catchError(() => EMPTY)
    );
  }

  @Action(FlightsLoaded)
  public addFlights(
    ctx: StateContext<FlightBookingStateModel>,
    { flights }: FlightsLoaded) {
    ctx.patchState({ flights });
  }

  @Action(FlightUpdate)
  public updateFlight(
    ctx: StateContext<FlightBookingStateModel>,
    { flight }: FlightUpdate) {
    ctx.setState(
      patch({
        flights: updateItem(
          i => i?.id === flight.id,
          flight
        )
      })
    );
  }
}
