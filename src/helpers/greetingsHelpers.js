import {greetings, thanks} from "@/greetings";

//Returns à random int between 0 and the array length minus one
export function getRandomArrayIndex(array) {
  return Math.floor(Math.random() * array.length)
}

//Returns a random greeting sentence from the users list
export function getRandomGreeting() {
  return greetings[getRandomArrayIndex(greetings)];
}

//Returns a random "thank you" sentence from the users list
export function getRandomThankYou() {
  return thanks[getRandomArrayIndex(thanks)];
}

//Parse a sentence with variables
//Right now, the parsing is intended with those values :
//NOM, ENTREPRISE, TITRE, HEURE, NBINVITES, POURCENTAGE_ACTUEL, POURCENTAGE_RESTANT
//but you could add any if you want, because we iterate on the keys
export function parseSentence(sentence, currentValues) {

  let newSentence = sentence;

  //we go trough our variables, replacing what can be
  Object.keys(currentValues).forEach(v => {
    newSentence = newSentence.replace(`@${v}`, currentValues[v]);
  });

  return newSentence;
}
