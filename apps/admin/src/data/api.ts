export const __AppApis = {
  auth: {
    signup: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/signup`,
    signupVerify: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/signup-verify`,
    login: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/login`,
    loginVerify: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/login-verify`,
    logout: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/logout`,
    me: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/me`,
    refresh: `${import.meta.env.VITE_FILMAM_SERVER_URL}/auth/refresh`,
  },
}
