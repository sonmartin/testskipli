import { api } from "../constants/api";
import type { EditProfilePayload, MarkLessonDonePayload, MyLessonsResponse, StudentPayload } from "../types/dashboard";
import AppAPIInstance from "./configApi";

export const dashboardService = {
    students: () => AppAPIInstance.get(api.DASHBOARD.STUDENTS),

    addStudent: (data: StudentPayload) =>
        AppAPIInstance.post(api.DASHBOARD.ADDSTUDENT, data),

    editStudent: (phone: string, data: Partial<StudentPayload> & { newPhone?: string }) =>
        AppAPIInstance.put(api.DASHBOARD.EDITSTUDENT(phone), data),
    editProfile: (data: EditProfilePayload) =>
        AppAPIInstance.put(api.DASHBOARD.EDITPROFILE, data),
    deleteStudent: (phone: string) =>
        AppAPIInstance.delete(api.DASHBOARD.DELETESTUDENT(phone)),
    assignLesson: (studentPhone: string, title: string, description: string) =>
        AppAPIInstance.post(api.DASHBOARD.ASSIGNLESSON, { studentPhone, title, description }),
    getMyLessons: (phone: string) =>
        AppAPIInstance.get<MyLessonsResponse>(`${api.DASHBOARD.MYLESSONS}?phone=${phone}`),
    markLessonDone: (payload: MarkLessonDonePayload) =>
        AppAPIInstance.post(api.DASHBOARD.MARKLESSONDONE, payload),
};