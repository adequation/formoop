import {
  getFormCampaign,
  doesCampaignExists,
  doesCampaignContainsForm,
  removeFormFromUnwantedCampaigns,
  addFormToWantedCampaigns
} from "@/helpers/campaignsHelpers";

const mockFormCampaigns = {
  "001": {
    forms: [
      {id: "aaa", title: "Formulaire A"},
      {id: "bbb", title: "Formulaire B"},
      {id: "ccc", title: "Formulaire C"}
    ],
    id: "c-001",
    name: "campaign 001"
  },
  "002": {
    forms: [
      {id: "aaa", title: "Formulaire A"},
      {id: "ddd", title: "Formulaire D"},
      {id: "eee", title: "Formulaire E"}
    ],
    id: "c-002",
    name: "campaign 002"
  },
  "003": {
    forms:[],
    id: "c-003",
    name: "campaign 003"
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


  it('Campaign should contains the form', () => {

    const mockFormID = "aaa";

    expect(doesCampaignContainsForm(mockFormID, mockFormCampaigns["001"])).toBe(true);
  });

  it('Campaign should not contains the form', () => {

    const mockFormID = "vvv";

    expect(doesCampaignContainsForm(mockFormID, mockFormCampaigns["001"])).toBe(false);
  });

  it('Campaign without forms should not contains the form', () => {

    const mockFormID = "vvv";

    expect(doesCampaignContainsForm(mockFormID, mockFormCampaigns["003"])).toBe(false);
  });

  /*
  it('Should remove a form from a campaign', () => {

    const mockFormID = "aaa";
    const mockCampaignsIDKeepingForm = ["c-002"];
    const expected = {
      "001": {
        forms: [
          {id: "bbb", title: "Formulaire B"},
          {id: "ccc", title: "Formulaire C"}
        ],
        id: "c-001",
        name: "campaign 001"
      },
      "002": {
        forms: [
          {id: "aaa", title: "Formulaire A"},
          {id: "ddd", title: "Formulaire D"},
          {id: "eee", title: "Formulaire E"}
        ],
        id: "c-002",
        name: "campaign 002"
      },
      "003": {
        forms: [],
        id: "c-003",
        name: "campaign 003"
      }
    };

    expect(removeFormFromUnwantedCampaigns(mockFormID, mockFormCampaigns, mockCampaignsIDKeepingForm)).toEqual(expected);
  });*/

  /*it('Should add the form to the given campaigns', () => {

    const mockFormToAdd = {id: "qqq", title: "Formulaire Q"};
    const mockWantedCampaigns = ["c-002","c-003"];
    const expected = {
      "001": {
        forms: [
          {id: "bbb", title: "Formulaire B"},
          {id: "ccc", title: "Formulaire C"}
        ],
        id: "c-001",
        name: "campaign 001"
      },
      "002": {
        forms: [
          {id: "aaa", title: "Formulaire A"},
          {id: "ddd", title: "Formulaire D"},
          {id: "eee", title: "Formulaire E"},
          {id: "qqq", title: "Formulaire Q"}
        ],
        id: "c-002",
        name: "campaign 002"
      },
      "003": {
        forms: [
          {id: "qqq", title: "Formulaire Q"}
        ],
        id :"c-003",
        name: "campaign 003"
      }
    };

    console.log(JSON.stringify(addFormToWantedCampaigns(mockFormToAdd, mockFormCampaigns, mockWantedCampaigns)))

    expect(addFormToWantedCampaigns(mockFormToAdd, mockFormCampaigns, mockWantedCampaigns)).toEqual(expected);
  });*/

});
