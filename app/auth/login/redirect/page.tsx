"use client";

import { connection } from "next/server";
import Redirect from "./Redirect";

export default async function SuccessPage() {
  await connection()
  return <Redirect />;
}