///// CREATED FORMS

export const getCreatedFormFromID = (creatorID, formID) => '/users/'.concat(creatorID)
  .concat("/createdForms/").concat(formID);

export const getCreatedForms = (creatorID) => '/users/'.concat(creatorID).concat("/createdForms");

///// PUBLISHED FORMS

export const getPublishedFormFromID = (formID) => publishingPath.concat(formID);

export const publishingPath = '/publishedForms/';
