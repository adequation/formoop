import {clipText, filterEntryAnswers, updatePublishedForm} from "@/helpers/generalHelpers";
import {
  mockChangedTitlesForm,
  mockchangedTitlesForm,
  mockedChangedEntryTypeForm,
  mockedFullChangedEntryTypeForm, mockedFullTestForm,
  mockedFullUpdatedTitleForm, mockedOldTestForm, mockedTestForm,
  mockedUpdatedTitleForm,
  mockForm,
  mockFullChangedTitlesForm,
  mockFullchangedTitlesForm,
  mockFullForm
} from "../mock/userForms";

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

  it('Should just add answers and users correctly', ()=> {
    expect(updatePublishedForm(mockForm, mockFullForm)).toEqual(mockFullForm);
  });

  it('Should just change title, add answers and users correctly', ()=> {
    expect(updatePublishedForm(mockedUpdatedTitleForm, mockFullForm)).toEqual(mockedFullUpdatedTitleForm);
  });

  it('Should just remove unwanted answers when type changes', ()=> {
    expect(updatePublishedForm(mockedChangedEntryTypeForm, mockFullForm)).toEqual(mockedFullChangedEntryTypeForm);
  });

  it('Should just remove unwanted answers when the title changes', ()=> {
    expect(updatePublishedForm(mockChangedTitlesForm, mockFullForm)).toEqual(mockFullChangedTitlesForm);
  });

  it('Should update a form as expected changes', ()=> {
    expect(updatePublishedForm(mockedTestForm, mockedOldTestForm)).toEqual(mockedFullTestForm);
  });

});
