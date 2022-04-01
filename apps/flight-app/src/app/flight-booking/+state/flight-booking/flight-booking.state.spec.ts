import { TestBed, async } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { FlightBookingState, FlightBookingStateModel } from './flight-booking.state';
import { FlightBookingAction } from './flight-booking.actions';

describe('FlightBooking store', () => {
  let store: Store;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([FlightBookingState])]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

  it('should create an action and add an item', () => {
    const expected: FlightBookingStateModel = {
      items: ['item-1']
    };
    store.dispatch(new FlightBookingAction('item-1'));
    const actual = store.selectSnapshot(FlightBookingState.getState);
    expect(actual).toEqual(expected);
  });

});
