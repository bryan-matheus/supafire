import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '../../services/SupabaseClient'
import { UserIcon, CameraIcon, DotsHorizontalIcon } from '@heroicons/react/solid'

type Props = {
    url: string;
    size?: number;
    onUpload: (url: (string)) => void;
}

export default function Avatar({ url, size, onUpload }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className={"flex flex-col justify-center items-center mb-4"}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={"Avatar"}
          className={"rounded-full border border-purple-600"}
          width={size}
          height={size}
        />
      ) : (
        <section
          className={"flex justify-center items-center rounded-full bg-gray-300"}
          style={{ height: size, width: size }}
        >
            <UserIcon className={"text-gray-400 w-32 h-32"} />
        </section>
      )}
      <section style={{ width: size, height: size }} className={"absolute"}>
        <label htmlFor={"single"}>
          {uploading ? <DotsHorizontalIcon className={"absolute right-3 bottom-3 w-10 h-10 text-purple-600"} /> : <CameraIcon className={"absolute right-3 bottom-3 w-10 h-10 text-purple-600"}/>}
        </label>
        <input
          style={{
            visibility: "hidden",
            cursor: "pointer",
          }}
          type={"file"}
          id={"single"}
          accept={"image/*"}
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </section>
    </section>
  );
}
