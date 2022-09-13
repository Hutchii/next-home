import { Layout } from ".";
import { trpc } from "../../utils/trpc";

const MyListings = () => {
  const { data, isLoading } = trpc.useQuery(["user.getEstates"]);
  if (isLoading) return <div>Loading...</div>;
  return (
    <Layout>
      <div>
        {data?.map((e) => (
          <div key={e.id}>{e.name}</div>
        ))}
      </div>
    </Layout>
  );
};
export default MyListings;
