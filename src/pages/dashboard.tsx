import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

const Dashboard = () => {
  const { register, handleSubmit } = useForm();
  const { mutateAsync: createPresignedUrl } = trpc.useMutation(
    "user.createPresignedUrl"
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl(data as any)) as any;
    const fileData = {
      ...fields,
      "Content-Type": data.image[0].type,
      file: data.image[0],
    };
    const formData = new FormData();
    for (const name in fileData) {
      formData.append(name, fileData[name]);
    }
    await fetch(url, {
      method: "POST",
      body: formData,
    }).catch((error) => {
      console.error("Error:", error);
    });
  });

  return (
    <main className="spacer mt-20 bg-blue-800 text-white">
      <h1>YOUR PROFILE</h1>
      <form onSubmit={onSubmit} className="flex flex-col space-y-5 pb-10">
        <input type="file" {...register("image")} />
        <input type="text" {...register("name")} placeholder="Name" />
        <input type="text" {...register("for")} placeholder="For" />
        <input type="text" {...register("type")} placeholder="Type" />
        <input type="text" {...register("city")} placeholder="City" />
        <input type="text" {...register("address")} placeholder="Address" />
        <input type="number" {...register("price")} placeholder="Price" />
        <input type="text" {...register("area")} placeholder="Area" />
        <input type="text" {...register("rooms")} placeholder="Rooms" />
        <textarea {...register("body")} placeholder="Body" />
        <button className="btn-tertiary">SEND</button>
      </form>
    </main>
  );
};

export default Dashboard;
