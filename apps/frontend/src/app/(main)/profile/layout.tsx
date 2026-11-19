import UserPanelLayoutComp from "@/features/userPanel/userPanelLayout/userPanelLayout.index";

export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return <UserPanelLayoutComp>{children}</UserPanelLayoutComp>;
}
