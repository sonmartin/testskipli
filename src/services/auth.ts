import { api } from "../constants/api";
import AppAPIInstance from "./configApi";

export const authService = {
    createAccessCode: (data: { phone: string }) => AppAPIInstance.post(api.AUTH_USER.CREATEACCESSCODE, data),
    validateAccessCode: (data: { phone: string; code: string }) => AppAPIInstance.post(api.AUTH_USER.VALIDATEACCESSCODE, data),
};