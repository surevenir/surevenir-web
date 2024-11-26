"use client";

import NavigationBar from "@/components/navigation-bar";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import SparklesText from "@/components/ui/sparkles-text";
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { MarqueeReview } from "./MarqueeReview";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Particles from "@/components/ui/particles";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import TextRevealByWord from "@/components/ui/text-reveal";
import { BentoDemo } from "./BentoGrid";
import { MarqueeProduct } from "./MarqueeProduct";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/footer";
import { BorderBeam } from "@/components/ui/border-beam";

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  return (
    <>
      <NavigationBar />
      <div className="px-8 md:px-16 lg:px-32 w-full">
        <div className="flex flex-col justify-center py-16 w-full">
          <AnimatedGradientText>
            🎉 <hr className="bg-gray-300 mx-2 w-px h-4 shrink-0" />{" "}
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`
              )}
            >
              Introducing SureVenir
            </span>
            <ChevronRight className="ml-1 transition-transform group-hover:translate-x-0.5 duration-300 ease-in-out size-3" />
          </AnimatedGradientText>
          <SparklesText text="Surevenir" className="py-8 text-center" />
          <SparklesText
            text="Scan and Buy Souvenir Easily"
            className="text-3xl text-center"
          />
          <TypographyMuted className="justify-center lg:px-32 py-4 text-center text-lg">
            Our goal is to enhance travel experiences, promote ethical shopping,
            support the local economy, and help preserve Balinese cultural
            heritage for future generations.
          </TypographyMuted>
          <MarqueeReview />

          <div className="block relative dark:hidden">
            <HeroVideoDialog
              className=""
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
              thumbnailAlt="Hero Video"
            />
            <BorderBeam duration={12} delay={9} />
          </div>
          <div className="dark:block relative hidden">
            <HeroVideoDialog
              className=""
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
              thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
              thumbnailAlt="Hero Video"
            />
            <BorderBeam duration={12} delay={9} />
          </div>

          <TextRevealByWord text="SureVenir can help you to find the best souvenirs." />

          <BentoDemo />
          <Accordion
            type="single"
            collapsible
            className="flex flex-col justify-center py-32"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if
                you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <MarqueeProduct />
        </div>
      </div>
      <Footer />
      <Particles
        className="fixed inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />
    </>
  );
}
