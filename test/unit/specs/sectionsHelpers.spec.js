import {getSectionColor, getSections} from "@/helpers/sectionsHelpers";
import * as d3 from "d3";

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
    getRawPercentage: jest.fn((filterType, formEntries, userAnswers) => 1)
  }));

  const sections = getSections(mockedEntries, mockedAnswers);
  const noSections = getSections(mockedEntriesWithoutSections, mockedAnswers);

  it('Should get the correct number of sections', () => {
    expect(sections.length).toEqual(4);
  });

  it('Should get the sections, sorted by alphabetical order', () => {
    const sectionsCopy = sections.map(s => ({...s}));
    sectionsCopy.sort((a, b) => a.name.localeCompare(b.name));

    expect(sections.every((s, i) => s.name === sectionsCopy[i].name)).toEqual(true);
  });

  it('Should get 2 values per sections (full & empty)', () => {

    expect(
      sections.every((s, i) =>
        s.values.find(v => v.name === 'full')
        &&
        s.values.find(v => v.name === 'empty')
      )
    ).toEqual(true);
  });

  it('Should get the no sections if theres none', () => {
    expect(noSections).toEqual([]);
  });

  it('Should get null if there is no sections ', () => {
    expect(getSectionColor('a', [])).toEqual(null);
    expect(getSectionColor('', ["a"])).toEqual(null);
  });

  it('Should not get any color if the section is not found ', () => {
    expect(getSectionColor('a', ['b', 'c', 'd'])).toEqual(null);
  });

  it('Should get the correct rainbow colors', () => {
    expect(getSectionColor('a', ['a', 'b', 'c'])).toEqual(d3.interpolateRainbow(0 / 3));
    expect(getSectionColor('b', ['a', 'b', 'c'])).toEqual(d3.interpolateRainbow(1 / 3));
    expect(getSectionColor('c', ['a', 'b', 'c'])).toEqual(d3.interpolateRainbow(2 / 3));
  });

  it('Should get the correct custom interpolator colors', () => {
    expect(getSectionColor('a', ['a', 'b', 'c'], d3.interpolateMagma)).toEqual(d3.interpolateMagma(0 / 3));
    expect(getSectionColor('b', ['a', 'b', 'c'], d3.interpolateMagma)).toEqual(d3.interpolateMagma(1 / 3));
    expect(getSectionColor('c', ['a', 'b', 'c'], d3.interpolateMagma)).toEqual(d3.interpolateMagma(2 / 3));
  });

});

