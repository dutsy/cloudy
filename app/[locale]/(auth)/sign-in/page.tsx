import EmailPasswordDemo from "./EmailPasswordDemo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function EmailPasswordPage() {
  return (
    <div>
      <EmailPasswordDemo />
    </div>
  );
}
