import {getRawPercentage} from "@/helpers/userAnswersHelpers";
import * as d3 from "d3";

export function getSections(formEntries, userAnswers) {
  const allSections = {};
  const sectionGrouped = {};

  //we retreive all sections from the entries
  formEntries.forEach(fe => {
    if(!fe.section) return;
    if(!allSections[fe.section]) {
      allSections[fe.section] = {id: fe.section, name: fe.section};
      sectionGrouped[fe.section] = [];
    }

    //we group the entries to get the percentage later
    sectionGrouped[fe.section].push(fe)
  });

  //we get the percentage and build the pies
  Object.keys(sectionGrouped).forEach(section => {
    const percentage = getRawPercentage("answered", sectionGrouped[section], userAnswers);

    allSections[section].values = [
      {"name": "full", "value": percentage},
      {"name": "empty", "value": 1-percentage}
    ];
  });

  return Object.keys(allSections).map(section => ({...allSections[section], id: section}))
    .sort((a,b) => a.name.localeCompare(b.name));
}

export function getSectionColor(currentSection, sections, interpolator = d3.interpolateRainbow){

  if(!currentSection || sections.length <= 0) return null;

  const index = sections.findIndex(s => s === currentSection);

  if(index < 0) return null;

  return interpolator(index / sections.length);
}
