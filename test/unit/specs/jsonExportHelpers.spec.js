import {entryResult} from "@/helpers/jsonExportHelpers";


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


  const mockedUserAnswers = {
    e1: { cUBxLmZy : "azeaze aze"},
    e2: { cUBxLmZy : "aze"},
    e3: { cUBxLmZy : "e3a2"},
    e4: { cUBxLmZy : ["e4a2","e4a3"]},
    e5: { cUBxLmZy : ["e5a3","e5a4"]},
  }



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


});

