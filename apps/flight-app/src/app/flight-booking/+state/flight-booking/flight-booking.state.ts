import { Flight } from '@flight-workspace/flight-lib';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { FlightsLoaded } from './flight-booking.actions';

export interface FlightBookingStateModel {
  flights: Flight[];
}

@State<FlightBookingStateModel>({
  name: 'flightBooking',
  defaults: {
    flights: []
  }
})
export class FlightBookingState {

  @Selector()
  public static getState(state: FlightBookingStateModel) {
    return state;
  }

  @Selector()
  public static getFlights(state: FlightBookingStateModel) {
    return state.flights;
  }

  @Action(FlightsLoaded)
  public addFlights(
    ctx: StateContext<FlightBookingStateModel>,
    { flights }: FlightsLoaded) {
    ctx.patchState({ flights });
  }
}
