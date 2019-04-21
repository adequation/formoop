export function deleteFormFromCreated(createdForms, formID) {
  let createdFormsCopy = {...createdForms};

  const forms = Object.keys(createdForms).map(id => {
    return createdFormsCopy[id];
  });

  const index = forms.findIndex(f => f.id === formID);
  if (index >= 0) {
    forms.splice(index, 1);
  }

  let createdFormsChanged = {};

  forms.forEach(f => {
    createdFormsChanged[f.id] = {...f}
  });

  return createdFormsChanged;
}

export function deleteFormFromPublished(publishedForms, formID) {
  let publishedFormsCopy = {...publishedForms};

  const forms = Object.keys(publishedForms).map(id => {
    return publishedFormsCopy[id];
  });

  const index = forms.findIndex(f => f.id === formID);
  if (index >= 0) {
    forms.splice(index, 1);
  }

  let publishedFormsChanged = {};

  forms.forEach(f => {
    publishedFormsChanged[f.id] = {...f}
  });

  return publishedFormsChanged;
}

export function deleteFormFromCampaigns(formCampaigns, formID) {
  let formCampaignCopy = {...formCampaigns};

  const campaigns = Object.keys(formCampaigns).map(id => {
    return formCampaigns[id];
  });

  campaigns.forEach(c => {
    let campaignForms = []
    if (c.forms) {
      c.forms.forEach(cf => {
        if (cf.id !== formID) campaignForms.push(cf);
      });
      formCampaignCopy[c.id].forms = campaignForms;
      if (formCampaignCopy[c.id].forms.length <= 0) {
        delete formCampaignCopy[c.id].forms
      }
    }
  });

  return formCampaignCopy;
}
