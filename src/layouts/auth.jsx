import SignIn from "@/pages/auth/sign-in";
import { Routes, Route, Navigate } from "react-router-dom";

export function Auth() {
  console.log("Auth layout loaded");

  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}
