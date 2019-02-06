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

export const getPublishedFormFromID = (formID) => publishingPath.concat(formID);

export const publishingPath = '/publishedForms/';

///// ANSWERING

export const getAnsweringPath = (formID) => getPublishedFormFromID(formID).concat('/usersAnswers/');

export const getEntryAnsweringPath = (formID, entryID, userID) =>
  getAnsweringPath(formID).concat(entryID).concat('/').concat(userID);

///// INVITATIONS

export const getInvitationsPath = (formID) => getPublishedFormFromID(formID).concat('/invitedUsers/');

export const getEntryPointPath = (formID) => getPublishedFormFromID(formID).concat('/entryPoint/');

///// CAMPAIGNS

export const campaignPath = '/formCampaigns/';
