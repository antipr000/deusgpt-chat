import * as admin from 'firebase-admin';
import { App, getApps } from 'firebase-admin/app';

import { serviceAccount } from '../../../../firebase-admin.config';

const firebase_admin: admin.app.App =
  getApps().length === 0
    ? admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      })
    : (getApps()[0] as admin.app.App);

async function getUidFromIdToken(idToken: string) {
  const decodedToken = await firebase_admin.auth().verifyIdToken(idToken);
  return decodedToken.uid;
}

export { firebase_admin, getUidFromIdToken };
