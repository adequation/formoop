//// GENERAL
import {getUserMetadata} from "@/thunks/userAccountThunks";

export const nativeFbFunctions = {

  getCurrentUser: () => Firebase.auth().currentUser,

  signOut: () => Firebase.auth().signOut(),

  signInWithEmailAndPassword: (email, password) => Firebase.auth().signInWithEmailAndPassword(email, password),

  createUserWithEmailAndPassword: (email, password) => Firebase.auth().createUserWithEmailAndPassword(email, password)

};

///// USERS

export const userPath = '/users/';

export const getUser = (userID) => userPath.concat().concat(userID);


///// CREATED FORMS

import * as Firebase from "firebase";

export const getCreatedFormFromID = (creatorID, formID) => '/users/'.concat(creatorID)
  .concat("/createdForms/").concat(formID);

export const getCreatedForms = (creatorID) => '/users/'.concat(creatorID).concat("/createdForms");

///// PUBLISHED FORMS

export const getPublishedFormFromID   = (formID) => publishingPath.concat(formID);
export const getPublishedFormUserPath = (formID, userID) => getPublishedFormFromID(formID).concat(getUser(userID));
export const getPublishedFormEntryPointPath = (formID) => getPublishedFormFromID(formID).concat('/entryPoint/');
export const getPublishedFormEntryPointUserPath = (formID, userID) => getPublishedFormEntryPointPath(formID).concat(userID);
export const publishingPath = '/publishedForms/';

export const getPublishedFormUsersPath = (formID) => getPublishedFormFromID(formID).concat(userPath);

///// CLOSED FORMS

export const closedPath = '/closedForms/';
export const getClosedFormFromID = (formID) => closedPath.concat(formID);

///// ANSWERING

export const getAnsweringPath = (formID) => getPublishedFormFromID(formID).concat('/usersAnswers/');

export const getEntryAnsweringPath = (formID, entryID, userID) =>
  getAnsweringPath(formID).concat(entryID).concat('/').concat(userID);


///// CAMPAIGNS

export const campaignPath = '/formCampaigns/';
