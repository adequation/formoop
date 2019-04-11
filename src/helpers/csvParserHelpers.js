import * as d3 from "d3";

export function parsePromoteurCSV(rawFile) {
  const promoteurs = {};

  d3.csvParse(rawFile, function (d) {

    if (d) {

      if (d.PROMOTEUR && d.NOMPROG && d.VILLE) {

        const rowAdditionalData = {...d};

        const row = {
          nom: cleanWord(d.PROMOTEUR),
          programme: cleanWord(d.NOMPROG),
          ville: cleanWord(d.VILLE),
          contact: d.CONTACT
        };

        //cleaning empty fileds
        Object.keys(rowAdditionalData).forEach(dk => {
          if (!rowAdditionalData[dk]) delete rowAdditionalData[dk];
        });

        //cleaning empty fileds
        Object.keys(row).forEach(dk => {
          if (!row[dk]) delete row[dk];
        });

        delete rowAdditionalData.PROMOTEUR;
        delete rowAdditionalData.NOMPROG;
        delete rowAdditionalData.VILLE;
        delete rowAdditionalData.CONTACT;

        //we didn't encounter it, so initialize everything
        if (!promoteurs[row.nom]) {

          promoteurs[row.nom] = {
            nom: row.nom,
            programmes: [{programme: row.programme, ville: row.ville}],
            contact: row.contact ? row.contact.trim() : row.contact
          };

        } else { //we already encountered it, so we just add it
          promoteurs[row.nom].programmes.push({programme: row.programme, ville: row.ville});

          if (!promoteurs[row.nom].contact && !!row.contact)
            promoteurs[row.nom].contact = row.contact.trim();
        }

        Object.keys(rowAdditionalData).forEach(dk => {
          promoteurs[row.nom][dk] = rowAdditionalData[dk];
        });

        console.log(row.nom, promoteurs[row.nom]);
      }
    }

  });

  return promoteurs;
}

//format a string to an all lowercase one, then capitalize the first letter
export function formatUppercaseLowerCase(word) {
  const lower = word.toLowerCase();

  return lower.replace(/^\w/, c => c.toUpperCase());
}

//format a string to be fancy when displayed
export function cleanWord(word) {
  console.log(word)
  return formatUppercaseLowerCase(word.trim());
}

export function getEntityToken(value) {
  //Generate a base64 token from an entity unique value
  return window.btoa(unescape(encodeURIComponent(value)));

}
