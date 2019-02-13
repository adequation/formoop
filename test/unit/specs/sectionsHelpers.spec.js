import {getSections} from "@/helpers/sectionsHelpers";

const mockedEntries = [
  {section: 'a'},
  {section: 'b'},
  {section: 'a'},
  {section: 'c'},
  {section: 'c'},
  {section: 'd'},
  {section: 'c'},
  {section: 'b'},
];

const mockedEntriesWithoutSections = [
  {id: 'a'},
  {id: 'b'},
  {id: 'c'},
  {id: 'd'},
  {id: 'e'},
  {id: 'f'},
  {id: 'g'},
  {id: 'h'},
];

const mockedAnswers = {};

describe('sectionsHelpers.js', () => {

  jest.mock('@/helpers/userAnswersHelpers', () => ({
    getRawPercentage : jest.fn((filterType, formEntries, userAnswers) => 1)
  }));

  const sections = getSections(mockedEntries, mockedAnswers);
  const noSections = getSections(mockedEntriesWithoutSections, mockedAnswers);

  it('Should get the correct number of sections', () => {
    expect(sections.length).toEqual(4);
  });

  it('Should get the sections, sorted by alphabetical order', () => {
    const sectionsCopy = sections.map(s => ({...s}));
    sectionsCopy.sort((a,b) => a.name.localeCompare(b.name));

    expect(sections.every((s,i) => s.name === sectionsCopy[i].name)).toEqual(true);
  });

  it('Should get 2 values per sections (full & empty)', () => {

    expect(

      sections.every((s,i) =>
        s.values.find(v => v.name === 'full')
        &&
        s.values.find(v => v.name === 'empty')
      )

    ).toEqual(true);
  });

  it('Should get the no sections if theres none', () => {
    expect(noSections).toEqual([]);
  });

});

