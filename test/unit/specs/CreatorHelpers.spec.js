import {deleteFormFromCreated, deleteFormFromPublished, deleteFormFromCampaigns, isUserInvitedToForm, deleteEntryPoint} from "@/helpers/creatorHelpers";
import {getUserIdFromEmail} from "@/helpers/accountHelpers";

const mockCreatedForms =
  {
    "001":
      {
        "title": "Formulaire 1",
        "id": "001"
      },
    "002":
      {
        "title": "Formulaire 2",
        "id": "002"
      },
    "003":
      {
        "title": "Formulaire 3",
        "id": "003"
      }
  };

const mockFormCampaigns =
  {
    "0001":
      {
        "id": "0001",
        "name": "c1"
      },
    "0002":
      {
        "forms": [{"id": "form1", "title": "f1"}],
        "id": "0002",
        "name": "c2"
      },
    "0003":
      {
        "forms": [{"id": "form1", "title": "f1"}, {"id": "form2", "title": "f2"}],
        "id": "0003",
        "name": "c3"
      }
  };

describe('creatorHelpers.js', () => {

  it('Should delete the form from created forms', () => {

    const mockFormID = "001";

    const mockCreatedFormsAfterDelete =
      {
        "002":
          {
            "title": "Formulaire 2",
            "id": "002"
          },
        "003":
          {
            "title": "Formulaire 3",
            "id": "003"
          }
      };

    expect(deleteFormFromCreated(mockCreatedForms, mockFormID)).toEqual(mockCreatedFormsAfterDelete);
  });

  it('Should not delete the form from created forms when it does not exists', () => {

    const mockFormID = "008";

    expect(deleteFormFromCreated(mockCreatedForms, mockFormID)).toEqual(mockCreatedForms);
  });

  it('Should delete the form from campaigns', () => {

    const mockFormID = "form1";

    const mockFormCampaignsAfterDelete = {
      "0001":
        {
          "id": "0001",
          "name": "c1"
        },
      "0002":
        {
          "id": "0002",
          "name": "c2"
        },
      "0003":
        {
          "forms": [{"id": "form2", "title": "f2"}],
          "id": "0003",
          "name": "c3"
        }
    };

    expect(deleteFormFromCampaigns(mockFormCampaigns, mockFormID)).toEqual(mockFormCampaignsAfterDelete);
  });

  it('Should not delete the form from campaigns when it does not exists', () => {

    const mockFormID = "form1";

    expect(deleteFormFromCampaigns(mockFormCampaigns, mockFormID)).toEqual(mockFormCampaigns);
  });

  const mockPublishedForms =
    [
      {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type": "radio"
                  },
                "id": "entry1",
                "index": 0,
                "question":
                  {
                    "title": "Question 1"
                  },
                "type": "radio"
              }
          },
        "id": "form1",
        "questionNumber": 1,
        "title": "Formulaire 1",
        "users":
          {
            "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
              {
                "company": "formoop",
                "email": "bob.michelo@formoop.com",
                "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name": "Bob Michelo"
              }
          }
      },
      {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"},
                        {"id": "option3", "text": "Option 3"},
                      ],
                    "type": "select"
                  },
                "id": "entry1",
                "index": 0,
                "question":
                  {"title": "Question 1"},
                "type": "select"
              },
            "entry2":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type": "radio"
                  },
                "id": "entry2",
                "index": 1,
                "question":
                  {"title": "Question 2"},
                "section": "Section 1",
                "type": "radio"
              },
            "entry3":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type": "radio"
                  },
                "id": "entry3",
                "index": 2,
                "question": {"title": "Question 3"},
                "section": "Section 2",
                "type": "radio"
              }
          },
        "entryPoint":
          {
            "entryPoint1":
              {
                "company": "formoop",
                "email": "bob.michelo@formoop.com",
                "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name": "Bob Michelo"
              }
          },
        "id": "form2",
        "questionNumber": 3,
        "sections":
          [
            "Section 1", "Section 2", "Section 3"
          ],
        "title": "Formulaire 2",
        "users":
          {
            "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
              {
                "company": "formoop",
                "email": "bob.michelo@formoop.com",
                "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name": "Bob Michelo"
              },
            "user2":
              {
                "company": "formoop",
                "email": "marcel.mazout@formoop.com",
                "id": "user2",
                "name": "Marcel Mazout"
              }
          }
      },
      {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type": "radio"
                  },
                "id": "entry1",
                "index": 0,
                "question":
                  {
                    "title": "Question 1"
                  },
                "type": "radio"
              }
          },
        "id": "form3",
        "questionNumber": 1,
        "title": "Formulaire 3"
      }
    ];

  const mockPublishedFormsAsObject =
    {
      form1: {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type":
                      "radio"
                  }
                ,
                "id":
                  "entry1",
                "index":
                  0,
                "question":
                  {
                    "title":
                      "Question 1"
                  }
                ,
                "type":
                  "radio"
              }
          }
        ,
        "id":
          "form1",
        "questionNumber":
          1,
        "title":
          "Formulaire 1",
        "users":
          {
            "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
              {
                "company":
                  "formoop",
                "email":
                  "bob.michelo@formoop.com",
                "id":
                  "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name":
                  "Bob Michelo"
              }
          }
      }
      ,
      form2: {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"},
                        {"id": "option3", "text": "Option 3"},
                      ],
                    "type":
                      "select"
                  }
                ,
                "id":
                  "entry1",
                "index":
                  0,
                "question":
                  {
                    "title":
                      "Question 1"
                  }
                ,
                "type":
                  "select"
              }
            ,
            "entry2":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type":
                      "radio"
                  }
                ,
                "id":
                  "entry2",
                "index":
                  1,
                "question":
                  {
                    "title":
                      "Question 2"
                  }
                ,
                "section":
                  "Section 1",
                "type":
                  "radio"
              }
            ,
            "entry3":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type":
                      "radio"
                  }
                ,
                "id":
                  "entry3",
                "index":
                  2,
                "question":
                  {
                    "title":
                      "Question 3"
                  }
                ,
                "section":
                  "Section 2",
                "type":
                  "radio"
              }
          }
        ,
        "entryPoint":
          {
            "entryPoint1":
              {
                "company":
                  "formoop",
                "email":
                  "bob.michelo@formoop.com",
                "id":
                  "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name":
                  "Bob Michelo"
              }
          }
        ,
        "id":
          "form2",
        "questionNumber":
          3,
        "sections":
          [
            "Section 1", "Section 2", "Section 3"
          ],
        "title":
          "Formulaire 2",
        "users":
          {
            "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
              {
                "company":
                  "formoop",
                "email":
                  "bob.michelo@formoop.com",
                "id":
                  "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                "name":
                  "Bob Michelo"
              }
            ,
            "user2":
              {
                "company":
                  "formoop",
                "email":
                  "marcel.mazout@formoop.com",
                "id":
                  "user2",
                "name":
                  "Marcel Mazout"
              }
          }
      }
      ,
      form3: {
        "entries":
          {
            "entry1":
              {
                "answer":
                  {
                    "answers":
                      [
                        {"id": "option1", "text": "Option 1"},
                        {"id": "option2", "text": "Option 2"}
                      ],
                    "type":
                      "radio"
                  }
                ,
                "id":
                  "entry1",
                "index":
                  0,
                "question":
                  {
                    "title":
                      "Question 1"
                  }
                ,
                "type":
                  "radio"
              }
          }
        ,
        "id":
          "form3",
        "questionNumber":
          1,
        "title":
          "Formulaire 3"
      }
    };

  it('Should delete the form from published when it exists', () => {

    const mockFormID = "form1";

    const mockPublishedFormsAfterDelete =
      {
        "form2":
          {
            "entries":
              {
                "entry1":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"},
                            {"id": "option3", "text": "Option 3"},
                          ],
                        "type": "select"
                      },
                    "id": "entry1",
                    "index": 0,
                    "question":
                      {"title": "Question 1"},
                    "type": "select"
                  },
                "entry2":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"}
                          ],
                        "type": "radio"
                      },
                    "id": "entry2",
                    "index": 1,
                    "question":
                      {"title": "Question 2"},
                    "section": "Section 1",
                    "type": "radio"
                  },
                "entry3":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"}
                          ],
                        "type": "radio"
                      },
                    "id": "entry3",
                    "index": 2,
                    "question": {"title": "Question 3"},
                    "section": "Section 2",
                    "type": "radio"
                  }
              },
            "entryPoint":
              {
                "entryPoint1":
                  {
                    "company": "formoop",
                    "email": "bob.michelo@formoop.com",
                    "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                    "name": "Bob Michelo"
                  }
              },
            "id": "form2",
            "questionNumber": 3,
            "sections":
              [
                "Section 1", "Section 2", "Section 3"
              ],
            "title": "Formulaire 2",
            "users":
              {
                "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
                  {
                    "company": "formoop",
                    "email": "bob.michelo@formoop.com",
                    "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                    "name": "Bob Michelo"
                  },
                "user2":
                  {
                    "company": "formoop",
                    "email": "marcel.mazout@formoop.com",
                    "id": "user2",
                    "name": "Marcel Mazout"
                  }
              }
          },
        "form3":
          {
            "entries":
              {
                "entry1":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"}
                          ],
                        "type": "radio"
                      },
                    "id": "entry1",
                    "index": 0,
                    "question":
                      {
                        "title": "Question 1"
                      },
                    "type": "radio"
                  }
              },
            "id": "form3",
            "questionNumber": 1,
            "title": "Formulaire 3",
          }
      };

    expect(deleteFormFromPublished(mockPublishedFormsAsObject, mockFormID)).toEqual(mockPublishedFormsAfterDelete);
  });

  it('Should not delete the form from published when it does not exists', () => {

    const mockFormID = "form125";

    const mockPublishedFormsAfterDelete =
      {
        "form1":
          {
            "entries":
              {
                "entry1":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"}
                          ],
                        "type": "radio"
                      },
                    "id": "entry1",
                    "index": 0,
                    "question":
                      {
                        "title": "Question 1"
                      },
                    "type": "radio"
                  }
              },
            "id": "form1",
            "questionNumber": 1,
            "title": "Formulaire 1",
            "users":
              {
                "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
                  {
                    "company": "formoop",
                    "email": "bob.michelo@formoop.com",
                    "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                    "name": "Bob Michelo"
                  }
              }
          },

        "form2": {
          "entries":
            {
              "entry1":
                {
                  "answer":
                    {
                      "answers":
                        [
                          {"id": "option1", "text": "Option 1"},
                          {"id": "option2", "text": "Option 2"},
                          {"id": "option3", "text": "Option 3"},
                        ],
                      "type": "select"
                    },
                  "id": "entry1",
                  "index": 0,
                  "question":
                    {"title": "Question 1"},
                  "type": "select"
                },
              "entry2":
                {
                  "answer":
                    {
                      "answers":
                        [
                          {"id": "option1", "text": "Option 1"},
                          {"id": "option2", "text": "Option 2"}
                        ],
                      "type": "radio"
                    },
                  "id": "entry2",
                  "index": 1,
                  "question":
                    {"title": "Question 2"},
                  "section": "Section 1",
                  "type": "radio"
                },
              "entry3":
                {
                  "answer":
                    {
                      "answers":
                        [
                          {"id": "option1", "text": "Option 1"},
                          {"id": "option2", "text": "Option 2"}
                        ],
                      "type": "radio"
                    },
                  "id": "entry3",
                  "index": 2,
                  "question": {"title": "Question 3"},
                  "section": "Section 2",
                  "type": "radio"
                }
            },
          "entryPoint":
            {
              "entryPoint1":
                {
                  "company": "formoop",
                  "email": "bob.michelo@formoop.com",
                  "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                  "name": "Bob Michelo"
                }
            },
          "id": "form2",
          "questionNumber": 3,
          "sections":
            [
              "Section 1", "Section 2", "Section 3"
            ],
          "title": "Formulaire 2",
          "users":
            {
              "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=":
                {
                  "company": "formoop",
                  "email": "bob.michelo@formoop.com",
                  "id": "Ym9iLm1pY2hlbG9AZm9ybW9vcC5jb20=",
                  "name": "Bob Michelo"
                },
              "user2":
                {
                  "company": "formoop",
                  "email": "marcel.mazout@formoop.com",
                  "id": "user2",
                  "name": "Marcel Mazout"
                }
            }
        },
        "form3":
          {
            "entries":
              {
                "entry1":
                  {
                    "answer":
                      {
                        "answers":
                          [
                            {"id": "option1", "text": "Option 1"},
                            {"id": "option2", "text": "Option 2"}
                          ],
                        "type": "radio"
                      },
                    "id": "entry1",
                    "index": 0,
                    "question":
                      {
                        "title": "Question 1"
                      },
                    "type": "radio"
                  }
              },
            "id": "form3",
            "questionNumber": 1,
            "title": "Formulaire 3",
          }
      };

    expect(deleteFormFromPublished(mockPublishedFormsAsObject, mockFormID)).toEqual(mockPublishedFormsAfterDelete);
  });

  it('Should be true when the user is invited to the form', () => {

    const mockFormID = "form2";
    const mockUser = {email:"bob.michelo@formoop.com"};

    expect(isUserInvitedToForm(mockFormID, mockUser, mockPublishedForms)).toBe(true);
  });

  it('Should be false when the user is not invited to the form', () => {

    const mockFormID = "form2";
    const mockUserEmail = {email: 'unknown'};

    expect(isUserInvitedToForm(mockFormID, mockUserEmail, mockPublishedForms)).toBe(false);
  });

  it('Should be false when the form does not have invited users', () => {

    const mockFormID = "form3";
    const mockUserEmail = {email: 'noUsers'};

    expect(isUserInvitedToForm(mockFormID, mockUserEmail, mockPublishedForms)).toBe(false);
  });

  const mockFormEntryPoints = {
  "user1ID":
    {
      "company":"formoop",
      "email":"user1@formoop.com",
      "id":"user1ID",
      "name":"user1"
    },
    "user2ID":
      {
        "company":"formoop",
        "email":"user2@formoop.com",
        "id":"user2ID",
        "name":"user2"
      },
  };

  it('Should delete entry point when it exists', () => {

    const mockEntryPointID = "user1ID";
    const mockFormEntryAfterDelete = {
      "user2ID":
        {
          "company":"formoop",
          "email":"user2@formoop.com",
          "id":"user2ID",
          "name":"user2"
        }
    };

    expect(deleteEntryPoint(mockFormEntryPoints, mockEntryPointID)).toEqual(mockFormEntryAfterDelete);
  });

  it('Should not delete entry point when it does not exists', () => {

    const mockEntryPointID = "user25ID";

    expect(deleteEntryPoint(mockFormEntryPoints, mockEntryPointID)).toEqual(mockFormEntryPoints);
  });

});
