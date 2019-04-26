import {getFormattedHourMinutes, getFormattedToday, today} from "@/helpers/timeHelpers";

describe('timeHelpers.js', () => {

  beforeEach(() => {
    jest.resetModules();
  });

  it('Should give the current date', () => {
    const mockedDate = new Date("2019-02-05T11:06:18.642Z");
    const originalDate = Date;

    global.Date = jest.fn(() => mockedDate);
    global.Date.setDate = originalDate.setDate;

    expect(today()).toEqual(new Date());
  });

  it('Should give the correct formatted time', () => {
    expect(getFormattedHourMinutes()).toEqual('12:06');
  });
});
