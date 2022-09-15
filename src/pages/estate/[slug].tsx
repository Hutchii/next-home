import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const Estate = () => {
  const {
    query: { slug },
  } = useRouter();
  const { data } = trpc.useQuery(["estates.show-estate", slug], {
    enabled: Boolean(slug),
  });
  return <main className="spacer">{data?.name}</main>;
};

export default Estate;
