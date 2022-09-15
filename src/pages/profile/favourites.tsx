import { Layout } from ".";
import { trpc } from "../../utils/trpc";

const MyFavourites = () => {
  const { data, isLoading } = trpc.useQuery(["user.getFavourites"]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <Layout>
      <div>
        {data?.map((e) => (
          <div key={e.id}>{e.name} {e.address}</div>
        ))}
      </div>
    </Layout>
  );
};
export default MyFavourites;
