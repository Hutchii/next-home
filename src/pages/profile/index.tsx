import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/future/image";
import { useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";

export const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <main className="h-screen bg-blue-800 text-blue-100">
      <div className="spacer flex items-start gap-40 pt-20">
        <nav>
          <ul className="space-y-5 text-sm">
            <li>
              <Link href="/profile" className="">
                Settings
              </Link>
            </li>
            <li>
              <Link href="/profile/listings" className="">
                Listings
              </Link>
            </li>
            <li>
              <Link href="/profile/favourites" className="">
                Favourites
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </div>
    </main>
  );
};

const initialData = {
  name: "",
  phone: "",
  contactEmail: "",
};

const Profile = () => {
  const { data: session } = useSession();
  const { handleSubmit, register } = useForm<typeof initialData>();

  const { data, isLoading } = trpc.useQuery(["user.getUser"], {
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    // notifyOnChangeProps: "tracked",
    refetchOnMount: false,
  });

  const { setQueryData } = trpc.useContext();

  const mutation = trpc.useMutation("user.editProfile", {
    onSuccess: (_, variables) => {
      if (data?.email) {
        const userData = { ...variables, email: data.email };
        setQueryData(["user.getUser"], () => userData);
      }
    },
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));
  console.log(data);
  return (
    <Layout>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex items-center gap-5">
          {session?.user?.image && (
            <div>
              <Image
                src={session.user.image}
                width={64}
                height={64}
                alt="Avatar"
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <h1>{session?.user?.name}</h1>
            <p>Account {session?.user?.role}</p>
          </div>
          <form className="space-y-5 text-blue-800" onSubmit={onSubmit}>
            <input
              type="email"
              defaultValue={data?.email ?? ""}
              placeholder="Please fill in!"
              disabled
            />
            <input
              defaultValue={data?.name ?? ""}
              type="text"
              {...register("name")}
            />
            <input
              defaultValue={data?.phone ?? ""}
              type="phone"
              placeholder="Please fill in!"
              {...register("phone")}
            />
            <input
              defaultValue={data?.contactEmail ?? ""}
              type="contactEmail"
              placeholder="Please fill in!"
              {...register("contactEmail")}
            />
            <button className="btn-primary">Send</button>
          </form>
          <h1>{data?.name}</h1>
        </div>
      )}
    </Layout>
  );
};

export default Profile;
