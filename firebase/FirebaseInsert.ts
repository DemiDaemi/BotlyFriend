import { firestore } from 'firebase-admin';
import { admin } from './Firebase'


export class FirebaseInsert {
    // Initialize the Firebase Admin SDK
    private db: FirebaseFirestore.Firestore;

    constructor() {
        this.db = admin.firestore();
    }

    // Insert data into the "ExtraLoot" collection
    async insertExtraLoot(week: string, character: string, loot: string[]) {
        const weekRef = this.db.collection('ExtraLoot').doc(week);
        await weekRef.update({
            [character]: firestore.FieldValue.arrayUnion(loot)
        });
    }
}