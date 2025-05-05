from difflib import SequenceMatcher

def sequence_matcher_similarity(a, b):
    return SequenceMatcher(None, str(a), str(b)).ratio() * 100

def grade_answers(user_answers):
    result = []
    for answer in user_answers:
        question_type = answer.get("question_type", "").strip()
        user_answer = str(answer.get("user_answer", "")).strip()
        correct_answer = str(answer.get("correct_answer", "")).strip()

        # If the correct answer is missing, skip this entry entirely
        if not correct_answer:
            continue  

        # Open‑ended: compute similarity, mark ≥50% as correct
        if question_type == "open-ended":
            accuracy = sequence_matcher_similarity(user_answer, correct_answer)
            is_correct = accuracy >= 50
            result.append({
                "question": answer.get("question", ""),
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "question_type": question_type,
                "accuracy_percentage": accuracy,
                "is_correct": is_correct,
                "result": "Correct" if is_correct else "Incorrect"
            })

        # Multiple‑choice & True/False: exact match only
        elif question_type in ["multichoice", "true-false"]:
            is_correct = (user_answer == correct_answer)
            result.append({
                "question": answer.get("question", ""),
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "question_type": question_type,
                "is_correct": is_correct,
                "result": "Correct" if is_correct else "Incorrect"
            })

        # Any other question types you may add in future
        else:
            # treat as incorrect by default
            result.append({
                "question": answer.get("question", ""),
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "question_type": question_type,
                "is_correct": False,
                "result": "Incorrect"
            })

    return result
