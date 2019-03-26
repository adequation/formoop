import * as Firebase from 'firebase'
import {campaignPath, getCreatedFormFromID, publishingPath} from "@/helpers/firebaseHelpers";
import * as uuid from "uuid";
import {addFormToWantedCampaigns, removeFormFromUnwantedCampaigns} from "@/helpers/campaignsHelpers";
import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";
import {isValidAddress} from "@/helpers/mailHelpers";

export const saveCreatorFormFB = (creatorID, formID, form) => {

  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .set(form);

};

export const saveFormCampaignFB = (campaignID, campaign) => {

  return Firebase.database().ref(campaignPath.concat(campaignID))
    .set(campaign);

};

export const saveFormCampaignsFB = (campaigns) => {

  return Firebase.database().ref(campaignPath)
    .set(campaigns);

};

export const saveAndFilterCampaignsFB = (form, campaigns, campaignsIDKeepingForm) => {

  //remove the unwated ones
  let filteredCampaigns = removeFormFromUnwantedCampaigns(form.id, campaigns, campaignsIDKeepingForm);

  //add to the wanted ones
  filteredCampaigns = addFormToWantedCampaigns(form, campaigns, campaignsIDKeepingForm);

  saveFormCampaignsFB(filteredCampaigns);

};


export const setFormsCampaignFB = (campaignID, forms) => {

  return Firebase.database().ref(campaignPath.concat(campaignID).concat('/forms')).once('value', (snapshot) => {
    const campaigns = snapshot.val() || []; //we get the current campaign forms

    forms.forEach(f => {
      const formIndex = campaigns.find(cf => cf.id === f.id);

      //we override if the form exists
      //if the form doesn't exist, we add it
      if(formIndex >=0) campaigns[formIndex] = f;
      else campaigns.push(f);
    });

    //we set the new array
    Firebase.database().ref(campaignPath.concat(campaignID).concat('/forms')).set(campaigns);
  });

};

export const setFormCampaignFB = (campaignID, form) => {

  return Firebase.database().ref(campaignPath.concat(campaignID).concat('/forms')).once('value', (snapshot) => {
    const campaigns = snapshot.val() || []; //we get the current campaign forms

      const formIndex = campaigns.find(cf => cf.id === form.id);

      //we override if the form exists
      //if the form doesn't exist, we add it
      if(formIndex >=0) campaigns[formIndex] = form;
      else campaigns.push(form);


    console.log("newCampaign", campaigns);

    //we set the new array
    Firebase.database().ref(campaignPath.concat(campaignID).concat('/forms')).set(campaigns);
  });

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

//be careful, we put the "nom" property (non open source perspective here...)
const parseGenericFormToUser = (form, entity) => {
  const parsedForm = {id: uuid.v4(), title: `${form.title} - ${entity.nom}`};

  //if there is a contact, add it as an entry point and send him an email
  if(entity.contact){
    const emailAdress = entity.contact;

    if(isValidAddress(emailAdress)){

      parsedForm.entryPoint = {};

      const userID = getUserIdFromEmail(emailAdress);

      parsedForm.entryPoint[userID] =
        {
          email: emailAdress,
          id: userID,
          name: getNameFromEmail(emailAdress),
          company: getDomainFromEmail(emailAdress)
        };

       /**************\
      |THE MAIL IZEERE|
      \**************/
    }

  }

  //parse entries
  const entriesObject = {};
  form.entries.forEach(e => {

    if (e.generic) {
      if(e.grouped) e.group = uuid.v4();

      const parsedEntries = parseGenericEntry(e, entity);
      parsedEntries.forEach(pe => {
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
  const createdForms = [];

  Object.keys(entities).forEach(entityKey => {
    const parsedForm = parseGenericFormToUser(creatorForm, entities[entityKey]);
    writePublishedCreatorFormFB(parsedForm);

    createdForms.push({id: parsedForm.id, title: parsedForm.title});
  });

  return createdForms;
};



export const publishGenericFormsFB = (creatorID, formID, entities, formCampaigns = []) => {

  //we fetch the form in firebase
  //then we publish it

  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .on('value', function (snapshot) {
      const value = snapshot.val();
      if (value) {
        const createdForms = generateAndPublishForms(value, entities);

        formCampaigns.forEach(campaignID => setFormsCampaignFB(campaignID,  createdForms));

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


/////////////// GENERATE ////

//Only generate
const writeGeneratedCreatorFormFB = (creatorID, form) => {
  return Firebase.database().ref(getCreatedFormFromID(creatorID, form.id))
    .set(form);
};

//Only Generate
const parseGenericEntryToCreator = (entry, entity) => {
  const parsedEntries = [];
  let parsedEntry = {...entry};

  //we get the desired property
  const prop = entity[parsedEntry.genericProperty];

  delete parsedEntry.generic;

  //create a question for each property element
  if (prop.constructor === Array) {
    prop.map(p => {
      const question =
        {
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
          type: parsedEntry.type,
          answers: parsedEntry.answers
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
        type: parsedEntry.type,
        answers: parsedEntry.answers
      }
    );
  }

  return parsedEntries;
};

//Only Generate
const parseGenericFormToCreator = (form, entity) => {
  const parsedForm = {id: uuid.v4(), title: `${form.title} (${entity.nom})`};

  //parse entries
  const entriesObject = {};
  form.entries.forEach(e => {

    if (e.generic) {
      if(e.grouped) e.group = uuid.v4();

      const parsedEntries = parseGenericEntryToCreator(e, entity);
      parsedEntries.forEach(pe => {
        entriesObject[pe.id] = {...pe};
      });
    }
    else {
      entriesObject[e.id] = {...e, answers: e.answers, type: e.type};
    }
  });

  parsedForm.entries = Object.values(entriesObject);

  return parsedForm;
};

//Only generated
const generateForms = (creatorID, creatorForm, entities) => {
  const createdForms = [];


  Object.keys(entities).forEach(entityKey => {
    const parsedForm = parseGenericFormToCreator(creatorForm, entities[entityKey]);
    writeGeneratedCreatorFormFB(creatorID, parsedForm);

    //the name is created with the "promoteur" name
    createdForms.push({id: parsedForm.id, title: parsedForm.title });
  });

  return createdForms;
};

//Generate only
export const generateGenericFormsFB = (creatorID, formID, entities, publishingCampaigns = []) => {
  //we fetch the form in firebase
  //then we save it into user's datas
  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .on('value', function (snapshot) {
      const value = snapshot.val();

      if (value) {
        const createdForms = generateForms(creatorID, value, entities);

        if(publishingCampaigns.length > 0 ){
          publishingCampaigns.forEach(campaignID => setFormsCampaignFB(campaignID,  createdForms) );
        }
      }
    });

};
