// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzWXNxE9pvhxS44Ko0ngvFb-LFoMLy9Ow",
  authDomain: "investment-tracker-db.firebaseapp.com",
  projectId: "investment-tracker-db",
  storageBucket: "investment-tracker-db.appspot.com",
  messagingSenderId: "386849813058",
  appId: "1:386849813058:web:7208f3ec69df02d1e033db",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore();

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title);
    batch.set(docRef, object);
  });

  console.log("started");
  await batch.commit();
  console.log("done");
};

export const addShipmentInfo = async (collectionKey, shipmentInfo) => {
  try{
    await setDoc(doc(db, 'Investment', collectionKey), shipmentInfo);
    
  } catch (error){console.log('error has occured while adding shipment information! error: ', error)}
};

// fetching data from firebase DB
export const getInvestmentAndDocuments = async () => {
  const investmentRef = collection(db, "Investment");
  const q = query(investmentRef);

  const querySnapshot = await getDocs(q);
  const investmentMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
    const { title, shipments } = docSnapshot.data();
    acc[title.toLowerCase()] = {
      title: title,
      shipments: shipments
    }
    return acc;
  }, {});

  return investmentMap;
};
