"use client";

import { use } from "react";
import { UserContext } from "../../../../contexts";
import HeaderLoginButton from "../loginButton/loginButton.index";
import { ProfileDropdown } from "../profileDropdown/profileDropdown.index";

function ProfileSectionComp() {
  const user = use(UserContext);
  return user ? <ProfileDropdown user={user} /> : <HeaderLoginButton />;
}

export default ProfileSectionComp;
