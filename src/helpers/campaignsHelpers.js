export function getFormCampaign(campaignsFromFB, formID) {
  const campaignsId = Object.keys(campaignsFromFB);

  const campaigns = campaignsId.map(id => {
    return campaignsFromFB[id];
  });

  const campaignsContainingFormId = [];

  campaigns.forEach(campaign => {
    if (!!campaign.forms) {
      const form = campaign.forms.find(form => form.id === formID);
      if (!!form) campaignsContainingFormId.push(campaign.id)
    }
  });

  console.log(campaignsContainingFormId);

  return campaignsContainingFormId;
}


export function doesCampaignExists(campaignsFromFB, newCampaignName) {
  const campaignsId = Object.keys(campaignsFromFB);

  const campaigns = campaignsId.map(id => {
    return campaignsFromFB[id];
  });

  let alreadyExists = false;

  campaigns.forEach(campaign => {
    if(campaign.name === newCampaignName) return alreadyExists = true
  });

  return alreadyExists;
}
