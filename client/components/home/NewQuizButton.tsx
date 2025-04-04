import { useRouter } from "next/navigation";

export default function NewQuizButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
    >
      New Quiz
    </button>
  );
}
