import Marquee from "@/components/ui/marquee";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { TypographyH4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

import { RocketIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    img: "https://avatar.vercel.sh/jack",
  },
  {
    img: "https://avatar.vercel.sh/jill",
  },
  {
    img: "https://avatar.vercel.sh/john",
  },
  {
    img: "https://avatar.vercel.sh/jane",
  },
  {
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    img: "https://avatar.vercel.sh/james",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img }: { img: string }) => {
  return (
    <figure
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="80" height="80" alt="" src={img} />
      </div>
    </figure>
  );
};

export function MarqueeProduct() {
  return (
    <div className="relative flex flex-col justify-center items-center bg-background mt-24 w-full h-[500px] overflow-hidden">
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {firstRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:40s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:50s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
      </Marquee>
      <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-white dark:from-background w-1/3 pointer-events-none"></div>
      <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-white dark:from-background w-1/3 pointer-events-none"></div>
      <div className="bottom-0 absolute inset-y-0 bg-gradient-to-t from-white dark:from-background to-transparent w-full pointer-events-none"></div>
      <div className="bottom-8 absolute flex flex-col justify-center items-center gap-4">
        <figure
          className={cn(
            "flex items-center justify-center cursor-pointer overflow-hidden rounded-xl border p-4",
            // light styles
            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
            // dark styles
            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
          )}
        >
          <RocketIcon width={64} height={64} />
        </figure>
        <TypographyH4 className="">So, what are you waiting for?</TypographyH4>
        <Link href={"/markets"}>
          <RainbowButton>
            Let's Explore <MoveRightIcon />
          </RainbowButton>
        </Link>
      </div>
    </div>
  );
}
