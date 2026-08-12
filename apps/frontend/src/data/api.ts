const base = process.env.NEXT_PUBLIC_FILMAM_SERVER_URL;

export const __AppApis = {
  auth: {
    signup: `${base}/auth/signup`,
    signupVerify: `${base}/auth/signup-verify`,
    login: `${base}/auth/login`,
    loginVerify: `${base}/auth/login-verify`,
    logout: `${base}/auth/logout`,
    me: `${base}/auth/me`,
    refresh: `${base}/auth/refresh`,
    changePassword: `${base}/auth/change-password`,
    forgetPassword: `${base}/auth/forget-password`,
    google: `${base}/auth/google`,
    googleCallback: `${base}/auth/google/callback`,
    cleanupOtp: `${base}/auth/internal/cleanup-otp`,
  },
  comment: {
    byMovie: (movieSlug: string) => `${base}/comment/movie/${movieSlug}`,
    byEpisode: (episodeSlug: string) => `${base}/comment/episode/${episodeSlug}`,
    vote: (commentId: number) => `${base}/comment/vote/${commentId}`,
  },
  contact: {
    create: `${base}/contact`,
  },
  country: {
    all: `${base}/country/all`,
  },
  episode: {
    bySlug: (episodeSlug: string) => `${base}/episode/${episodeSlug}`,
  },
  factor: {
    all: `${base}/factor/all`,
    publicBySlug: (factorSlug: string) => `${base}/factor/public/${factorSlug}`,
    moviesBySlug: (factorSlug: string) => `${base}/factor/${factorSlug}/movies`,
  },
  genre: {
    all: `${base}/genre/all`,
  },
  headerMenu: {
    publicAll: `${base}/header-menu/public/all`,
  },
  language: {
    all: `${base}/language/all`,
  },
  movie: {
    all: `${base}/movie/all`,
    bySlug: (slug: string) => `${base}/movie/${slug}`,
    recommended: (slug: string) => `${base}/movie/recommended/${slug}`,
  },
  notification: {
    send: `${base}/notification/send`,
  },
  role: {
    all: `${base}/role/all`,
  },
  season: {
    episodesBySlug: (seasonSlug: string) => `${base}/season/${seasonSlug}/episodes`,
  },
  section: {
    publicAll: `${base}/section/public/all`,
  },
  tag: {
    all: `${base}/tag/all`,
  },
  user: {
    deleteAccount: `${base}/user`,
    updateInfo: `${base}/user`,
  },
  userMovie: {
    all: `${base}/user-movie/all`,
    movieActions: (entityId: number) => `${base}/user-movie/movie_actions/${entityId}`,
    deleteAction: (actionId: number) => `${base}/user-movie/${actionId}`,
  },
};
