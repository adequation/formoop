import {entryResult} from "@/helpers/jsonExportHelpers";


describe('jsonExportHelpers.js', () => {
  const mockedEntries = {
    e1: {
      answer: {
        answers: {
          e1a1: {
            id: "e1a1",
            text: "option 1",
          }
        },
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
        answers: {
          e2a1: {
            id: "e2a1",
            text: "option 1",
          }
        },
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
        answers: {
          e3a1: {
            id: "e3a1",
            text: "option 1",
          },
          e3a2: {
            id: "e3a2",
            text: "option 2",
          },
          e3a3: {
            id: "e3a3",
            text: "option 3",
          },
          e3a4: {
            id: "e3a4",
            text: "option 4",
          }
        },
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
        answers: {
          e4a1: {
            id: "e4a1",
            text: "option 1",
          },
          e4a2: {
            id: "e4a2",
            text: "option 2",
          },
          e4a3: {
            id: "e4a3",
            text: "option 3",
          },
          e4a4: {
            id: "e4a4",
            text: "option 4",
          }
        },
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
        answers: {
          e5a1: {
            id: "e5a1",
            text: "option 1",
          },
          e5a2: {
            id: "e5a2",
            text: "option 2",
          },
          e5a3: {
            id: "e5a3",
            text: "option 3",
          },
          e5a4: {
            id: "e5a4",
            text: "option 4",
          }
        },
        type: "radio",
      },
      id: "e4",
      index: 0,
      question: {
        title: "choix"
      },
      required: false,
      section: "Ecologie",
      type: "radio",
    },

  };


  const mockedUserAnswers = {
    e1: { cUBxLmZy : "azeaze aze"},
    e2: { cUBxLmZy : "aze"},
    e3: { cUBxLmZy : "e3a2"},
    e4: { cUBxLmZy : ["e4a2","e4a3"]},
    e5: { cUBxLmZy : ["e5a3","e5a4"]},
  }



  it('Should  return expected object', () => {
    const expectedObject = {question: "Texte", id: "e1", type: "textarea", answer: "azeaze aze"};
    expect(entryResult(mockedEntries.e1,mockedUserAnswers)).toEqual(expectedObject )
  });


});

