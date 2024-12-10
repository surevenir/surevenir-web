import {
  HousePlugIcon,
  MapPinHouseIcon,
  ShoppingBasketIcon,
  SearchIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import Marquee from "@/components/ui/marquee";
import { TypographyMuted } from "@/components/ui/typography";

type MarqueeData = {
  name: string;
  description: string;
  imgUrl: string;
};

const marketData: MarqueeData[] = [
  {
    name: "Geopark Batur Art Market",
    description:
      "The Geopark Batur Art Market is one of the traditional markets in Bali and is commonly used as a place to hunt for Balinese souvenirs. This market is located not far from tourist destinations such as Mount Batur Geopark, which is one of the geoparks recognized by UNESCO.",
    imgUrl: "/market-image/geopark-batur-art-market.png",
  },
  {
    name: "Kuta Art Market",
    description:
      "Located near Kuta Beach, it showcases a wide variety of locally crafted goods, including clothing, accessories, souvenirs, and artwork",
    imgUrl: "/market-image/kuta-art-market.png",
  },
  {
    name: "Kumbasari Art Market",
    description:
      "Sprawling market by the Badung River for Balinese crafts like rattan bags, batik fabric & carvings.",
    imgUrl: "/market-image/kumbasari-art-market.png",
  },
  {
    name: "Ubud Art Market",
    description:
      "This Market offers authentic Balinese goods, including silk scarves, handmade crockery, and woven bags, making it the perfect spot to find unique souvenirs crafted by local artisans.",
    imgUrl: "/market-image/ubud-art-market.png",
  },
  {
    name: "Guwang Art Market",
    description:
      "Guwang Art Market is what many consider to be the sister art market of Sukawati. The market is the main arts and souvenir shopping destination within the Guwang village community in Gianyar regency. It's also a nice alternate to the usually crowded Sukawati.",
    imgUrl: "/market-image/guwang-art-market.png",
  },
  {
    name: "Legian Art Market",
    description:
      "Legian Art Market offers traditional Balinese handicrafts, including jewelry, clothing, wood carvings, paintings, and souvenirs, in a vibrant atmosphere.",
    imgUrl: "/market-image/legian-art-market.png",
  },
  {
    name: "Tirta Empul Art Market",
    description:
      "Tirta Empul Art Market is a bustling marketplace near Bali's Tirta Empul Temple, offering a wide range of handcrafted Balinese arts, crafts, and souvenirs.",
    imgUrl: "/market-image/tirta-empul-art-market.png",
  },
  {
    name: "Badung Market",
    description:
      "Badung Market is a largest traditional market lies in the island’s busiest city, Denpasar. It offers a wide range of items, from essential everyday products to Balinese souvenirs.",
    imgUrl: "/market-image/badung-market.png",
  },
  {
    name: "Tegallalang Art Market",
    description:
      "Tegallalang Art Market offers a wide range of authentic and unique traditional Balinese crafts. Visitors can find a variety of silver accessories, artistic paintings, sandals, sarongs, t-shirts, and beach shorts. This market is the perfect place to shop for ethnic Balinese souvenirs and a complete selection of artistic items, making it a must-visit destination for art and culture enthusiasts.",
    imgUrl: "/market-image/tegallalang-art-market.png",
  },
  {
    name: "Prianka Ubud Art Market",
    description:
      "Prianka Ubud Art Market is located in Gianyar, Bali. It is known for its vibrant atmosphere where visitors can find a wide range of local arts and crafts. The market showcases Bali's rich culture, offering products such as handwoven textiles, jewelry, carvings, and paintings. This venue is part of the cultural experience of Ubud, attracting both tourists and locals who appreciate traditional Balinese craftsmanship.",
    imgUrl: "/market-image/prianka-ubud-art-market.png",
  },
];

const merchantData: MarqueeData[] = [
  {
    name: "The Keranjang Bali",
    description:
      "The Keranjang Bali presents the best MSME products with thematic Balinese spots that make your shopping experience even more memorable. The Keranjang Bali offers unique Balinese souvenirs, ranging from solar active t-shirts, beachwear, paintings, culinary delights, handicrafts, and much more!",
    imgUrl: "/merchant-image/the-keranjang-bali.png",
  },
  {
    name: "Wake Bali Art Market",
    description:
      "Wake Bali Art Market is a charming destination for finding unique souvenirs to enhance any space. The market showcases a diverse array of artistic creations, including paintings, sculptures, handmade crafts, and exquisite jewelry, offering a blend of creativity and craftsmanship.",
    imgUrl: "/merchant-image/wake-bali.png",
  },
  {
    name: "Balira Art Shop",
    description:
      "Balira Art Shop is a store that offers a variety of handcrafted items and authentic Bali souvenirs of the highest quality. Unique products such as macrame, dream catchers, necklaces, and other accessories and decorations are handmade by local Bali artisans. Each product reflects the uniqueness and beauty of Bali's rich culture. This shop is the perfect destination for finding meaningful gifts or mementos, with guaranteed quality and a distinctive touch of Balinese art.",
    imgUrl: "/merchant-image/balira-art-shop.png",
  },
  {
    name: "Pipins Art Shop Peliatan",
    description:
      "Pipins Art Shop Peliatan offers a wide variety of high-quality bamboo and rattan crafts. The shop features beautifully crafted items such as chairs, bags, trays, jewelry boxes, lanterns, chicken coops, plates, coasters, and traditional baskets (keben), among many other unique handmade products. Each piece reflects exceptional craftsmanship and attention to detail, making it a perfect destination for those looking for authentic and durable artisanal goods.",
    imgUrl: "/merchant-image/pipins-art-shop-peliatan.png",
  },
  {
    name: "Larisa Oleh-Oleh Bali",
    description:
      "Larisa Oleh-oleh Bali offers a wide range of authentic Balinese souvenirs at affordable prices, ensuring high quality. The shop features a variety of items such as barong t-shirts, beach hats, beach sarongs, keychains, crocheted bags, rattan bags, sandals, and much more. Whether looking for clothing, accessories, or unique gifts, Larisa provides a perfect selection of Balinese treasures that combine tradition, craftsmanship, and value.",
    imgUrl: "/merchant-image/larisa.png",
  },
  {
    name: "Agung Bali Oleh-Oleh",
    description:
      "Agung Bali Oleh-Oleh offers a wide variety of authentic Balinese souvenirs with guaranteed quality, providing a comfortable and enjoyable shopping experience. The store features an extensive selection of traditional crafts, clothing, accessories, and unique gifts, making it a perfect destination for those looking to take home a piece of Bali's culture. With excellent customer service and a welcoming atmosphere, Agung Bali Oleh-Oleh ensures that every visit is memorable and satisfying.",
    imgUrl: "/merchant-image/agung-bali-oleh-oleh.png",
  },
  {
    name: "Kampung Souvenir",
    description:
      "Kampung Souvenir is a simple boutique that offers a variety of clothing for women, men, and children. The clothing is made from bright and colorful materials and is often adorned with accessories. They specialize in Balinese souvenirs, including traditional clothing and fabrics. This makes it a great place to find unique and authentic souvenirs from your trip to Bali.",
    imgUrl: "/merchant-image/kampung-souvenir.png",
  },
  {
    name: "Craft Dewata",
    description:
      "Craft Dewata offers a vibrant collection of Balinese souvenirs, including handcrafted bracelets and fans. Our products are perfect for adding a touch of tropical elegance to your everyday style or as unique gifts for loved ones.",
    imgUrl: "/merchant-image/craft-dewata.png",
  },
  {
    name: "Sylvi & Co",
    description:
      "Sylvi & Co. offers a unique collection of handcrafted Balinese souvenirs, including stylish rattan bags and calming aromatherapy candles. Our products are perfect for adding a touch of tropical elegance to your home or as thoughtful gifts.",
    imgUrl: "/merchant-image/sylvi-co.png",
  },
  {
    name: "Ubud Treasure Craft",
    description:
      "Ubud Treasure Craft is a charming store located in Ubud Traditional Art Market, offering a wide variety of authentic Bali souvenirs. From colorful dream catchers and traditional Balinese masks to handmade clothes and accessories, each item reflects the island’s rich culture and craftsmanship. Perfect for those looking for unique keepsakes to remember their Bali experience.",
    imgUrl: "/merchant-image/ubud-treasure-craft.png",
  },
  {
    name: "Bali Artistry Corner",
    description:
      "Step into Bali Artistry Corner and immerse yourself in the vibrant world of Balinese artistry. Our store is a treasure trove of unique souvenirs, from intricately crafted dream catchers to captivating masks and colorful clothing. Each piece tells a story of the island's rich cultural heritage.",
    imgUrl: "/merchant-image/bali-artistry-corner.png",
  },
];

const productData: MarqueeData[] = [
  {
    name: "White Dream Catcher",
    description:
      "The White Dream Catcher is a stunning and serene decor piece that symbolizes peace, purity, and positive energy. Handcrafted with care, it features a delicate web at its center, believed to filter dreams, letting only the positive ones pass through while trapping bad dreams. Perfect for bedrooms, nurseries, or any relaxing space, this dream catcher blends traditional craftsmanship with modern minimalist style.",
    imgUrl: "/product-image/1.jpg",
  },
  {
    name: "Omkara Wall Decoration",
    description:
      "The Omkara Wall Decoration is a striking and meaningful piece that brings a sense of spirituality and tranquility to any space. Designed with intricate craftsmanship, this wall art features the sacred Omkara symbol, representing the universal sound of 'Om,' a profound emblem of creation and harmony. Ideal for enhancing the ambiance of homes, yoga studios, or meditation rooms, this decoration is both a visual and spiritual treasure.",
    imgUrl: "/product-image/2.png",
  },
  {
    name: "Silver Earrings with Blue Gemstone",
    description:
      "The Silver Earrings with Blue Gemstone are a timeless pair of accessories that exude elegance and sophistication. Perfectly crafted, these earrings feature dazzling blue gemstones set in high-quality sterling silver, creating a striking contrast and a radiant appearance. These earrings are ideal for any occasion, adding a touch of grace and charm to your ensemble.",
    imgUrl: "/product-image/3.png",
  },
  {
    name: "Janger Handy Fan in Green",
    description:
      "The Janger Handy Fan in Green is a charming and practical accessory designed to keep you cool in style. Inspired by traditional Balinese craftsmanship, this fan combines cultural significance with modern convenience. Its vibrant green color adds a fresh, lively touch to your summer essentials, making it an ideal companion for outdoor events, tropical vacations, or hot days.",
    imgUrl: "/product-image/4.png",
  },
  {
    name: "Beach Hat in Red",
    description:
      "The Beach Hat in Red is a stylish and bold accessory that adds a pop of color and sophistication to your beachwear. Designed for both fashion and function, this hat is perfect for protecting your face from the sun while giving you an effortlessly chic look. Whether you're lounging by the beach, attending a poolside party, or simply strolling through sunny streets, this red beach hat is sure to turn heads.",
    imgUrl: "/product-image/5.png",
  },
  {
    name: "Banyan Tree Wooden Wall Decoration",
    description:
      "The Banyan Tree Wooden Wall Decoration is a stunning piece of art that captures the grandeur and serenity of the banyan tree, symbolizing strength, protection, and eternal growth. Expertly crafted from wood, this wall decoration brings the beauty of nature and spirituality into your home. Its intricate design and natural wood texture create a warm, earthy vibe, making it a perfect addition to any space.",
    imgUrl: "/product-image/6.png",
  },
  {
    name: "Turtle Coconut Shell Candle Holder",
    description:
      "The Turtle Coconut Shell Candle Holder is a unique and charming piece of decor that brings a touch of nature and the ocean into your home. Handcrafted from coconut shell, this candle holder is designed in the shape of a turtle, symbolizing longevity, wisdom, and protection. Its rustic, eco-friendly design makes it an ideal addition to any space, evoking a tranquil, tropical ambiance.",
    imgUrl: "/product-image/7.png",
  },
  {
    name: "Colorful Crochet Bag",
    description:
      "The Colorful Crochet Bag is a cheerful and vibrant accessory that brings a pop of color to any outfit. Handcrafted with intricate crochet techniques, this bag features an array of bright, lively colors that make it both eye-catching and unique. Perfect for those who love boho or eclectic style, this bag combines functionality with a fun, artistic flair, making it a must-have for casual outings, vacations, or as an everyday accessory.",
    imgUrl: "/product-image/8.png",
  },
  {
    name: "Barong T-Shirt in Yellow",
    description:
      "The Barong T-Shirt in Yellow is a bold and vibrant piece of clothing that combines the traditional Balinese Barong motif with modern style. This t-shirt features the iconic Barong, a symbol of protection and good spirit in Balinese culture, beautifully printed in a bright yellow hue. Perfect for those who want to bring a touch of Indonesian culture and lively color into their wardrobe, this t-shirt is a unique and stylish way to express your love for Bali and its rich traditions.",
    imgUrl: "/product-image/9.png",
  },
  {
    name: "Round Rattan Sling Bag in Black",
    description:
      "The Round Rattan Sling Bag in Black is a stylish and versatile accessory, blending modern elegance with natural materials for a chic, bohemian look. The sleek black color adds a sophisticated touch to the traditional rattan craftsmanship, making it an ideal piece for any occasion, whether it’s a casual day out or an evening event. This bag brings a timeless appeal with a perfect balance of style and function.",
    imgUrl: "/product-image/10.png",
  },
  {
    name: "Keben with Printed Sunflower Pattern",
    description:
      "The Keben with Printed Sunflower Pattern is a beautiful and vibrant twist on the traditional Balinese ceremonial box. Crafted from sustainable bamboo, this Keben features a lively sunflower design, infusing the traditional offering container with a burst of color and nature-inspired charm. It is a perfect blend of cultural significance and artistic expression, making it ideal for both ceremonial use and decorative purposes.",
    imgUrl: "/product-image/11.png",
  },
  {
    name: "Rose Wooden Wall Decoration",
    description:
      "The Rose Wooden Wall Decoration is a stunning and elegant piece that brings the timeless beauty of the rose to your space. Symbolizing love, passion, and beauty, the rose is one of the most cherished flowers across cultures. This handcrafted wooden decoration captures the delicate form of the rose in fine detail, making it a perfect addition to any room that aims to convey warmth, beauty, and a touch of nature.",
    imgUrl: "/product-image/12.png",
  },
  {
    name: "Baby Pink Beach Hat",
    description:
      "The Baby Pink Beach Hat is a sweet and stylish accessory perfect for protecting yourself from the sun while adding a touch of elegance to your beach or vacation look. The soft, pastel pink color gives it a delicate, feminine touch, making it ideal for sunny days by the sea, poolside lounging, or casual outings.",
    imgUrl: "/product-image/13.png",
  },
  {
    name: "Water Hyacinth Woven Bag",
    description:
      "The Water Hyacinth Woven Bag is a sustainable, eco-friendly accessory that blends nature-inspired craftsmanship with chic, everyday functionality. Handwoven from water hyacinth, a renewable material known for its strength and durability, this bag offers a unique, textured look that adds boho charm to any outfit.",
    imgUrl: "/product-image/14.png",
  },
  {
    name: "Black Dream Catcher",
    description:
      "The Black Dream Catcher is a striking and elegant piece of decor that combines traditional symbolism with a bold, modern aesthetic. The deep black color represents mystery, protection, and the power to ward off negative energies.",
    imgUrl: "/product-image/15.png",
  },
  {
    name: "Flamingo Wooden Earrings",
    description:
      "The Flamingo Wooden Earrings are a playful and stylish accessory that combines natural materials with a bold, tropical design. Featuring intricately carved flamingos, these lightweight earrings bring a touch of nature-inspired charm to your look.",
    imgUrl: "/product-image/16.png",
  },
  {
    name: "Turtle Keychain",
    description:
      "The Turtle Keychain is a charming and symbolic accessory that celebrates the beauty and wisdom of turtles. Made with intricate detailing, this keychain is a perfect keepsake for ocean lovers or those who admire the turtle's representation of longevity and perseverance.",
    imgUrl: "/product-image/17.png",
  },
  {
    name: "Swan Coconut Shell Candle Holder",
    description:
      "The Swan Coconut Shell Candle Holder is a beautifully handcrafted decor piece that combines natural materials with artistic design. Shaped like a graceful swan, this candle holder is made from a polished coconut shell, showcasing its natural texture and warmth.",
    imgUrl: "/product-image/18.png",
  },
  {
    name: "Purple Udeng",
    description:
      "The Purple Udeng makes a perfect souvenir for anyone interested in Balinese culture and traditions. This vibrant headpiece, with its rich purple color, serves as a unique reminder of the island's spiritual heritage and cultural ceremonies.",
    imgUrl: "/product-image/19.png",
  },
  {
    name: "Classic Wooden Fandy Fan",
    description:
      "The Classic Wooden Fandy Fan is an elegant and traditional accessory that combines craftsmanship and functionality. Made from high-quality wood, this fan features a beautifully intricate design, offering both practicality and style.",
    imgUrl: "/product-image/20.png",
  },
];

const features = [
  {
    Icon: MapPinHouseIcon,
    name: "Markets",
    description: "Find the art markets around you.",
    href: "/markets",
    cta: "Lets Explore",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] absolute [--duration:20s]"
      >
        {marketData.map((market, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none "
            )}
          >
            <div className="flex flex-col">
              <img
                src={market.imgUrl}
                alt={market.name}
                className="w-full h-24 object-cover"
              />
              <TypographyMuted className="py-2 line-clamp-6">
                {market.description}
              </TypographyMuted>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: HousePlugIcon,
    name: "Merchants",
    description: "Find the merchants to buy souvenirs.",
    href: "/merchants",
    cta: "Lets Explore",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Marquee
        pauseOnHover
        className="top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] absolute [--duration:20s]"
      >
        {merchantData.map((merchant, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none "
            )}
          >
            <div className="flex flex-col">
              <img
                src={merchant.imgUrl}
                alt={merchant.name}
                className="w-full h-24 object-cover"
              />
              <TypographyMuted className="py-2 line-clamp-6">
                {merchant.description}
              </TypographyMuted>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: ShoppingBasketIcon,
    name: "Products",
    description: "Supports 100+ balinese souvenirs products",
    href: "/products",
    cta: "Lets explore",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Marquee
        reverse
        pauseOnHover
        className="top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] absolute [--duration:40s]"
      >
        {productData.map((product, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none "
            )}
          >
            <div className="flex flex-col">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-24 object-cover"
              />
              <TypographyMuted className="py-2 line-clamp-6">
                {product.description}
              </TypographyMuted>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: SearchIcon,
    name: "Predict",
    description: "Predict the name of souvenirs",
    className: "col-span-3 lg:col-span-1",
    href: "/predicts",
    cta: "Lets try to predict",
    background: (
      <Marquee
        reverse
        pauseOnHover
        className="top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] absolute [--duration:40s]"
      >
        {productData.map((product, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-48 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none "
            )}
          >
            <div className="flex flex-col">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-24 object-cover"
              />
              <TypographyMuted className="py-2 line-clamp-6">
                {product.description}
              </TypographyMuted>
            </div>
          </figure>
        ))}
      </Marquee>
    ),
  },
];

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
