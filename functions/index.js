const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(async user => {
  // Check if user meets role criteria.
  if (user.email) {
    const adminUsers = admin.firestore().collection('adminUsers');
    const snapshot = await adminUsers.where('email', '==', user.email).get();
    const customClaims = snapshot.empty ? { player: true } : { admin: true };

    // Set custom user claims on this newly created user.
    return admin
      .auth()
      .setCustomUserClaims(user.uid, customClaims)
      .then(_ => {
        if (!snapshot.empty) {
          // Enable the user document in the users collection, it allows inmediate access
          const userUpdate = admin.firestore().collection('users');
          userUpdate.doc(user.uid).set({
            nickname: user.email,
            name: user.email,
            email: user.email,
            enable: true
          });
          // Log the new entry in the Firebase registers
          functions.logger.info(`User with email ${user.email} was added as admin and enabled!`);
        }
        // Update real-time database to notify client to force refresh.
        const metadataRef = admin.database().ref('metadata/' + user.uid);
        // Set the refresh time to the current UTC timestamp.
        // This will be captured on the client to force a token refresh.
        return metadataRef.set({ refreshTime: new Date().getTime() });
      })
      .catch(error => {
        functions.logger.error(`There was an error whilst adding ${user.email} as admin`, error);
        return;
      });   
  }
  functions.logger.console.warn(`There was no email supplied for user, no role added.`);
  return;
})
