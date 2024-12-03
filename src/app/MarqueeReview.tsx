import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Dewi",
    username: "@dewi",
    body: "The items here are incredible! The Bali souvenir I bought is so beautiful and unique. I'm really happy with my purchase.",
    img: "/profile-image/dewi.png",
  },
  {
    name: "John",
    username: "@johnny_us",
    body: "I purchased a beautiful Balinese mask and it’s now the highlight of my collection. I can feel the cultural richness in every detail!",
    img: "/profile-image/john.png",
  },
  {
    name: "Made",
    username: "@made",
    body: "The quality of the Bali souvenirs is outstanding! Each item has great artistic value. Thank you for offering such amazing products!",
    img: "/profile-image/made.png",
  },
  {
    name: "Wayan",
    username: "@wayan",
    body: "I'm very satisfied with the Bali handicrafts I bought. The quality is exceptional and the designs are authentically Balinese.",
    img: "/profile-image/wayan.png",
  },
  {
    name: "Emma",
    username: "@emma_ca",
    body: "I got a beautiful handwoven sarong, and it’s just perfect! So soft and vibrant in color. The quality is top-notch.",
    img: "/profile-image/emma.png",
  },
  {
    name: "Putri",
    username: "@putri",
    body: "The Bali souvenir I received is even more beautiful than I imagined. It's high quality and unique. I love it!",
    img: "/profile-image/putri.png",
  },
  {
    name: "Sukma",
    username: "@sukma",
    body: "The collection of Bali souvenirs here is stunning. Each piece carries the culture and story of Bali in its design.",
    img: "/profile-image/sukma.png",
  },
  {
    name: "Ketut",
    username: "@ketut",
    body: "I bought several Bali handicrafts, and they are all fantastic! I highly recommend this place to anyone looking for authentic Bali souvenirs.",
    img: "/profile-image/ketut.png",
  },
  {
    name: "Sarah",
    username: "@sarah_uk",
    body: "Absolutely love my Balinese wood carving! The craftsmanship is beyond amazing. I feel like I brought a piece of Bali home with me.",
    img: "/profile-image/sarah.png",
  },
  {
    name: "Michael",
    username: "@michael_aus",
    body: "The handicrafts I bought here are of incredible quality. The intricate designs and attention to detail are unmatched. A true reflection of Balinese art!",
    img: "/profile-image/michael.png",
  },
  {
    name: "Liam",
    username: "@liam_usa",
    body: "Visiting Bali and buying local souvenirs was the highlight of my trip. The craftsmanship is exceptional, and I will treasure these souvenirs forever.",
    img: "/profile-image/liam.png",
  },
  {
    name: "Sophia",
    username: "@sophia_ita",
    body: "I purchased a beautiful Bali-style painting for my living room, and it has completely transformed the space. I couldn’t be happier with my choice!",
    img: "/profile-image/sophia.png",
  },
  {
    name: "Carlos",
    username: "@carlos_spain",
    body: "The hand-carved statues I bought here are breathtaking! It’s amazing how much culture and history are captured in such small pieces.",
    img: "/profile-image/carlos.png",
  },
  {
    name: "Lily",
    username: "@lily_fr",
    body: "I ordered a Balinese jewelry set, and it’s stunning! The delicate work and the colors are beautiful. This place has such a wonderful selection of souvenirs.",
    img: "/profile-image/lily.png",
  },
  {
    name: "Tom",
    username: "@tom_aus",
    body: "I’ve visited Bali multiple times, but I’ve never found such a great marketplace for authentic souvenirs before. The quality is incredible!",
    img: "/profile-image/tom.png",
  },
  {
    name: "Olivia",
    username: "@olivia_uk",
    body: "I bought some beautiful Balinese home decor pieces. They add so much character to my house. I will definitely be coming back for more!",
    img: "/profile-image/olivia.png",
  },
  {
    name: "David",
    username: "@david_usa",
    body: "The quality of the Bali souvenirs here is top-tier. I bought several wooden carvings, and they are each a work of art. Highly recommend this marketplace!",
    img: "/profile-image/david.png",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full overflow-hidden"
          width="32"
          height="32"
          alt=""
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="font-medium text-sm dark:text-white">
            {name}
          </figcaption>
          <p className="font-medium text-xs dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeReview() {
  return (
    <div className="relative flex flex-col justify-center items-center bg-background w-full h-[500px] overflow-hidden">
      <Marquee pauseOnHover className="[--duration:30s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:30s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-white dark:from-background w-1/3 pointer-events-none"></div>
      <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-white dark:from-background w-1/3 pointer-events-none"></div>
    </div>
  );
}
