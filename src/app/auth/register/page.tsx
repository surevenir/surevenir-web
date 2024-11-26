"use client";

import { RegisterForm } from "@/components/register-form";
import Particles from "@/components/ui/particles";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function RegisterPage() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <>
      <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
      <div className="flex justify-center items-center w-full h-[100vh]">
        <RegisterForm />
      </div>
    </>
  );
}
