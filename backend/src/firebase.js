const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (err) {
    const path = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set';
    throw new Error(
      `Firebase Admin credentials okunamadi. GOOGLE_APPLICATION_CREDENTIALS=${path}. ` +
      'Firebase Console > Project settings > Service accounts > Generate new private key ile JSON indirip bu yola koy.'
    );
  }
}

const db = admin.firestore();
module.exports = { db, admin };
