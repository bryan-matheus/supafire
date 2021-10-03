import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../services/SupabaseClient";
import { Session } from "@supabase/supabase-js";
import Avatar from './Avatar'

type Props = {
  session: Session;
};

type Profile = {
  username: string | null;
  website: string | null;
  avatar_url: string;
};

export default function Account({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string>("");

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async ({ username, website, avatar_url }: Profile) => {
      try {
        setLoading(true);
        const user = supabase.auth.user();

        const updates = {
          id: user?.id,
          username,
          website,
          avatar_url,
          updated_at: new Date(),
        };

        let { error } = await supabase.from("profiles").upsert(updates, {
          returning: "minimal",
        });

        if (error) {
          throw error;
        }
      } catch (error: any) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    getProfile();
  }, [getProfile, session]);

  const onSaveClick = useCallback(() => {
    updateProfile({ username, website, avatar_url });
  }, [avatar_url, updateProfile, username, website]);

  return (
    <main className={"w-2/4 h-screen flex flex-col align-center justify-center text-white"}>
      <Avatar
        url={avatar_url}
        size={240}
        onUpload={(url: string) => {
          setAvatarUrl(url);
          updateProfile({ username, website, avatar_url: url });
        }}
      />

      <section className={"flex justify-center align-center flex-col"}>
        <label className={"text-gray-300"} htmlFor={"email"}>
          Email
        </label>
        <input
          id={"email"}
          type={"text"}
          value={session?.user?.email}
          className={
            "w-full p-4 mt-2 bg-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          }
          disabled
        />
      </section>
      <section className={"flex justify-center align-center flex-col mt-3"}>
        <label className={"text-gray-300"} htmlFor={"username"}>
          Name
        </label>
        <input
          id={"username"}
          type={"text"}
          value={username || ""}
          className={
            "w-full p-4 mt-2 bg-gray-100 rounded text-black focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          }
          onChange={(e) => setUsername(e.target.value)}
        />
      </section>
      <section className={"flex justify-center align-center flex-col mt-3"}>
        <label className={"text-gray-300"} htmlFor={"website"}>
          Website
        </label>
        <input
          id={"website"}
          type={"website"}
          value={website || ""}
          className={
            "w-full p-4 mt-2 bg-gray-100 rounded text-black disabled:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          }
          onChange={(e) => setWebsite(e.target.value)}
        />
      </section>

      <section className={"flex justify-center align-center flex-col mt-6"}>
        <button
          className={
            "bg-purple-600 text-lg font-semibold rounded-lg mt-4 p-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          }
          onClick={onSaveClick}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>

        <button
          className={
            "bg-transparent text-lg font-semibold border border-purple-600 rounded-lg mt-4 p-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          }
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </section>
    </main>
  );
}
