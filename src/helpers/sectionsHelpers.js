import {getRawPercentage} from "@/helpers/userAnswersHelpers";

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

  //there is no section
  if(!allSections) return [];

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
