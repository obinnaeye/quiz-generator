from difflib import SequenceMatcher

def sequence_matcher_similarity(a, b):
    # Use SequenceMatcher to calculate similarity ratio (0 to 1) and then convert to percentage
    return SequenceMatcher(None, a, b).ratio() * 100

def is_answer_similar(user_answer, correct_answer):
    accuracy = sequence_matcher_similarity(user_answer, correct_answer)
    return accuracy

def grade_answers(user_answers):
    result = []
    for answer in user_answers:
        # Assume answer has a structure {question, user_answer, correct_answer}
        accuracy_percentage = is_answer_similar(answer["user_answer"], answer["correct_answer"])
        is_correct = accuracy_percentage >= 50  # Pass mark set to 50%
        result.append({
            "question": answer["question"], 
            "user_answer": answer["user_answer"],
            "correct_answer": answer["correct_answer"],
            "accuracy_percentage": accuracy_percentage,
            "is_correct": is_correct
        })
    return result
