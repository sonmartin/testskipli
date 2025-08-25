export const api = {
    AUTH_USER: {
        CREATEACCESSCODE: "createAccessCode",
        VALIDATEACCESSCODE: "validateAccessCode"
    },
    DASHBOARD: {
        STUDENTS: "students",
        ADDSTUDENT: "addStudent",
        EDITSTUDENT: (phone: string) => `editStudent/${phone}`,
        DELETESTUDENT: (phone: string) => `deleteStudent/${phone}`,
        ASSIGNLESSON: "assignLesson",
        MYLESSONS: "myLessons",
        MARKLESSONDONE: "markLessonDone",
        EDITPROFILE: "editProfile"
    },
    CHAT: {
        MESSAGES: (romId: string) => `messages/${romId}`
    }
}

export const querykey = {
    AUTH_USER: {
        CREATEACCESSCODE: "createAccessCode",
        VALIDATEACCESSCODE: "validateAccessCode"
    },
    DASHBOARD: {
        STUDENTS: "students",
        ADDSTUDENT: "addStudent",
        EDITSTUDENT: "editStudent",
        DELETESTUDENT: "deleteStudent",
        ASSIGNLESSON: "assignLesson",
        MYLESSONS: "myLessons",
        MARKLESSONDONE: "markLessonDone",
        EDITPROFILE: "editProfile"
    },
    CHAT: {
        MESSAGES: "messages"
    }
}