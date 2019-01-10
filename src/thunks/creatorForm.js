import * as Firebase from 'firebase'
import {getCreatedFormFromID, publishingPath} from "@/helpers/firebaseHelpers";
import * as uuid from "uuid";

export const saveCreatorFormFB = (creatorID, formID, form) => {

  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .set(form);

};

const writePublishedCreatorFormFB = (form) => {
  return Firebase.database().ref(publishingPath.concat(form.id))
    .set(form);
};


const parseFormToUser = (form) => {
  const parsedForm = {id: form.id, title: form.title};

  //parse entries
  const entriesObject = {};

  form.entries.forEach(e => {

    const answer = {type: e.type, answers: e.answers};

    entriesObject[e.id] = {...e, answers: null, answer};
  });

  parsedForm.entries = entriesObject;

  return parsedForm;
};


const parseGenericEntry = (entry, entity) => {
  const parsedEntries = [];
  let parsedEntry = {...entry};

  //we get the desired property
  const prop = entity[parsedEntry.genericProperty];

  delete parsedEntry.generic;

  //answers are all the same
  const answer = {type: parsedEntry.type, answers: parsedEntry.answers};

  //create a question for each property element
  if (prop.constructor === Array) {
    prop.map(p => {
      const question = {
        title: parsedEntry.question.blocks.map(block => {
          if (block.type === 'variable') {
            return p[block.content];
          }
          return block.content
        }).join(' ')
      };

      parsedEntries.push(
        {
          ...parsedEntry,
          id: uuid.v4(),
          question: {...question},
          answers: null,
          answer: {...answer}
        }
      );
    })
  } else {
    const question = {
      title: parsedEntry.question.blocks.map(block => {
        if (block.type === 'variable') {
          return prop[block.content];
        }
        return block.content
      }).join(' ')
    };

    parsedEntries.push(
      {
        ...parsedEntry,
        question: {...question},
        answers: null,
        answer: {...answer}
      }
    );
  }

  return parsedEntries;
};

const parseGenericFormToUser = (form, entity) => {
  const parsedForm = {id: uuid.v4(), title: form.title};

  //parse entries
  const entriesObject = {};
  form.entries.forEach(e => {

    if (e.generic) {
      const parsedEntries = parseGenericEntry(e, entity);
      parsedEntries.forEach(pe => {
        console.log(pe.id);
        entriesObject[pe.id] = {...pe};
      });
    }
    else {
      const answer = {type: e.type, answers: e.answers};
      entriesObject[e.id] = {...e, answers: null, answer};
    }
  });

  parsedForm.entries = entriesObject;

  return parsedForm;
};

const generateAndPublishForms = (creatorForm, entities) => {
  console.log(JSON.stringify(entities));
  console.log('--------------------');
  Object.keys(entities).forEach(entityKey => {
    const parsedForm = parseGenericFormToUser(creatorForm, entities[entityKey]);
    writePublishedCreatorFormFB(parsedForm);
  });
};

export const publishGenericFormsFB = (creatorID, formID, entities) => {

  //we fetch the form in firebase
  //then we publish it
  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .on('value', function (snapshot) {
      const value = snapshot.val();
      if (value) {
        generateAndPublishForms(value, entities);
      }
    });

};

export const publishCreatorFormFB = (creatorID, formID) => {

  //we fetch the form in firebase
  //then we publish it
  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .on('value', function (snapshot) {
      const value = snapshot.val();
      if (value) {
        const parsedForm = parseFormToUser(value);
        writePublishedCreatorFormFB(parsedForm);
      }
    });

};
