import { connection } from "next/server";

export default async function MetadataRuntimeMarkerComp() {
  await connection();
  return null;
}
