import { Flight } from "@flight-workspace/flight-lib";

export class FlightsLoaded {
  public static readonly type = '[FlightBooking] Flights loaded';
  constructor(public flights: Flight[]) { }
}
