import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import app from '../firebase';

interface TodoItemInterface {
  name: string;
  province: string;
  district: string;
  specificLocation: string;
  class: string;
  subject: string;
  hoursToTeach: string;
  salary: string;
  phoneNumber: string;
  ownerId: string;
  photoURL?: string;
  timestamp: number;
}
interface TodoItemInterfaceTeacher {
  name: string;
  province: string;
  district: string;
  specificLocation: string;
  experience: string;
  subject: string;
  phoneNumber: number;
  ownerId: string;
}

interface StudentProfile {
  name: string;
  grade: string;
  subject: string;
  phoneNumber: string;
  photoURL: string;
  province: string;
  district: string;
  specificLocation: string;
  salary: string;
  teachingHours: string;
  userId: string;
  createdAt: Date;
}

const db = getFirestore(app);
const todosCollection = collection(db, 'studentRequests');
const teachersCollection = collection(db, 'teacherRequests');

export async function createTodoTask(data: TodoItemInterface) {
  
  const dbData = {
    createdAt: Timestamp.now(),
    completedAt: '',
    ...data,
  };
  console.log(dbData)
  return await addDoc(todosCollection, dbData);
}
export async function createTodoTaskTeacher(data: TodoItemInterfaceTeacher) {
  
  const dbData = {
    createdAt: Timestamp.now(),
    completedAt: '',
    ...data,
  };
  console.log(dbData, 'function createTodoTaskTeacher dbData')
  console.log(data, 'function createTodoTaskTeacher data')
  return await addDoc(teachersCollection, dbData);
}
