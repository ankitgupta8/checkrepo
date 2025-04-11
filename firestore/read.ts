import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import app from '../firebase';


const db = getFirestore(app);
const todosCollection = collection(db, 'studentRequests');
const teachersCollection = collection(db, 'teacherRequests');

const mediaCollection = collection(db, 'media');

export async function fetchOnlyMyTodoList(uid: string) {
  const myTodosQuery = query(todosCollection, where('userId', '==', uid));
  return await getDocs(myTodosQuery);
}
export async function fetchOnlyMyTodoList2(uid: string) {
  try {
    console.log('Fetching teacher requests for uid:', uid);
    const myTodosQuery = query(teachersCollection, where('userId', '==', uid));
    const querySnapshot = await getDocs(myTodosQuery);
    console.log('Query snapshot:', querySnapshot);
    console.log('Number of documents:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('No documents found for this user');
      return querySnapshot;
    }

    querySnapshot.forEach((doc) => {
      console.log('Document data:', doc.id, doc.data());
    });

    return querySnapshot;
  } catch (error) {
    console.error('Error in fetchOnlyMyTodoList2:', error);
    throw error;
  }
}
export async function fetchOnLocationStudent(dist: string) {
  const myTodosQuery = query(todosCollection, where('district', '==', dist));
  return await getDocs(myTodosQuery);
}
export async function fetchWholeTodoListStudent() {
  const myTodosQuery = query(todosCollection);
  console.log((await getDocs(myTodosQuery)),'this is whole todolist please check this');
  return await getDocs(myTodosQuery);
}
export async function fetchWholeTodoListTeacher() {
  const myTodosQuery = query(teachersCollection);
  return await getDocs(myTodosQuery);
}

export async function fetchItemsBasedOnType(
  uid: string,
  fileType: 'image' | 'video'
) {
  const myMediaQuery = query(
    mediaCollection,
    where('userId', '==', uid),
    where('fileType', '==', fileType)
  );
  return await getDocs(myMediaQuery);
}
