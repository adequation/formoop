import {entryResult, parseAnswered, parseNotAnswered, convertAnswerIdToText, parseUsers, parseForm, parseCampaign} from "@/helpers/jsonExportHelpers";


describe('jsonExportHelpers.js', () => {
  let mockedEntries = {
    e1: {
      answer: {
        answers: [{
            id: "e1a1",
            text: "option 1",
          }
        ],
        type: "textarea",
      },
      id: "e1",
      index: 1,
      question: {
        title: "Texte"
      },
      required: false,
      section: "Ecologie",
      type: "textarea",
    },
    e2: {
      answer: {
        answers: [{
              id: "e2a1",
              text: "option 1",
          }
        ],
        type: "text",
      },
      id: "e2",
      index: 4,
      question: {
        title: "Courte"
      },
      required: false,
      section: "Ecologie",
      type: "text",
    },
    e3: {
      answer: {
        answers: [
           {
            id: "e3a1",
            text: "option 1",
          }
        , {
            id: "e3a2",
            text: "option 2",
        }, {
            id: "e3a3",
            text: "option 3",
        }, {
            id: "e3a4",
            text: "option 4",
        }],
        type: "select",
      },
      id: "e3",
      index: 3,
      question: {
        title: "Liste"
      },
      required: false,
      section: "Ecologie",
      type: "select",
    },
    e4:{
      answer: {
        answers: [{
            id: "e4a1",
            text: "option 1",
        }, {
            id: "e4a2",
            text: "option 2",
        }, {
            id: "e4a3",
            text: "option 3",
        }, {
            id: "e4a4",
            text: "option 4",
        }],
        type: "checkbox",
      },
      id: "e4",
      index: 2,
      question: {
        title: "Cases"
      },
      required: false,
      section: "Ecologie",
      type: "checkbox",
    } ,
    e5: {
      answer: {
        answers: [{
            id: "e5a1",
            text: "option 1",
        }, {
            id: "e5a2",
            text: "option 2",
        }, {
            id: "e5a3",
            text: "option 3",
        }, {
            id: "e5a4",
            text: "option 4",
        }],
        type: "radio",
      },
      id: "e5",
      index: 0,
      question: {
        title: "choix"
      },
      required: false,
      section: "Ecologie",
      type: "radio",
    },

  };


  /*const mockedUserAnswers = {
    e1: { cUBxLmZy : "azeaze aze"},
    e2: { cUBxLmZy : "aze"},
    e3: { cUBxLmZy : "e3a2"},
    e4: { cUBxLmZy : ["e4a2","e4a3"]},
    e5: { cUBxLmZy : ["e5a3","e5a4"]},
  }*/

  const mockedUserAnswers = {
    e1: ["azeaze aze"],
    e2: ["aze"],
    e3: ["e3a2"],
    e4: ["e4a2","e4a3"],
    e5: ["e5a3","e5a4"],
  }

  const mockedUsers = {
    cUBxLmZy: {
      company : "q",
      email: "q@q.fr",
      id: "cUBxLmZy",
      name: "q"
    }
  }

  const mockedForm = {
    entries: mockedEntries,
    id: "form1",
    title: "TestForm",
    users: mockedUsers,
    usersAnswers: mockedUserAnswers
  }

  const expectedParsedAnswers =  [
    {
      answers: ["azeaze aze"],
      id: "e1",
      question: "Texte",
      type: "textarea"
    },
    {
      answers: ["aze"],
      id: "e2",
      question: "Courte",
      type: "text"
    },
    {
      answers: [
        {
          id: "e3a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e3a2",
          nbanswers: 1,
          text: "option 2"
        },
        {
          id: "e3a3",
          nbanswers: 0,
          text: "option 3"
        },
        {
          id: "e3a4",
          nbanswers: 0,
          text: "option 4"
        }],
      id: "e3",
      question: "Liste",
      type: "select"
    },
    {
      answers: [
        {
          id: "e4a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e4a2",
          nbanswers: 1,
          text: "option 2"
        },
        {
          id: "e4a3",
          nbanswers: 1,
          text: "option 3"
        },
        {
          id: "e4a4",
          nbanswers: 0,
          text: "option 4"
        }
        ],
      id: "e4",
      question: "Cases",
      type: "checkbox"
    },
    {
      answers: [
        {
          id: "e5a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e5a2",
          nbanswers: 0,
          text: "option 2"
        },
        {
          id: "e5a3",
          nbanswers: 1,
          text: "option 3"
        },
        {
          id: "e5a4",
          nbanswers: 1,
          text: "option 4"
        }
        ],
      id: "e5",
      question: "choix",
      type: "radio"
    }
    ]


  it('Should  return expected object for entry 1', () => {
    const expectedObject = {question: "Texte", id: "e1", type: "textarea", answers: ["azeaze aze"]};
    expect(entryResult(mockedEntries.e1,mockedUserAnswers)).toEqual(expectedObject )
  });

  it('Should  return expected object for entry 2', () => {
    const expectedObject = {question: "Courte", id: "e2", type: "text", answers: ["aze"]};
    expect(entryResult(mockedEntries.e2,mockedUserAnswers)).toEqual(expectedObject )
  });

  it('Should  return expected object for entry 3', () => {
    const expectedObject ={
      answers: [
          {id: "e3a1", text: "option 1", nbanswers: 0},
          {id: "e3a2", text: "option 2", nbanswers: 1},
          {id: "e3a3", text: "option 3", nbanswers: 0},
          {id: "e3a4", text: "option 4", nbanswers: 0}
        ],
      id: "e3",
      question: "Liste",
      type: "select"
    };
    expect(entryResult(mockedEntries.e3,mockedUserAnswers)).toEqual(expectedObject )
  });

  it('Should  return expected object for entry 4', () => {
    const expectedObject ={
      answers: [
          {id: "e4a1", text: "option 1", nbanswers: 0},
          {id: "e4a2", text: "option 2", nbanswers: 1},
          {id: "e4a3", text: "option 3", nbanswers: 1},
          {id: "e4a4", text: "option 4", nbanswers: 0}
        ],
      id: "e4",
      question: "Cases",
      type: "checkbox"
    };
    expect(entryResult(mockedEntries.e4,mockedUserAnswers)).toEqual(expectedObject )
  });

  it('Should  return expected object for entry 5', () => {
    const expectedObject ={
      answers: [
          {id: "e5a1", text: "option 1", nbanswers: 0},
          {id: "e5a2", text: "option 2", nbanswers: 0},
          {id: "e5a3", text: "option 3", nbanswers: 1},
          {id: "e5a4", text: "option 4", nbanswers: 1}
        ],
      id: "e5",
      question: "choix",
      type: "radio"
    };
    expect(entryResult(mockedEntries.e5,mockedUserAnswers)).toEqual(expectedObject )
  });


  ////////////////////////////////////////////////////////////////////

  it ('should return expected object for brut form', () =>{

    expect(parseAnswered(mockedForm)).toEqual(expectedParsedAnswers)

  });

  it ('should return expected object for brut form', () =>{

    expect(parseNotAnswered(mockedForm)).toEqual([])

  });


  const secondExpectedParsedAnswers = [
    {
      answers: [
        {
          id: "e3a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e3a2",
          nbanswers: 1,
          text: "option 2"
        },
        {
          id: "e3a3",
          nbanswers: 0,
          text: "option 3"
        },
        {
          id: "e3a4",
          nbanswers: 0,
          text: "option 4"
        }],
      id: "e3",
      question: "Liste",
      type: "select"
    },
    {
      answers: [
        {
          id: "e4a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e4a2",
          nbanswers: 1,
          text: "option 2"
        },
        {
          id: "e4a3",
          nbanswers: 1,
          text: "option 3"
        },
        {
          id: "e4a4",
          nbanswers: 0,
          text: "option 4"
        }
      ],
      id: "e4",
      question: "Cases",
      type: "checkbox"
    },
    {
      answers: [
        {
          id: "e5a1",
          nbanswers: 0,
          text: "option 1"
        },
        {
          id: "e5a2",
          nbanswers: 0,
          text: "option 2"
        },
        {
          id: "e5a3",
          nbanswers: 1,
          text: "option 3"
        },
        {
          id: "e5a4",
          nbanswers: 1,
          text: "option 4"
        }
      ],
      id: "e5",
      question: "choix",
      type: "radio"
    }
  ]

  /*const secondMockedUserAnswers = {
    e3: { cUBxLmZy : "e3a2"},
    e4: { cUBxLmZy : ["e4a2","e4a3"]},
    e5: { cUBxLmZy : ["e5a3","e5a4"]},
  }*/

  const secondMockedUserAnswers = {
    e3:  ["e3a2"],
    e4:  ["e4a2","e4a3"],
    e5:  ["e5a3","e5a4"],
  }

  const secondMockedForm = {
    entries: mockedEntries,
    id: "form2",
    title: "TestForm2",
    users: mockedUsers,
    usersAnswers: secondMockedUserAnswers
  }


  it ('should return expected object for brut form', () =>{

    expect(parseAnswered(secondMockedForm)).toEqual(secondExpectedParsedAnswers)

  });

  it ('should return expected object for brut form', () =>{

    expect(parseNotAnswered(secondMockedForm)).toEqual([
      {"answers": "no Answers", "id": "e1", "question": "Texte", "type": "textarea"},
      {"answers": "no Answers", "id": "e2", "question": "Courte", "type": "text"}])

  });

///////////////////////////////////////////////////////////////////////////////////////////:

  it ('should return only one text answer', () => {

    expect(convertAnswerIdToText(mockedUserAnswers.e1, mockedEntries.e1)).toEqual(
      ["azeaze aze"]
    );
  });


  it ('should return an array of multiple text answers', () => {

    expect(convertAnswerIdToText(mockedUserAnswers.e4, mockedEntries.e4)).toEqual(
      ["option 2", "option 3"]
    );
  });

  ////////////////////////////////////////////////////////////////////////////////////////////

  it ('should return an arrays of user objects', () => {

    expect(parseUsers(mockedForm)).toEqual(
      [{
        email: "q@q.fr",
        givenAnswers: [],
        name: "q"
      }]
    );
  });

//////////////////////////////////////////////////////////////////////////////////////////////

  const expectedParsedForm =
    {
      answeredEntries:
        [
          {
            answers: ["azeaze aze"],
            id: "e1",
            question: "Texte",
            type: "textarea"
          },
          {
            answers: ["aze"],
            id: "e2",
            question: "Courte",
            type: "text"
          },
          {
            answers:
              [
                {
                  id: "e3a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e3a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e3a3",
                  nbanswers: 0,
                  text: "option 3"
                },
                {
                  id: "e3a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
            id: "e3",
            question: "Liste",
            type: "select"
          },
          {
            answers:
              [
                {
                  id: "e4a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e4a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e4a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e4a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
            id: "e4",
            question: "Cases",
            type: "checkbox"
          },
          {
            answers:
              [
                {
                  id: "e5a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e5a2",
                  nbanswers: 0,
                  text: "option 2"
                },
                {
                  id: "e5a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e5a4",
                  nbanswers: 1,
                  text: "option 4"
                }
              ],
            id: "e5",
            question: "choix",
            type: "radio"
          }
          ],
      notAnsweredEntries: [],
      title: "TestForm",
      users: [
        {
          email: "q@q.fr",
          givenAnswers: [],
          name: "q"
        }
        ]
    }

  it ('should return expectedParsedForm', () => {

    expect(parseForm(mockedForm)).toEqual(expectedParsedForm);
  });

  const secondExpectedParsedFrom =
    {
      answeredEntries:
        [
          {
            answers:
              [
                {
                  id: "e3a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e3a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e3a3",
                  nbanswers: 0,
                  text: "option 3"
                },
                {
                  id: "e3a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
            id: "e3",
            question: "Liste",
            type: "select"
          },
          {
            answers:
              [
                {
                  id: "e4a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e4a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e4a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e4a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
            id: "e4",
            question: "Cases",
            type: "checkbox"
          },
          {
            answers:
              [
                {
                  id: "e5a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e5a2",
                  nbanswers: 0,
                  text: "option 2"
                },
                {
                  id: "e5a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e5a4",
                  nbanswers: 1,
                  text: "option 4"
                }
              ],
            id: "e5",
            question: "choix",
            type: "radio"
          }
        ],
      notAnsweredEntries:
        [
          {
            answers: "no Answers",
            id: "e1",
            question: "Texte",
            type: "textarea"
          },
          {
            answers: "no Answers",
            id: "e2",
            question: "Courte",
            type: "text"
          }
        ],
      title: "TestForm2",
      users:
        [
          {
            email: "q@q.fr",
            givenAnswers: [],
            name: "q"
          }
        ]
    }


  it ('should return secondExpectedParsedFrom', () => {

    expect(parseForm(secondMockedForm)).toEqual(secondExpectedParsedFrom);
  });


  const campagne = {
    closedForms : [
      mockedForm,
      secondMockedForm
    ],
    id: "campagne1",
    name: "testCampagne",
    publishedForms: []
  }


  const expectedParsedCampaign =
    {
      closedForms: [
        {
          answeredEntries: [
            {
              answers: ["azeaze aze"],
              id: "e1",
              question: "Texte",
              type: "textarea"
            },
            {
              answers: ["aze"],
              id: "e2",
              question: "Courte",
              type: "text"
            },
            {
              answers: [
                {
                  id: "e3a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e3a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e3a3",
                  nbanswers: 0,
                  text: "option 3"
                },
                {
                  id: "e3a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
              id: "e3",
              question: "Liste",
              type: "select"
            },
            {
              answers: [
                {
                  id: "e4a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e4a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e4a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e4a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
              id: "e4",
              question: "Cases",
              type: "checkbox"
            },
            {
              answers: [
                {
                  id: "e5a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e5a2",
                  nbanswers: 0,
                  text: "option 2"
                },
                {
                  id: "e5a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e5a4",
                  nbanswers: 1,
                  text: "option 4"
                }
              ],
              id: "e5",
              question: "choix",
              type: "radio"
            }
          ],
          notAnsweredEntries: [],
          title: "TestForm",
          users: [
            {
              email: "q@q.fr",
              givenAnswers: [],
              name: "q"
            }
          ]
        },
        {
          answeredEntries: [
            {
              answers: [
                {
                  id: "e3a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e3a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e3a3",
                  nbanswers: 0,
                  text: "option 3"
                },
                {
                  id: "e3a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
              id: "e3",
              question: "Liste",
              type: "select"
            },
            {
              answers: [
                {
                  id: "e4a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e4a2",
                  nbanswers: 1,
                  text: "option 2"
                },
                {
                  id: "e4a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e4a4",
                  nbanswers: 0,
                  text: "option 4"
                }
              ],
              id: "e4",
              question: "Cases",
              type: "checkbox"
            },
            {
              answers: [
                {
                  id: "e5a1",
                  nbanswers: 0,
                  text: "option 1"
                },
                {
                  id: "e5a2",
                  nbanswers: 0,
                  text: "option 2"
                },
                {
                  id: "e5a3",
                  nbanswers: 1,
                  text: "option 3"
                },
                {
                  id: "e5a4",
                  nbanswers: 1,
                  text: "option 4"
                }
              ],
              id: "e5",
              question: "choix",
              type: "radio"
            }
          ],
          notAnsweredEntries: [
            {
              answers: "no Answers",
              id: "e1",
              question: "Texte",
              type: "textarea"
            },
            {
              answers: "no Answers",
              id: "e2",
              question: "Courte",
              type: "text"
            }
          ],
          title: "TestForm2",
          users: [
            {
              email: "q@q.fr",
              givenAnswers: [],
              name: "q"
            }
          ]
        }
      ],
      id: "campagne1",
      name: "testCampagne",
      publishedForms: []
    }

  it ('should return expectedParsedCampaign', () => {

    expect(parseCampaign(campagne)).toEqual(expectedParsedCampaign);
  });

});

