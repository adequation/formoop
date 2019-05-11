import {getUserIdFromEmail} from "@/helpers/accountHelpers";

/////////////// DELETE FORM  ////

export function deleteFormFromCreated(createdForms, formID) {
  let createdFormsCopy = {...createdForms};

  delete createdFormsCopy[formID];

  return createdFormsCopy;
}

export function deleteFormFromPublished(publishedForms, formID) {
  //Array copy with slice
  const publishedFormsCopy = {...publishedForms};

  delete publishedFormsCopy[formID];

  return publishedFormsCopy;
}

export function deleteFormFromCampaigns(formCampaigns, formID) {
  let formCampaignCopy = {...formCampaigns};

  //here we need to go through campaigns
  //so going from object to array is great
  const campaigns = Object.keys(formCampaigns).map(id => formCampaigns[id]);

  campaigns.forEach(c => {

    let campaignForms = [];

    if (c.forms) {

      //here we want to keep all the forms, except ours
      //so use Array.filter
      campaignForms = c.forms.filter(cf => cf.id !== formID);

      formCampaignCopy[c.id].forms = campaignForms;

      if (campaignForms.length <= 0) {
        delete formCampaignCopy[c.id].forms
      }
    }
  });

  return formCampaignCopy;
}

/////////////// IS USER INVITED TO FORM ////

export function isUserInvitedToForm(formID, user, publishedForms ) {
  //retrieve the wanted form
  const myPublishedForm = publishedForms.find(f => f.id === formID);

  //if it doesn't exist, or doesn't contains users, return false
  if(!myPublishedForm) return false;
  if(!myPublishedForm.users) return false;

  //finally, we check if he's invited
  const userID = getUserIdFromEmail(user.email);
  return !!myPublishedForm.users[userID];
}

/////////////// DELETE ENTRY POINT ////

export function deleteEntryPoint(formEntryPoints, entryPointId ) {
  let formEntryCopy = {...formEntryPoints};

  delete formEntryCopy[entryPointId];

  return formEntryCopy;
}
