import pytest
from unittest.mock import patch
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from fastapi.testclient import TestClient
from io import BytesIO
from server.main import app  
from server.api.v1.crud.download_quiz import download_quiz

client = TestClient(app)

def mock_generate_file(data):
    """Mock function to return a file-like object."""
    return BytesIO(b"mock file content")

@pytest.mark.parametrize("format, content_type", [
    ("txt", "text/plain"),
    ("csv", "text/csv"),
    ("pdf", "application/pdf"),
    ("docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
])
@patch("server.api.v1.crud.download_quiz.quiz_data_multiple_choice", new=[{"q": "A"}] * 10)
@patch("server.api.v1.crud.download_quiz.generate_txt", side_effect=mock_generate_file)
@patch("server.api.v1.crud.download_quiz.generate_csv", side_effect=mock_generate_file)
@patch("server.api.v1.crud.download_quiz.generate_pdf", side_effect=mock_generate_file)
@patch("server.api.v1.crud.download_quiz.generate_docx", side_effect=mock_generate_file)
def test_download_quiz_valid_formats(
    mock_txt, mock_csv, mock_pdf, mock_docx, format, content_type
):
    """Test if download_quiz correctly returns a StreamingResponse with valid formats."""
    response = download_quiz(format=format, question_type="multichoice", num_question=5)
    
    assert isinstance(response, StreamingResponse)
    assert response.media_type == content_type
    assert response.headers["Content-Disposition"] == f"attachment; filename=quiz_data.{format}"

@pytest.mark.parametrize("question_type", ["invalid-type", "random"])
def test_download_quiz_invalid_question_type(question_type):
    """Test if download_quiz raises HTTPException for unsupported question types."""
    with pytest.raises(HTTPException) as exc:
        download_quiz(format="txt", question_type=question_type, num_question=5)
    assert exc.value.status_code == 400
    assert "Unsupported question_type" in exc.value.detail

@pytest.mark.parametrize("format", ["xml", "json", "xlsx"])
def test_download_quiz_invalid_format(format):
    """Test if download_quiz raises HTTPException for unsupported file formats."""
    with pytest.raises(HTTPException) as exc:
        download_quiz(format=format, question_type="multichoice", num_question=5)
    assert exc.value.status_code == 400
    assert "Unsupported file format" in exc.value.detail






@pytest.mark.parametrize("format,question_type,num_question,status_code", [
    ("txt", "multichoice", 5, 200),
    ("csv", "true-false", 3, 200),
    ("pdf", "open-ended", 2, 200),
    ("docx", "multichoice", 4, 200),
    ("txt", "invalid-type", 5, 400), 
    ("csv", "true-false", 0, 422),
])
def test_download_quiz_api(format, question_type, num_question, status_code):
    response = client.get(
        "/download-quiz",
        params={
            "format": format,
            "question_type": question_type,
            "num_question": num_question,
            "user_id": "test_user"
        }
    )

    print(response.status_code, response.headers)

    assert response.status_code == status_code

    if status_code == 200:
        assert "Content-Disposition" in response.headers
        assert f"attachment; filename=quiz_data.{format}" in response.headers["Content-Disposition"]
        assert response.content 
    else:
        assert "application/json" in response.headers["content-type"]
        assert "detail" in response.json()


