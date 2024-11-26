import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

const footerData = [
  {
    title: "Home",
    links: [
      {
        name: "Home",
        url: "/",
      },
      {
        name: "Markets",
        url: "/markets",
      },
      {
        name: "Merchants",
        url: "/merchants",
      },
      {
        name: "Products",
        url: "/products",
      },
      {
        name: "Predict",
        url: "/predict",
      },
      {
        name: "Dashboard",
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Account",
    links: [
      {
        name: "Login",
        url: "/auth/login",
      },
      {
        name: "Register",
        url: "/auth/register",
      },
    ],
  },
];

export default function Footer() {
  return (
    <>
      <footer className="md:px-8 lg:px-32 py-12">
        <div className="flex md:flex-row flex-col justify-between px-8 lg:px-0">
          <div>
            <h2 className="mb-4 font-bold text-xl">Surevenir</h2>
            <p className="text-gray-400 text-sm">
              Scan and Buy Souvenir Easily
            </p>
            <div className="flex items-center gap-4 mt-4 pb-4">
              <Link href="https://github.com/surevenir">
                <GitHubLogoIcon width={30} height={30} />
              </Link>
            </div>
          </div>

          <div className="flex gap-24">
            {footerData.map((item, index) => (
              <div key={index}>
                <h3 className="mb-4 font-semibold text-lg">{item.title}</h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {item.links.map((link, index) => (
                    <li key={index} className="hover:underline">
                      <Link href={link.url}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-gray-800 mt-12 pt-6 border-t text-center text-gray-400 text-sm">
          Copyright © 2024 by{" "}
          <Link
            href={"https://github.com/surevenir"}
            className="hover:underline"
          >
            Surevenir
          </Link>{" "}
          Team
        </div>
      </footer>
    </>
  );
}
