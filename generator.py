import openai
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains.llm import LLMChain
from IPython.display import Markdown
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

def get_response(prompt_question):
    response = openai.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=[
            {
                "role": "system",
                "content": "You are a helpful research and programing assistant"
            },
            {
                "role": "user",
                "content": prompt_question
            }
        ]
    )

    return response.choices[0].message.content

prompt = "Create a quiz about the basics of Python programing."
quiz_python = get_response(prompt)
# print(quiz_python)
# print(Markdown(quiz_python).data)

template = """
You are an expert quiz for technical fields.
Create a quiz with {num_questions} {quiz_type} questions about the following concept/context: {quiz_context}
"""
prompt = PromptTemplate.from_template(template)
prompt.format(num_questions=3, quiz_type="multiple-choice", quiz_context="Data structures in Python programing")

chain = LLMChain(llm=ChatOpenAI(), prompt=prompt)
quiz_response = chain.invoke(input={ "num_questions":3, "quiz_type":"multiple-choice", "quiz_context":"Data structures in Python programing"})
# print(quiz_response)
print(Markdown(quiz_response['text']).data)


old_template = """
    You are an expert quiz for technical fields.
    Create a quiz with {num_questions} {quiz_type} questions about the following concept/context: {quiz_context}
    The format of each quiz should be as such:
    - Multiple-choice:
      - Questions:
        <Question1>: <a. Answer 1>, <b. Answer 2>, <c. Answer 3>, <d. Answer 4>
        <Question2>: <a. Answer 1>, <b. Answer 2>, <c. Answer 3>, <d. Answer 4>
        ...
      - Answers:
        <Answer1>: <a|b|c|d>
        <Answer2>: <a|b|c|d>
        ...
        Example:
        - 1. What is the time complexity of a binary search tree?
            a. 0(n)
            b. 0(log n)
            c. 0(n^2)
            d. 0(1)
        - Answers:
            1. b
    - True-false
      - Questions:
        <Question1>: <True|False>
        <Question1>: <True|False>
        ...
      - Answers:
        <Answer1>: <True|False>
        <Answer2>: <True|False>
        ...
        Example:
          - Questions:
            1. Binary search tree is a data structure.
            2. Python list is immutable.
          - Answers:
            1. True
            2. False

    - Open-Ended:
      - Questions:
        <Question1>:
        <Question2>:
        ...
      - Answers:
        <Answer1>:
        <Answer2>:
        Exmaple:
          - Questions:
            1. What is a binary search tree?
            2. How are binary search trees implemented?

          - Answers:
            1. A binary search tree is a data structure that is used to store data in a sorted manner.
            2. Binary search trees are implemented using linked list.
    """

