import { Flight } from "@flight-workspace/flight-lib";

export class FlightsLoaded {
  public static readonly type = '[FlightBooking] Flights loaded';
  constructor(public flights: Flight[]) { }
}

export class FlightsLoad {
  public static readonly type = '[FlightBooking] Flights load';
  constructor(
    public from: string,
    public to: string,
    public urgent: boolean) { }
}

export class FlightUpdate {
  public static readonly type = '[FlightBooking] Flight update';
  constructor(public flight: Flight) { }
}
