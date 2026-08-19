"use client"
import { createContext } from "react";
import { UserType } from "../types";

export const __UserContext = createContext<UserType | null>(null);
