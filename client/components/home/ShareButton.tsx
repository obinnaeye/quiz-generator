import React, { useState } from "react";
import axios from "axios";
import ShareModal from "./ShareModal";

const ShareButton = () => {
  const [quizId, setQuizId] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const generateQuizAndShare = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/share/get-quiz-id",
      );

      const id = response.data.id;
      const quizData = response.data;
      setQuizId(id);
      console.log(id);

      if (!id) {
        throw new Error(
          "Quiz ID is undefined. Cannot proceed to fetch sharable link.",
        );
      }

      const linkResponse = await axios.get(
        `http://localhost:8000/share/share-quiz/${id}`,
      );
      const newShareableLink = linkResponse.data.link;
      setShareableLink(newShareableLink);

      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating quiz or fetching sharable link:", error);
      alert(
        "An error occurred while generating the quiz or sharable link. Please try again.",
      );
    }
  };

  return (
    <div>
      <button
        onClick={generateQuizAndShare}
        className="bg-[#0a3264] hover:bg-[#082952] text-white font-semibold px-4 py-2 rounded-xl shadow-md transition text-sm"
      >
        Share Quiz
      </button>

      {isModalOpen && shareableLink && (
        <ShareModal
          quizId={quizId!}
          shareableLink={shareableLink}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ShareButton;
