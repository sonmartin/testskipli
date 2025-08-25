export interface StudentPayload {
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface AssignLessonPayload {
  studentPhone: string;
  title: string;
  description: string;
}

export interface Lesson {
  title: string;
  description: string;
  completed?: boolean;
  completedAt?: string;
}

export interface MyLessonsResponse {
  phone: string;
  lessons: Lesson[];
}

export interface MarkLessonDonePayload {
  phone: string;
  lessonId: string;
}

export interface EditProfilePayload {
  phone: string;
  name: string;
  email: string;
}

