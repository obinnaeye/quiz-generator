from fastapi import HTTPException
import random
import os
import openai
import json
from dotenv import load_dotenv

from server.app.quiz.mock_data.multi_choice import mock_multiple_choice_questions
from server.app.quiz.mock_data.true_false import mock_true_false_questions
from server.app.quiz.mock_data.open_ended import mock_open_ended_questions
from server.app.quiz.mock_data.short_answer import mock_short_answer_questions

from server.api.v1.crud.update_quiz_history import update_quiz_history

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_questions(
    question_type: str,
    num_questions: int,
    user_id: str = "defaultUserId",
    profession: str = "general knowledge",
    audience_type: str = "students",
    custom_instruction: str = "",
    difficulty_level: str = "easy"
):
    # Map question types to mock data
    question_data = {
        "multichoice": mock_multiple_choice_questions,
        "true-false": mock_true_false_questions,
        "open-ended": mock_open_ended_questions,
        "short-answer": mock_short_answer_questions,
    }

    if question_type not in question_data:
        raise HTTPException(status_code=400, detail=f"Invalid question type: {question_type}")

    # Try OpenAI first
    try:
        # Build prompt based on question type
        if question_type == "multichoice":
            format_instruction = (
                "Return a JSON array of objects with keys: question, type, options (a-d), and correct_answer."
            )
        elif question_type == "true-false":
            format_instruction = (
                "Return a JSON array of objects with keys: question, type (true-false), and correct_answer (True or False)."
            )
        elif question_type == "short-answer":
            format_instruction = (
                "Return a JSON array of objects with keys: question, type (short-answer), and correct_answer. "
                "Answers should be brief and factual, without options."
            )
        elif question_type == "open-ended":
            format_instruction = (
                "Return a JSON array of objects with keys: question, type (open-ended), and correct_answer. "
                "Answers should be more descriptive and explanatory."
            )
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported question type: {question_type}")

        prompt = (
            f"You are a professional quiz creator.\n\n"
            f"Create a {difficulty_level} {question_type.replace('-', ' ')} quiz with {num_questions} questions.\n"
            f"Topic: {profession}\n"
            f"Audience: {audience_type}\n"
            f"Instructions: {custom_instruction or 'None'}\n"
            f"{format_instruction}\n"
            f"Respond in pure JSON with no additional text or commentary."
        )

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=1500
        )

        content = response.choices[0].message.content.strip()

        try:
            quiz_data = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="Failed to parse OpenAI response. Invalid JSON.")

        # Log the quiz to history
        update_quiz_history(user_id, quiz_data)
        return quiz_data

    except Exception as e:
        print("⚠️ OpenAI failed — using mock data instead:", e)

        questions = question_data[question_type]

        if num_questions > len(questions):
            raise HTTPException(
                status_code=400,
                detail=f"Requested {num_questions} questions, but only {len(questions)} available in mock data.",
            )

        fallback_data = random.sample(questions, num_questions)
        update_quiz_history(user_id, fallback_data)
        return fallback_data
