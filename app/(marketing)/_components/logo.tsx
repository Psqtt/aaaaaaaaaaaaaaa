import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.svg"
        height="32"
        width="32"
        alt="Nexus Logo"
        priority
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.svg"
        height="32"
        width="32"
        alt="Nexus Logo"
        priority
        className="hidden dark:block"
      />
      <p className={cn("font-semibold text-lg tracking-tight", font.className)}>
        Nexus
      </p>
    </div>
  );
};

export default Logo;
