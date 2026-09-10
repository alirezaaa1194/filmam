import { Spinner } from "../ui";

export function LoadingScreen() {
  return (
    <div className="flex h-svh w-full flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo.svg" alt="" className="h-24 w-24 animate-pulse drop-shadow-lg" />
        <h1 className="text-2xl font-bold tracking-tight">loading</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        loading
      </div>
    </div>
  );
}
