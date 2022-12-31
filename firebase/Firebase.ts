import * as fbadmin from "firebase-admin";

const {
  firebaseEmail,
  firebasePrivate,
  firebaseProjectId,
} = require("../config.json");

fbadmin.initializeApp({
  credential: fbadmin.credential.cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseEmail,
    privateKey: firebasePrivate,
  }),
  databaseURL: `https://${firebaseProjectId}.firebaseio.com`,
});

export const admin = fbadmin;
