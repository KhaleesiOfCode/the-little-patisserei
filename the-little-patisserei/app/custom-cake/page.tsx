import { redirect } from "next/navigation";

export default function CustomCakePage() {
  redirect("/menu?category=Celebration%20Cakes");
}
