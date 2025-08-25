import { useMutation } from "@tanstack/react-query";
import { querykey } from "../constants/api";
import { authService } from "../services/auth";

export const useSendCode = () => {
  return useMutation({
    mutationKey: [querykey.AUTH_USER.CREATEACCESSCODE],
    mutationFn: authService.createAccessCode,
  });
};

export const useVerifyCode = () => {
  return useMutation({
    mutationKey: [querykey.AUTH_USER.VALIDATEACCESSCODE],
    mutationFn: authService.validateAccessCode,
  });
};