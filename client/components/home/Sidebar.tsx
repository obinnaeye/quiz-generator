import GenerateQuizButton from "./sidebar/GenerateQuizButton";
import SavedQuizzesButton from "./sidebar/SavedQuizzesButton";
import BrowseByCategoryButton from "./sidebar/BrowseByCategoryButton";
import PopularQuizzesButton from "./sidebar/PopularQuizzesButton";
import FoldersButton from "./sidebar/FoldersButton";
import UpgradePlanButton from "./sidebar/UpgradePlanButton";
import QuizHistoryButton from "./sidebar/QuizHistoryButton";

export default function Sidebar() {
  return (
    <div className="flex flex-col justify-between h-full p-4 bg-[#f2f2f2]">
      <div className="flex flex-col gap-3">
        <GenerateQuizButton />
        <SavedQuizzesButton />
        <BrowseByCategoryButton />
        <PopularQuizzesButton />
        <FoldersButton />
        <QuizHistoryButton />
      </div>

      <div className="mt-10">
        <UpgradePlanButton />
      </div>
    </div>
  );
}
