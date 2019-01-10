import * as Firebase from 'firebase'
import {campaignPath, getCreatedFormFromID, publishingPath} from "@/helpers/firebaseHelpers";

export const saveCreatorFormFB = (creatorID, formID, form) => {

  return Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
    .set(form);

};

export const saveFormCampaignFB = (campaignID, campaign) => {

  return Firebase.database().ref(campaignPath.concat(campaignID))
    .set(campaign);

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
    const answer = {type:e.type, answers:e.answers};

    entriesObject[e.id] = {...e, answers:null, answer};
  });
  parsedForm.entries = entriesObject;

  return parsedForm;
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
