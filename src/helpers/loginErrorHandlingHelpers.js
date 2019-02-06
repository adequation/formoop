export const invalidEmailMessage = "Le format de l'adresse email est erroné";
export const emailAlreadyUsedMessage = "L'adresse email est déjà utilisée";
export const weakPasswordMessage = "Le mot de passe doit contenir plus de 6 caractères";
export const userNotFoundMessage = "L'adresse mail ou le mot de passe est incorrect";

export function handleError(error) {
  let errorMessage = '';
  switch (error.code) {
    case 'auth/invalid-email':
      errorMessage = invalidEmailMessage;
      break;
    case 'auth/email-already-in-use':
      errorMessage = emailAlreadyUsedMessage;
      break;
    case 'auth/weak-password':
      errorMessage = weakPasswordMessage;
      break;
    case 'auth/user-not-found':
      errorMessage = userNotFoundMessage;
      break;
    case 'auth/wrong-password':
      errorMessage = userNotFoundMessage;
      break;

  }
  return errorMessage;
}
