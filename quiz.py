import json

import streamlit as st
from dotenv import find_dotenv, load_dotenv
from IPython.display import Markdown
from langchain.chains.llm import LLMChain
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

load_dotenv(find_dotenv(), override=True)
context_options = ["multiple-choice", "true-false", "open-ended"]


def update_score():
    if "score" in st.session_state:
        del st.session_state["score"]


# def show_next_question(session, question_container):
#     question_container.empty()
#     new_question_container = st.empty()
#     count = session.count
#     score = session.score
#     num_questions = session.num_questions
#     res = session.quiz_response[session.count + 1]
#     context = session.quiz_context
#     with question_container.container():
#         st.write(count)
#         if (context == context_options[2]):
#             current_question = f"***Question {session.count + 1}***. {res['question']}"
#             st.write(current_question)
#         else:
#             options = map(lambda x: x, res['options'])
#             current_question = f"***Question {session.count + 1}***. {res['question']}"
#             choice = st.radio(
#                 current_question,
#                 options,
#             )
#     return new_question_container


def main():
    st.title("Quiz App")
    st.write("This app generates a quiz based on a given context.")

    if not "page_loaded" in st.session_state:
        st.session_state.page_loaded = False

    if not "generated_quiz" in st.session_state:
        st.session_state.generated_quiz = False
        st.session_state.score = 0
        st.session_state.count = 0
        st.session_state.quiz_context = ""
        st.session_state.num_questions = 0
        st.session_state.quiz_type = ""

    question_container = st.empty()
    answer_container = st.container()
    if st.session_state.generated_quiz:
        count = st.session_state.count
        score = st.session_state.score
        num_questions = st.session_state.num_questions
        res = st.session_state.quiz_response[st.session_state.count]
        context = st.session_state.quiz_context
        with question_container.container():
            with st.form(key="question_form"):
                if context == context_options[2]:
                    current_question = f"***Question {st.session_state.count + 1}***. {res['question']}"
                    st.write(current_question)
                else:
                    options = map(lambda x: x, res["options"])
                    current_question = f"***Question {st.session_state.count + 1}***. {res['question']}"
                    choice = st.radio(
                        current_question,
                        options,
                    )
                if num_questions > st.session_state.count + 1:
                    answer = st.form_submit_button("Next")

                    if answer:
                        st.session_state.count = st.session_state.count + 1
                        # res = st.session_state.quiz_response[st.session_state.count]
                        # with next_question_container.container():
                        #     res = st.session_state.quiz_response[st.session_state.count]
                        #     st.session_state.count = st.session_state.count + 1
                        #     options = map(lambda x: x, res['options'])
                        #     current_question = f"***Question {st.session_state.count + 1}***. {res['question']}"
                        #     choice = st.radio(
                        #         current_question,
                        #         options,
                        #     )
                else:
                    answer = st.form_submit_button("Finish")
                    if answer:
                        question_container.empty()
                        for index, item in enumerate(st.session_state.quiz_response):
                            answer_container.write(f"***Question {index + 1}***")
                            answer_container.write(f"***{item['question']}***")
                            for option in item["options"]:
                                answer_container.write(option)
                            answer_container.write("***Answer***:")
                            answer_container.write(item["answer"])
    else:
        main_container = st.empty()

        if not st.session_state.page_loaded:
            with main_container.container():
                with st.form(key="generate_form"):
                    context = st.text_area("Enter the concept/context for this quiz")
                    num_questions = st.number_input(
                        "Enter the number of quizes", min_value=2, max_value=10
                    )
                    quiz_type = st.selectbox("Select quiz type", context_options)
                    generate_quiz = st.form_submit_button("Generate Quiz")
                    # st.session_state.quiz_context = context
                    # st.session_state.num_questions = num_questions
                    # st.session_state.quiz_type = quiz_type
                    # st.session_state.page_loaded = True

                    if generate_quiz:
                        st.session_state.quiz_context = context
                        st.session_state.num_questions = num_questions
                        st.session_state.quiz_type = quiz_type
                        st.session_state.page_loaded = True
                #     st.session_state.page_loaded = True
                #     quiz_response = chain.invoke(input={ "num_questions": num_questions, "quiz_type": quiz_type, "quiz_context": context})
                #     if 'text' in quiz_response:
                #         res = json.loads(quiz_response['text'])
                #         st.session_state.quiz_response = res
                #     else:
                #         st.session_state.quiz_response = {}
                #     if "question" in st.session_state.quiz_response[st.session_state.count]:
                #         st.session_state.generated_quiz = True
                #         main_container.empty()

                #     with question_container.container():
                #         # st.write("Quiz Generated:")
                #         # st.write(quiz_response)
                #         res = st.session_state.quiz_response[st.session_state.count]
                #         if (context == context_options[2]):
                #             st.write(res["question"])
                #         else:
                #             options = map(lambda x: x, res['options'])
                #             choice = st.radio(
                #                 res['question'],
                #                 options,
                #             )
                #         if num_questions > st.session_state.count + 1 and choice:
                #             next_question = st.button("Next")

                #             if next_question:
                #                 st.session_state.count = st.session_state.count + 1
                #                 # question_container.empty()
                #         else:
                #             if st.button("Finish"):
                #                 # question_container.empty()
                #                 question_container.write(st.session_state.quiz_response)
        else:
            prompt_template = create_quiz_prompt_template()
            llm = ChatOpenAI()
            chain = create_quiz_chain(prompt_template, llm)
            context = st.session_state.quiz_context
            num_questions = st.session_state.num_questions
            quiz_type = st.session_state.quiz_type
            quiz_response = chain.invoke(
                input={
                    "num_questions": num_questions,
                    "quiz_type": quiz_type,
                    "quiz_context": context,
                }
            )
            if "text" in quiz_response:
                res = json.loads(quiz_response["text"])
                st.session_state.quiz_response = res
            else:
                st.session_state.quiz_response = {}
            if "question" in st.session_state.quiz_response[st.session_state.count]:
                st.session_state.generated_quiz = True
                main_container.empty()
            with question_container.container():
                # st.write("Quiz Generated:")
                # st.write(quiz_response)
                res = st.session_state.quiz_response[st.session_state.count]
                with st.form(key="options_form"):
                    if context == context_options[2]:
                        current_question = f"***Question {st.session_state.count + 1}***. {res['question']}"
                        st.write(current_question)
                    else:
                        options = map(lambda x: x, res["options"])
                        current_question = f"***Question {st.session_state.count + 1}***. {res['question']}"
                        choice = st.radio(
                            current_question,
                            options,
                        )

                    if num_questions > st.session_state.count + 1 and choice:
                        answer = st.form_submit_button("Next")

                        if answer:
                            st.session_state.count = st.session_state.count + 1
                            # question_container.empty()
                    else:
                        answer = st.form_submit_button("Next")
                        if answer:
                            # question_container.empty()
                            question_container.write(st.session_state.quiz_response)


def create_quiz_prompt_template():
    template = """
    You are an expert quiz for technical fields.
    Create a quiz with {num_questions} {quiz_type} questions about the following concept/context: {quiz_context}
    The format of the result should be an array containing a dictionery of question, options and answer.
    The options should be an array such as:
    options: [<a. Answer 1>, <b. Answer 2>, <c. Answer 3>, <d. Answer 4>]
    """
    prompt = PromptTemplate.from_template(template)
    prompt.format(
        num_questions=3,
        quiz_type="multiple-choice",
        quiz_context="Data structures in Python programing",
    )
    return prompt


def create_quiz_chain(prompt_template, llm):
    return LLMChain(llm=llm, prompt=prompt_template)


if __name__ == "__main__":
    main()
