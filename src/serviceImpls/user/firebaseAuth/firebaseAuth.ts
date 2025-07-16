import admin, { ServiceAccount } from 'firebase-admin';

const serviceAccount: ServiceAccount = {
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    projectId: process.env.FIREBASE_PROJECT_ID as string,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;