import Link from "next/link";
import Hamburger from "hamburger-react";
import { RefObject, useEffect, useRef, useState } from "react";
import Image from "next/future/image";
import Logo from "../../public/svg/logo.svg";
import User from "../../public/svg/user.svg";
import List from "../../public/svg/list.svg";
import Heart from "../../public/svg/heart.svg";
import SignOut from "../../public/svg/signOut.svg";
import Upgrade from "../../public/svg/upgrade.svg";
import Plus from "../../public/svg/plus.svg";
import Email from "../../public/svg/email.svg";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

const useOutsideClick = (ref: RefObject<HTMLButtonElement>, fn: () => void) => {
  const handleClick = (e: Event) => {
    const target = e.target as HTMLElement;
    if (ref.current && !ref.current.contains(target.closest("button"))) fn();
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

const ProfileMenu = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const profileRef = useRef<HTMLButtonElement>(null);
  useOutsideClick(profileRef, () => setIsOpen(false));

  const linkStyle =
    "flex items-center py-[15px] pl-6 lg:flex lg:w-full lg:justify-end lg:pl-10 lg:pr-5 lg:hover:bg-blue-500/10 lg:transition-colors lg:duration-[125ms] lg:ease-in-out";

  return (
    <li className="animate-[fade-in_200ms_ease-in-out_both] lg:relative lg:order-4">
      <button
        className="border-10 flex w-full items-center gap-2.5 border-b py-[15px] pl-6 transition-opacity duration-100 ease-in-out active:opacity-90 lg:relative lg:border-none lg:p-0"
        onClick={() => setIsOpen((p) => !p)}
        ref={profileRef}
      >
        <Image
          src="/img/avatar.jpg"
          alt="Profile Picture"
          width={46}
          height={46}
          className="rounded-full lg:h-10 lg:w-10"
        />
        <Upgrade className="absolute left-[50px] top-[42px] lg:left-[unset] lg:-right-2 lg:top-[18px]" />
        <div className="text-left lg:hidden">
          <p className="text-sm leading-tight">Andrzej Nowak</p>
          <p className="text-base text-grey-400">Normal Account</p>
        </div>
      </button>
      <ul
        className={`transition duration-100 ease-in-out lg:absolute lg:right-0 lg:top-[60px] lg:z-20 lg:whitespace-nowrap lg:rounded-b-xl lg:bg-blue-800 lg:shadow-small ${
          isOpen
            ? "lg:pointer-events-auto lg:translate-y-0 lg:scale-[unset] lg:opacity-100"
            : "lg:pointer-events-none lg:-translate-y-2.5 lg:scale-[0.98] lg:opacity-0"
        }`}
      >
        <li>
          <Link href="/" className={linkStyle}>
            <User className="mr-8 lg:order-2 lg:mr-0 lg:ml-5" />
            My settings
          </Link>
        </li>
        <li>
          <Link href="/" className={linkStyle}>
            <List className="mr-8 lg:order-2 lg:mr-0 lg:ml-5" />
            My listings
          </Link>
        </li>
        <li>
          <Link href="/" className={linkStyle}>
            <Heart className="mr-8 lg:order-2 lg:mr-0 lg:ml-5" />
            My favourites
          </Link>
        </li>
        <li className="border-10 border-b lg:border-b-0 lg:border-t">
          <Link href="/" className={linkStyle} onClick={() => signOut()}>
            <SignOut className="mr-8 lg:order-2 lg:mr-0 lg:ml-5" />
            Sign out
          </Link>
        </li>
      </ul>
    </li>
  );
};

const Links = ({
  session,
  status,
}: {
  session: Session | null;
  status: string;
}) => {
  return (
    <>
      {session && (
        <>
          <li className="animate-[fade-in_200ms_ease-in-out_both] lg:order-2">
            <Link
              href="/"
              className="lg:btn-tertiary flex items-center py-[15px] pl-6 text-red-500"
            >
              <Upgrade className="mr-8 lg:order-2 lg:mr-0 lg:w-5 lg:fill-white" />
              Upgrade Now
            </Link>
          </li>
          <li className="animate-[fade-in_200ms_ease-in-out_both] lg:order-3">
            <Link
              href="/"
              className="lg:btn-primary flex items-center py-[15px] pl-6"
            >
              <Plus className="mr-8 lg:order-2 lg:mr-0 lg:w-5" />
              Add new estate
            </Link>
          </li>
        </>
      )}
      <li className="lg:mr-auto lg:ml-20">
        <Link href="/" className="flex items-center py-[15px] pl-6 lg:pl-0">
          <Email className="mr-8 lg:hidden" />
          Contact
        </Link>
      </li>
      {!session && status !== "loading" && (
        <li className="animate-[fade-in_200ms_ease-in-out_both]">
          <Link
            href="/"
            className="lg:btn-primary flex items-center py-[15px] pl-6"
            onClick={() => signIn()}
          >
            <SignOut className="mr-8 lg:order-2 lg:mr-0 lg:w-5" />
            Sign In
          </Link>
        </li>
      )}
    </>
  );
};

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session, status } = useSession();
  return (
    <header className="border-15 relative z-40 h-20 border-b bg-blue-800">
      <div
        className={`border-15 absolute inset-x-0 inset-y-20 h-screen w-full border-r bg-blue-800 transition-transform duration-200 ease-in-out lg:hidden ${
          isDropdownOpen ? "-translate-x-6" : "-translate-x-full"
        }`}
      />
      <nav className="spacer flex h-full items-center justify-between text-xs text-white">
        <Link
          href="/"
          className="flex items-center gap-1 py-5 text-sm font-medium text-blue-100 lg:py-0"
        >
          <Logo className="w-10" />
          HOME+
        </Link>
        <Hamburger
          toggled={isDropdownOpen}
          toggle={setIsDropdownOpen}
          rounded
          color="#ffffff"
        />
        <ul
          className={`absolute inset-x-0 inset-y-20 w-[calc(100%-24px)] text-[22px] transition-transform duration-200 ease-in-out lg:static lg:flex lg:w-full lg:items-center lg:justify-end lg:gap-5 lg:text-xs ${
            isDropdownOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-[unset]"
          }`}
        >
          {session && (
            <ProfileMenu isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
          )}
          <Links session={session} status={status} />
        </ul>
      </nav>
    </header>
  );
};

export default Header;
