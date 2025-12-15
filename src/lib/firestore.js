import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  runTransaction,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db } from "./firebase";

// --- Events ---

export async function createEvent(eventData) {
  // Ensure spotsRemaining is initialized correctly
  const dataToSave = {
    ...eventData,
    capacity: parseInt(eventData.capacity),
    spotsRemaining: parseInt(eventData.capacity),
    attendees: [],
    createdAt: new Date(),
  };
  
  const docRef = await addDoc(collection(db, "events"), dataToSave);
  return docRef.id;
}

export async function updateEvent(eventId, eventData) {
  const docRef = doc(db, "events", eventId);
  
  // Use transaction to ensure consistency if capacity changes
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(docRef);
    if (!snapshot.exists()) throw new Error("Event does not exist");
    
    const currentData = snapshot.data();
    const currentAttendees = currentData.attendees || [];
    
    let updates = { ...eventData };
    
    // Recalculate spotsRemaining if capacity is updated
    if (eventData.capacity) {
      const newCapacity = parseInt(eventData.capacity);
      updates.capacity = newCapacity;
      updates.spotsRemaining = newCapacity - currentAttendees.length;
    }

    transaction.update(docRef, updates);
  });
}

export async function deleteEvent(eventId) {
  await deleteDoc(doc(db, "events", eventId));
}

export async function getEvent(eventId) {
    const docRef = doc(db, "events", eventId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
}

// Real-time subscription for single event
export function subscribeToEvent(eventId, callback) {
    const docRef = doc(db, "events", eventId);
    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() });
        } else {
            callback(null);
        }
    });
}

// RSVP Logic (Transaction)
export async function toggleRSVP(eventId, user) {
    if (!user) throw new Error("User must be logged in");
    
    const docRef = doc(db, "events", eventId);
    
    await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef);
        if (!sfDoc.exists()) throw "Event does not exist!";
        
        const data = sfDoc.data();
        const attendees = data.attendees || [];
        const isJoined = attendees.some(a => a.uid === user.uid);
        
        if (isJoined) {
          // Leave
          const attendeeToRemove = attendees.find(a => a.uid === user.uid);
          transaction.update(docRef, {
            attendees: arrayRemove(attendeeToRemove),
            spotsRemaining: (data.spotsRemaining || 0) + 1
          });
        } else {
          // Join
          if (data.spotsRemaining <= 0) throw "Event is full!";
          
          const newAttendee = { 
            uid: user.uid, 
            displayName: user.displayName || "Anonymous", 
            photoURL: user.photoURL 
          };
          
          transaction.update(docRef, {
            attendees: arrayUnion(newAttendee),
            spotsRemaining: (data.spotsRemaining || 0) - 1
          });
        }
    });
}

// --- Queries ---

export async function getTrendingEvents() {
    const q = query(
        collection(db, "events"),
        orderBy("createdAt", "desc"),
        limit(3)
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
    });
    return events;
}

export async function getHostedEvents(userId) {
    const q = query(collection(db, "events"), where("createdBy", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getJoinedEvents(userId) {
    // Note: This relies on client-side filtering or array-contains if we indexed attendee UIDs.
    // Given the current structure in dashboard/page.js, we fetch all and filter.
    // Ideally, we should query where("attendees", "array-contains", { uid: ... }) but attendees is array of objects.
    // So we fetch all (as per original code) or improve it.
    // Let's stick to the original logic for now but encapsulated.
    
    const q = query(collection(db, "events"));
    const snapshot = await getDocs(q);
    const events = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.attendees && data.attendees.some(a => a.uid === userId)) {
            events.push({ id: doc.id, ...data });
        }
    });
    return events;
}

export function subscribeToEvents(callback) {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    return onSnapshot(q, (snapshot) => {
        const events = [];
        snapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
        callback(events);
    });
}

// --- Users ---

export async function getUserProfile(userId) {
    const docRef = doc(db, "users", userId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return null;
}

export async function saveUserProfile(userId, data) {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
    }, { merge: true });
}

export { setDoc }; // in case we need low level
import { setDoc } from "firebase/firestore";
