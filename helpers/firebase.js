const admin = require("firebase-admin");

const {
  firebaseEmail,
  firebasePrivate,
  firebaseProjectId,
} = require("../config.json");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseEmail,
    privateKey: firebasePrivate,
  }),
  databaseURL: `https://${firebaseProjectId}.firebaseio.com`,
});

module.exports = admin;
