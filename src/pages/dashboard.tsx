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

  const onFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.currentTarget.files?.[0]);
  };

  const uploadImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const { url, fields }: { url: string; fields: any } =
      (await createPresignedUrl()) as any;

    const data = {
      ...fields,
      "Content-Type": file.type,
      file,
    };
    const formData = new FormData();
    for (const name in data) {
      formData.append(name, data[name]);
    }

    await fetch(url, {
      method: "POST",
      body: formData,
    }).catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <main className="spacer mt-20 bg-blue-800 text-white">
      <h1>YOUR PROFILE</h1>
      {/* <form onSubmit={onSubmit}>
        <input {...register("file")} type="file" />
        <button>SEND</button>
      </form> */}
      <form onSubmit={uploadImage}>
        <input onChange={onFileChange} type="file" />
        <button>SEND v2</button>
      </form>
    </main>
  );
};

export default Dashboard;