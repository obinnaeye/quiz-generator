from ..mocks import mock_quiz_history

def get_user_quiz_history (user_id: str):
    print('this is the data from the db in the server', mock_quiz_history)
    return mock_quiz_history
