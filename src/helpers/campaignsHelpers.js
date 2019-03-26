export function getFormCampaign(campaignsFromFB, formID) {

  const campaigns = Object.keys(campaignsFromFB).map(id => campaignsFromFB[id]);

  const campaignsContainingFormId = [];

  campaigns.forEach(campaign => {
    if (!!campaign.forms) {
      const form = campaign.forms.find(form => form.id === formID);
      if (!!form) campaignsContainingFormId.push(campaign.id)
    }
  });

  return campaignsContainingFormId;
}


export function doesCampaignExists(campaignsFromFB, newCampaignName) {

  const campaigns = Object.keys(campaignsFromFB).map(id => {
    return campaignsFromFB[id];
  });

  let alreadyExists = false;

  campaigns.forEach(campaign => {
    if(campaign.name === newCampaignName) return alreadyExists = true
  });

  return alreadyExists;
}

export function doesCampaignContainsForm(formID, campaign){
  if (!!campaign.forms) {
    return !!campaign.forms.find(form => form.id === formID);
  }

  return false;
}

export function removeFormFromUnwantedCampaigns(formID, campaignsFromFB, campaignsIDKeepingForm){
  const campaignsFBCopy = {...campaignsFromFB};

  const campaigns = Object.keys(campaignsFromFB).map(id => {
    return campaignsFromFB[id];
  });

  campaigns.forEach(c => {
    if (!campaignsIDKeepingForm.includes(c.id) && !!c.forms) {
      const index = c.forms.findIndex(f => f.id === formID);
      if(index >=0) {
        c.forms.splice(index, 1);
        campaignsFBCopy[c.id].forms = c.forms.slice();
      }
    }
  });

  return campaignsFBCopy;
}

export function addFormToWantedCampaigns(form, campaignsFromFB, campaignsIDToAddFormIn){
  const campaignsFBCopy = {...campaignsFromFB};

  const campaigns = Object.keys(campaignsFromFB).map(id => {
    return campaignsFromFB[id];
  });

  campaigns.forEach(c => {
    if (campaignsIDToAddFormIn.includes(c.id)) {
      if(!c.forms) c.forms = [form];
      else{
        const index = c.forms.findIndex(f => f.id === form.id);
        if(index >=0) {
          c.forms[index] = form;
        }else{
          c.forms.push(form);
        }

        campaignsFBCopy[c.id].forms = c.forms.slice();
      }
    }
  });

  return campaignsFBCopy;
}

// Return a new campaign object with the forms for the campaign in parametters
export function getCampaignWithForms( campaign, publishedForms, closedForms){
  let campaignForms = [];
  campaign.forms.forEach( form => {
    let findedForm = publishedForms.find( pf => pf.id === form.id);
    if(findedForm) campaignForms.push(findedForm);
    else {
      findedForm = closedForms.find( cf => cf.id === form.id);
      if (findedForm) campaignForms.push(findedForm);
    }
  });
  return {
    name: campaign.name,
    id: campaign.id,
    forms: campaignForms,
  }
}
