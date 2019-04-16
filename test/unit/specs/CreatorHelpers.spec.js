import {deleteForm, deleteFormFromCampaigns} from "@/helpers/creatorHelpers";

const mockCreatedForms =
  {
    "001":
      {
        "title":"Formulaire 1",
        "id":"001"
      },
    "002":
      {
        "title":"Formulaire 2",
        "id":"002"
      },
    "003":
      {
        "title":"Formulaire 3",
        "id":"003"
      }
  };

const mockFormCampaigns =
  {
    "0001":
      {
        "id":"0001",
        "name":"c1"
      },
    "0002":
      {
        "forms":[{"id":"form1","title":"f1"}],
        "id":"0002",
        "name":"c2"
      },
    "0003":
      {
        "forms":[{"id":"form1","title":"f1"}, {"id":"form2","title":"f2"}],
        "id":"0003",
        "name":"c3"
      }
  };

describe('creatorHelpers.js', () => {

  it('Should delete the form from created forms', () => {

    const mockFormID = "001";

    const mockCreatedFormsAfterDelete =
      {
        "002":
          {
            "title":"Formulaire 2",
            "id":"002"
          },
        "003":
          {
            "title":"Formulaire 3",
            "id":"003"
          }
      };

    expect(deleteForm(mockCreatedForms, mockFormID)).toEqual(mockCreatedFormsAfterDelete);
  });

  it('Should not delete the form from created forms when it does not exists', () => {

    const mockFormID = "008";

    expect(deleteForm(mockCreatedForms, mockFormID)).toEqual(mockCreatedForms);
  });

  it('Should delete the form from campaigns', () => {

    const mockFormID = "form1";

    const mockFormCampaignsAfterDelete = {
      "0001":
        {
          "id":"0001",
          "name":"c1"
        },
      "0002":
        {
          "id":"0002",
          "name":"c2"
        },
      "0003":
        {
          "forms":[{"id":"form2","title":"f2"}],
          "id":"0003",
          "name":"c3"
        }
    };

    expect(deleteFormFromCampaigns(mockFormCampaigns, mockFormID)).toEqual(mockFormCampaignsAfterDelete);
  });

  it('Should not delete the form from campaigns when it does not exists', () => {

    const mockFormID = "form1";

    expect(deleteFormFromCampaigns(mockFormCampaigns, mockFormID)).toEqual(mockFormCampaigns);
  });

});
