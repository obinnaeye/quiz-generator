from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import json
from langchain.chains.llm import LLMChain
from IPython.display import Markdown
import streamlit as st
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)
context_options = ["multiple-choice", "true-false", "open-ended"]

def update_score():
    if 'score' in st.session_state:
        del st.session_state['score']

def main():
    st.title("Quiz App")
    st.write("This app generates a quiz based on a given context.")

    if not 'generated_quiz' in st.session_state:
        st.session_state.generated_quiz = False
        st.session_state.score = 0
        st.session_state.count = 0
    
    question_container = st.empty()
    answer_container = st.container()
    if st.session_state.generated_quiz:
        count = st.session_state.count
        score = st.session_state.score
        num_questions = st.session_state.num_questions
        res = st.session_state.quiz_response[st.session_state.count]
        context = st.session_state.quiz_context
        with question_container.container():
            if (context == context_options[2]):
                st.write(res["question"])
            else:
                options = map(lambda x: x, res['options'])
                choice = st.radio(
                    res['question'],
                    options,
                    index=None
                )
            if num_questions > st.session_state.count + 1:
                next_question = st.button("Next")
        
                if next_question:
                    st.session_state.count = st.session_state.count + 1
                    question_container.empty()
            else:
                if st.button("Finish"):
                    question_container.empty()
                    for item in st.session_state.quiz_response:
                        answer_container.write(item['question'])
                        for option in item['options']:
                            answer_container.write(option)
                        answer_container.write("***Answer***:")
                        answer_container.write(item['answer'])

    else:
        prompt_template = create_quiz_prompt_template()
        llm = ChatOpenAI()
        chain = create_quiz_chain(prompt_template, llm)
        main_container = st.empty()
        with main_container.container():
            context = st.text_area("Enter the concept/context for this quiz")
            num_questions = st.number_input("Enter the number of quizes", min_value=1, max_value=10)
            quiz_type = st.selectbox("Select quiz type", context_options)
            generate_quiz = st.button("Generate Quiz")
            st.session_state.quiz_context = context
            st.session_state.num_questions = num_questions
            st.session_state.quiz_type = quiz_type
    
        if generate_quiz:
            quiz_response = chain.invoke(input={ "num_questions": num_questions, "quiz_type": quiz_type, "quiz_context": context})
            if 'text' in quiz_response:
                res = json.loads(quiz_response['text'])
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
                if (context == context_options[2]):
                    st.write(res["question"])
                else:
                    options = map(lambda x: x, res['options'])
                    choice = st.radio(
                        res['question'],
                        options,
                        index=None
                    )
                if num_questions > st.session_state.count + 1 and choice:
                    next_question = st.button("Next")
            
                    if next_question:
                        st.session_state.count = st.session_state.count + 1
                        # question_container.empty()
                else:
                    if st.button("Finish"):
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
    prompt.format(num_questions=3, quiz_type="multiple-choice", quiz_context="Data structures in Python programing")
    return prompt

def create_quiz_chain(prompt_template, llm):
    return LLMChain(llm=llm, prompt=prompt_template)

if __name__ == "__main__":
    main()