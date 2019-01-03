//// GENERAL
export const nativeFbFunctions = {

  getCurrentUser: () => Firebase.auth().currentUser,

  signOut: () => Firebase.auth().signOut(),

  signInWithEmailAndPassword: (email, password) => Firebase.auth().signInWithEmailAndPassword(email, password),

  createUserWithEmailAndPassword: (email, password) => Firebase.auth().createUserWithEmailAndPassword(email, password)

};

///// CREATED FORMS

import * as Firebase from "firebase";

export const getCreatedFormFromID = (creatorID, formID) => '/users/'.concat(creatorID)
  .concat("/createdForms/").concat(formID);

export const getCreatedForms = (creatorID) => '/users/'.concat(creatorID).concat("/createdForms");

///// PUBLISHED FORMS

export const getPublishedFormFromID = (formID) => publishingPath.concat(formID);

export const publishingPath = '/publishedForms/';
