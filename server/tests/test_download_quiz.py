import pytest
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

valid_base_params = {
    "pattern": "DOWNLOAD_QUIZ",
    "user_id": "test-user-123",
    "question_type": "multichoice",
    "num_question": 2
}

@pytest.mark.parametrize("format,expected_content_type", [
    ("txt", "text/plain"),
    ("csv", "text/csv"),
    ("pdf", "application/pdf"),
    ("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
])
def test_download_quiz_valid_formats(format, expected_content_type):
    response = client.get("/download-quiz", params={**valid_base_params, "format": format})
    assert response.status_code == 200
    assert response.headers["content-type"].startswith(expected_content_type)
    assert "attachment;" in response.headers.get("content-disposition", "")


def test_download_quiz_invalid_question_type():
    params = {
        **valid_base_params,
        "question_type": "invalid-type",
        "format": "txt"
    }
    response = client.get("/download-quiz", params=params)
    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported question_type"


def test_download_quiz_invalid_format():
    params = {
        **valid_base_params,
        "format": "xlsx",  # not supported
    }
    response = client.get("/download-quiz", params=params)
    assert response.status_code == 400
    assert response.json()["detail"] == "Unsupported file format"


def test_download_quiz_exceeding_available_questions():
    params = {
        **valid_base_params,
        "num_question": 1000  # exceeds available, should still succeed if slicing is safe
    }
    response = client.get("/download-quiz", params=params)
    assert response.status_code == 200
    assert "attachment;" in response.headers.get("content-disposition", "")
