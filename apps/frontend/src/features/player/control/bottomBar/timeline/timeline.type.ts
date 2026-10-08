export type TimelinePropsType = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  videoTime: number;
  setVideoTime: (t: number) => void;
  duration: number;
  isSeeking: boolean;
  setIsSeeking: (v: boolean) => void;
};
