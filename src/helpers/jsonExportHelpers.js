import {filterEntries, getEntryAnswers, answerAmount, answeredEntries} from '@/helpers/userAnswersHelpers'

function entryResult(entry, usersAnswers) {
  let answersAmount = answerAmount(entry, usersAnswers);
  let result = [];
  if( entry.type === 'textarea' || entry.type === 'text'){
    // For string Answers, answerAmount set the string answer as key and NAN as value
    Object.keys(answersAmount).filter(key => isNaN(answersAmount[key]))
      .forEach(key => result.push(key))
  }
  else{
    entry.answer.answers.forEach(a => {
      a["nbanswers"] = answersAmount[a.id];
      result.push(a);
    })
  }

  return {
    question: entry.question.title,
    id: entry.id,
    type: entry.type,
    answers: result,
  }
}

function parseAnswered(brutForm){
  let answered = filterEntries("answered", Object.values(brutForm.entries), brutForm.usersAnswers);
  let answeredEntries = [];
  answered.forEach( AE => {
    answeredEntries.push(entryResult(AE, brutForm.usersAnswers))
  });
  return answeredEntries;
}

function parseNotAnswered(brutForm) {
  let notanswered = filterEntries("notAnswered", Object.values(brutForm.entries), brutForm.usersAnswers);
  let notAnsweredEntries = [];
  notanswered.forEach( NAE => {
    notAnsweredEntries.push(
      {
        question: NAE.question.title,
        id: NAE.id,
        type: NAE.type,
        answers: 'no Answers',
      }
    )
  });
  return notAnsweredEntries;
}

function convertAnswerIdToText(answer, entry){
  console.log(answer);
  if(entry.type === 'checkbox'){
    let textAnswer = [];
    answer.forEach(ua => {
      textAnswer.push(entry.answer.answers.find(a => a.id === ua).text);
    });
    return textAnswer;
  }
  if(entry.type === 'radio' || entry.type === 'select') return entry.answer.answers.find(a => a.id === answer).text;
  if(entry.type === 'text' || entry.type ==='textarea') return answer;
  return answer;
}

function givenAnswers(userID, answeredentries, brutForm, usersAnswers){
  let givenanswers = [];
  answeredentries.forEach( AE => {
    let userAnswer = usersAnswers[AE][userID];
    let entry = brutForm.entries[AE];
    givenanswers.push({
      question: entry.question.title,
      answer: convertAnswerIdToText(userAnswer, entry),
    })
  });
  return givenanswers;
}

function parseUsers(brutForm){
  let users = [];
  Object.keys(brutForm.users).forEach(userID =>{
    let answeredentries = answeredEntries(userID, brutForm.usersAnswers);
    if( answeredentries.length !== 0)
      users.push({
        name: brutForm.users[userID].name,
        email: brutForm.users[userID].email,
        givenAnswers: givenAnswers(userID, answeredentries, brutForm, brutForm.usersAnswers),
      });
    else{
      users.push({
        name: brutForm.users[userID].name,
        email: brutForm.users[userID].email,
        givenAnswers: [],
      })
    }
  });
  return users;
}

export function parseForm(brutForm){

  return {
    title: brutForm.title,
    answeredEntries: parseAnswered(brutForm),
    notAnsweredEntries: parseNotAnswered(brutForm),
    users: parseUsers(brutForm),
  }
}

export function parseCampaign(campaign){


}

