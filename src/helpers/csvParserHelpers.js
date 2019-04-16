import * as d3 from "d3";

//parsing errors
export const NO_ROWS_PARSED = "Aucune ligne du CSV n'as pu être traité. Peut être que la colonne d'indentifiant unique saisie n'existe pas ?";
export const MISSING_ID = "Ligne ignorée : la ligne ne contient pas de valeur dans sa colonne d'identifiant unique. Celle-ci est surement vide.";

//generating errors
export const NON_EXISTING_VARIABLE = "Variable manquante.";

export function parseEntitiesCSV(rawFile, entityIdProp) {
  const errors = [];
  const warnings = [];
  const entities = {};

  d3.csvParse(rawFile, function (d, i) {

    if (d) { //we authorize empty rows, we just ignore them

      const row = {};

      //we construct the row
      Object.keys(d).forEach(prop => {
        row[prop] = d[prop] ? d[prop].trim() : d[prop];
      });

      const rowID = row[entityIdProp];

      //missing a value in it's ID column
      //so we skip this row since it is empty
      //but still put it as a warning
      if (!rowID) {
        warnings.push({message: MISSING_ID, place: `Ligne ${i + 1} du CSV`});
        return;
      }

      //we add our the row to the global entity object
      Object.keys(row).forEach(prop => {
        //if (!row[dk]) delete row[dk]; //we remove

        if (!entities[rowID]) { //never encountered this entity

          entities[rowID] = {id: rowID};

          entities[rowID][prop] = [row[prop]]; //every value is in an array for simplicity


        } else { //we already encountered it, so we just add it


          if (entities[rowID][prop]) {
            entities[rowID][prop].push(row[prop]);
          }
          else
            entities[rowID][prop] = [row[prop]];

        }

      });

    }

  });

  if (Object.keys(entities).length <= 0)
    errors.push({message: NO_ROWS_PARSED, place: 'Tout le fichier'});

  return {errors, warnings, data: entities};
}

//format a string to an all lowercase one, then capitalize the first letter
export function formatUppercaseLowerCase(word) {
  const lower = word.toLowerCase();

  return lower.replace(/^\w/, c => c.toUpperCase());
}

//format a string to be fancy when displayed
export function cleanWord(word) {
  return formatUppercaseLowerCase(word.trim());
}

export function getEntityToken(value) {
  //Generate a base64 token from an entity unique value
  return window.btoa(unescape(encodeURIComponent(value)));

}
