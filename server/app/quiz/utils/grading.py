from difflib import SequenceMatcher

def sequence_matcher_similarity(a, b):
    return SequenceMatcher(None, str(a), str(b)).ratio() * 100  # Ensure string conversion

def is_answer_similar(user_answer, correct_answer):
    return sequence_matcher_similarity(user_answer, correct_answer)

def grade_answers(user_answers):
    result = []
    for answer in user_answers:
        question_type = answer.get("question_type", "").strip()  # Default to empty string

        user_answer = str(answer.get("user_answer", "")).strip()
        correct_answer = str(answer.get("correct_answer", "")).strip()
        
        if not user_answer or not correct_answer:
            continue  # Skip invalid entries
        
        if question_type == "open-ended":
            accuracy_percentage = is_answer_similar(user_answer, correct_answer)
            is_correct = accuracy_percentage >= 50
            result.append({
                "question": answer["question"],
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "accuracy_percentage": accuracy_percentage,
                "is_correct": is_correct,
                "result": "Correct" if is_correct else "Incorrect"
            })

        elif question_type in ["multichoice", "true-false"]:
            is_correct = user_answer == correct_answer
            result.append({
                "question": answer["question"],
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "question_type": question_type,
                "result": "Correct" if is_correct else "Incorrect"
            })

    return result
