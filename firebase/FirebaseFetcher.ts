import { admin } from './Firebase'

export class FirebaseFetcher {
    async getDocument<T>(collection: string, documentId: string): Promise<T | null> {
        const doc = await admin.firestore().collection(collection).doc(documentId).get();
        return doc.exists ? doc.data() as T : null;
    }

    async getCollection<T>(collection: string): Promise<T[]> {
        const snapshot = await admin.firestore().collection(collection).get();
        return snapshot.docs.map(doc => doc.data() as T);
    }
}