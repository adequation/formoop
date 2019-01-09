import {publishingPath, publishingCampaignPath, getPublishedFormFromID} from "@/helpers/firebaseHelpers";

export const findFormPath = (publishedForms, publishedCampaign, formID) => {
  let path = ' ';
  if (publishedForms.find(form => form.id === formID)) path = publishingPath.concat(formID);
  else {
    publishedCampaign.forEach(campaign => {
      if (Object.keys(campaign.forms).find(formkey => {
        const form = campaign.forms[formkey];
        return form.id === formID
      })){
        console.log("finded");
        path = publishingCampaignPath.concat(campaign.campaignName).concat('/').concat(formID);
      }
    });
  }
  return path;
};
