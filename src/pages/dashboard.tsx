import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "../utils/trpc";

const Dashboard = () => {
  const [file, setFile] = useState<any>(null);
  const { register, handleSubmit } = useForm();
  // const onSubmit = (data) => console.log(data);

  // const onSubmit = handleSubmit((data, e) => {
  //   console.log(data.file[0]);
  // });

  const { mutateAsync: createPresignedUrl } = trpc.useMutation(
    "user.createPresignedUrl"
  );

  const onSubmit = handleSubmit(async (data) => {
    // if (!file) console.log('Render');;
    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl(data)) as any;

    const fileData = {
      ...fields,
      "Content-Type": data.image[0].type,
      file: data.image[0],
    };
    console.log(fileData);
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
  // const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
  //   setFile(e.currentTarget.files?.[0]);
  // };

  // const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!file) return;
  //   const { url, fields }: { url: string; fields: any } =
  //     (await createPresignedUrl()) as any;

  //   const data = {
  //     ...fields,
  //     "Content-Type": file.type,
  //     file,
  //   };
  //   const formData = new FormData();
  //   for (const name in data) {
  //     formData.append(name, data[name]);
  //   }

  //   await fetch(url, {
  //     method: "POST",
  //     body: formData,
  //   }).catch((error) => {
  //     console.error("Error:", error);
  //   });
  // };

  return (
    <main className="spacer mt-20 bg-blue-800 text-white">
      <h1>YOUR PROFILE</h1>
      {/* <form onSubmit={onSubmit}>
        <input {...register("file")} type="file" />
        <button>SEND</button>
      </form> */}
      <form onSubmit={onSubmit} className="flex flex-col space-y-5 pb-10">
        <input type="file" {...register("image")} />
        <input type="text" {...register("name")} placeholder="Name" />
        <input type="text" {...register("for")} placeholder="For" />
        <input type="text" {...register("type")} placeholder="Type" />
        <input type="text" {...register("city")} placeholder="City" />
        <input type="text" {...register("address")} placeholder="Address" />
        <input type="text" {...register("price")} placeholder="Price" />
        <input type="text" {...register("area")} placeholder="Area" />
        <input type="text" {...register("rooms")} placeholder="Rooms" />
        <textarea {...register("body")} placeholder="Body" />
        <button className="btn-tertiary">SEND</button>
      </form>
    </main>
  );
};

export default Dashboard;
