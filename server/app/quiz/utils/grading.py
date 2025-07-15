from difflib import SequenceMatcher
from server.app.quiz.utils.openai_grading import grade_answers_openai

def sequence_matcher_similarity(a, b):
    return SequenceMatcher(None, str(a), str(b)).ratio() * 100

def grade_mock_question(answer):
    question_type = answer.get("question_type", "").strip()
    user_answer = str(answer.get("user_answer", "")).strip()
    correct_answer = str(answer.get("correct_answer", "")).strip()
    question_text = answer.get("question", "")

    if not correct_answer:
        return {
            "question": question_text,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "question_type": question_type,
            "is_correct": False,
            "result": "No answer to grade"
        }

    if question_type == "open-ended":
        accuracy = sequence_matcher_similarity(user_answer, correct_answer)
        is_correct = accuracy >= 50
        return {
            "question": question_text,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "question_type": question_type,
            "accuracy_percentage": accuracy,
            "is_correct": is_correct,
            "result": "Correct" if is_correct else "Incorrect",
            "fallback_used": True
        }

    elif question_type == "short-answer":
        accuracy = sequence_matcher_similarity(user_answer, correct_answer)
        is_correct = accuracy >= 75
        return {
            "question": question_text,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "question_type": question_type,
            "accuracy_percentage": accuracy,
            "is_correct": is_correct,
            "result": "Correct" if is_correct else "Incorrect",
            "fallback_used": True
        }

    elif question_type in ["multichoice", "true-false"]:
        is_correct = user_answer == correct_answer
        return {
            "question": question_text,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "question_type": question_type,
            "is_correct": is_correct,
            "result": "Correct" if is_correct else "Incorrect",
            "fallback_used": True
        }

    return {
        "question": question_text,
        "user_answer": user_answer,
        "correct_answer": correct_answer,
        "question_type": question_type,
        "is_correct": False,
        "result": "Incorrect",
        "fallback_used": True
    }

# ✅ Master grading function with AI fallback
async def grade_answers(user_answers):
    mock_answers = []
    ai_answers = []

    for answer in user_answers:
        source = answer.get("source", "ai").strip().lower()  # Default to AI
        if source == "ai":
            ai_answers.append(answer)
        else:
            mock_answers.append(answer)

    results = []

    # Grade locally first
    for answer in mock_answers:
        results.append(grade_mock_question(answer))

    # Try AI grading; fallback to mock if it fails
    if ai_answers:
        try:
            ai_results = await grade_answers_openai(ai_answers)
            results.extend(ai_results)
        except Exception as e:
            print(f"[Fallback] AI grading failed: {str(e)}. Using mock grader.")
            for answer in ai_answers:
                results.append(grade_mock_question(answer))

    return results
