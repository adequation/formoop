import {getFormCampaign , doesCampaignExists} from "@/helpers/campaignsHelpers";

const mockFormCampaigns = {
  "001":{
    "forms":[
      {"id":"aaa","title":"Formulaire A"},
      {"id":"bbb","title":"Formulaire B"},
      {"id":"ccc","title":"Formulaire C"}
    ],
    "id":"c-001",
    "name":"campaign 001"
  },
  "002":{
    "forms":[
      {"id":"aaa","title":"Formulaire A"},
      {"id":"ddd","title":"Formulaire D"},
      {"id":"eee","title":"Formulaire E"}
    ],
    "id":"c-002",
    "name":"campaign 002"
  }
};

describe('campaignsHelpers.js', () => {
  it('Should find a campaign with the same name', () => {

    const mockNewCampaignName = "campaign 001";

    expect(doesCampaignExists(mockFormCampaigns, mockNewCampaignName)).toBe(true);
  });

  it('Should not find a campaign with the same name', () => {

    const mockNewCampaignName = "campaign 008";

    expect(doesCampaignExists(mockFormCampaigns, mockNewCampaignName)).toBe(false);
  });

  it('Should get an array with campaigns that contains the form', () => {

    const mockFormID = "aaa";
    const expected = ["c-001", "c-002"];

    expect(getFormCampaign(mockFormCampaigns, mockFormID)).toEqual(expected);
  });

  it('Should get an empty array when  no campaigns contains the form', () => {

    const mockFormID = "vvv";
    const expected = [];

    expect(getFormCampaign(mockFormCampaigns, mockFormID)).toEqual(expected);
  });

});
