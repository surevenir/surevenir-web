"use client";

import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Footer from "@/components/footer";
import NavigationBar from "@/components/navigation-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { BorderBeam } from "@/components/ui/border-beam";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import Particles from "@/components/ui/particles";
import SparklesText from "@/components/ui/sparkles-text";
import TextRevealByWord from "@/components/ui/text-reveal";
import { TypographyMuted } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { BentoDemo } from "./BentoGrid";
import { MarqueeProduct } from "./MarqueeProduct";
import { MarqueeReview } from "./MarqueeReview";

export default function HomePage() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  // Dynamically load Dialogflow Messenger
  useEffect(() => {
    const loadDialogflow = () => {
      const script = document.createElement("script");
      script.src =
        "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/df-messenger.js";
      script.async = true;
      document.body.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://www.gstatic.com/dialogflow-console/fast/df-messenger/prod/v1/themes/df-messenger-default.css";
      document.head.appendChild(link);
    };

    loadDialogflow();
  }, []);

  return (
    <div className="overflow-x-hidden">
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
              Introducing
            </span>
            <ChevronRight className="ml-1 transition-transform group-hover:translate-x-0.5 duration-300 ease-in-out size-3" />
          </AnimatedGradientText>
          <SparklesText text="Surevenir" className="py-8 text-center" />
          <SparklesText
            text="Scan and Find Souvenir Easily"
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
          <div className="dark:block relative hidden mt-32">
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
              <AccordionTrigger>What is Surevenir?</AccordionTrigger>
              <AccordionContent>
                Surevenir is an application that scans souvenirs to provide
                their name, similar products, and pricing to prevent scams. It
                also features a marketplace.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                How does the scanning feature work?
              </AccordionTrigger>
              <AccordionContent>
                The scanning feature uses image recognition technology to
                identify souvenirs and provide relevant details, including
                similar items and their prices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is Surevenir user-friendly?</AccordionTrigger>
              <AccordionContent>
                Yes. Surevenir is designed with an intuitive user interface,
                making it easy for all users to navigate and use.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Does it include a marketplace?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Surevenir includes a built-in marketplace where users can
                browse and purchase souvenirs securely.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Is pricing information reliable?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Pricing information is sourced from verified sellers to
                ensure accuracy and transparency.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Can it detect counterfeit items?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Surevenir helps identify authentic souvenirs and highlights
                products that might not meet authenticity standards.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Is it secure?</AccordionTrigger>
              <AccordionContent>
                Yes. Surevenir uses robust encryption to protect user data and
                ensure safe transactions in the marketplace.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>
                Is it compatible with all devices?
              </AccordionTrigger>
              <AccordionContent>
                Yes. Surevenir is designed to work seamlessly across
                smartphones, tablets, and desktops.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <MarqueeProduct />
        </div>
      </div>
      <Footer />
      <Particles
        className="-z-50 fixed inset-0"
        quantity={100}
        ease={80}
        color={color}
        refresh
      />

      {/* Dialogflow Chatbot */}
      <div className="right-4 bottom-4 z-50 fixed mt-12">
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <df-messenger
          project-id="submission-mgce-juniawan"
          agent-id="e5dc7f79-4500-4abf-a75c-ef9fcb1cecb9"
          language-code="en"
          max-query-length="-1">
          <df-messenger-chat-bubble chat-title="SureVenir Chatbot"></df-messenger-chat-bubble>
          </df-messenger>
          `,
          }}
        />
      </div>
    </div>
  );
}
