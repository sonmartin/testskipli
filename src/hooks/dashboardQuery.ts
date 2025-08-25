import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AssignLessonPayload, EditProfilePayload, MarkLessonDonePayload, StudentPayload } from "../types/dashboard";
import { dashboardService } from "../services/dashboard";
import { querykey } from "../constants/api";


export const useStudents = () => {
    return useQuery({
        queryKey: [querykey.DASHBOARD.STUDENTS],
        queryFn: () => dashboardService.students(),
    });
};
export const useAddStudent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [querykey.DASHBOARD.ADDSTUDENT],
        mutationFn: (data: StudentPayload) => dashboardService.addStudent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.STUDENTS] });
        },
    });
};

export const useEditStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [querykey.DASHBOARD.EDITSTUDENT],
        mutationFn: ({
            phone,
            data,
        }: {
            phone: string;
            data: Partial<StudentPayload> & { newPhone?: string };
        }) => dashboardService.editStudent(phone, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.STUDENTS] });
        },
    });
};

export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [querykey.DASHBOARD.DELETESTUDENT],
        mutationFn: (phone: string) => dashboardService.deleteStudent(phone),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.STUDENTS] });
        },
    });
};

export const useAssignLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [querykey.DASHBOARD.ASSIGNLESSON],
        mutationFn: ({ studentPhone, title, description }: AssignLessonPayload) =>
            dashboardService.assignLesson(studentPhone, title, description),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.MYLESSONS] });
        },
    });
};

export const useMyLessons = (phone: string) => {
    return useQuery({
        queryKey: [querykey.DASHBOARD.MYLESSONS, phone],
        queryFn: () => dashboardService.getMyLessons(phone),
        enabled: !!phone,
    });
};

export const useMarkLessonDone = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: [querykey.DASHBOARD.MARKLESSONDONE],
        mutationFn: (payload: MarkLessonDonePayload) => dashboardService.markLessonDone(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.MYLESSONS] });
        },
    });
};

export const useEditProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: [querykey.DASHBOARD.EDITPROFILE],
        mutationFn: (data: EditProfilePayload) => dashboardService.editProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [querykey.DASHBOARD.STUDENTS] });
        },
    });
};