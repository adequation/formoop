import {clipText} from "@/helpers/generalHelpers";

describe('generalHelpers.js', () => {

  it('Should clip the text correctly, without dots', () => {
    const mockText26 = 'abcdefghijklmnopqrstuvwxyz';
    const mockText10 = 'abcdefghij';

    expect(clipText(mockText26, 20)).toBe('abcdefghijklmnopqrst');
    expect(clipText(mockText10, 20)).toBe(mockText10);
    expect(clipText(null)).toBe('');
  });

  it('Should clip the text correctly, with dots', () => {
    const mockText26 = 'abcdefghijklmnopqrstuvwxyz';
    const mockText10 = 'abcdefghij';

    expect(clipText(mockText26, 20, true)).toBe('abcdefghijklmnopq...');
    expect(clipText(mockText10, 20)).toBe(mockText10);
    expect(clipText(null)).toBe('');
  });

});
