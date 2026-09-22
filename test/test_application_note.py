from backend.models.Application_notes_model import ApplicationNotes


def test_create_application_note(logged_in_client):
    application_response = logged_in_client.post(
        "/api/applications/create",
        json={
            "company_id": 1,
            "position": "Backend Developer",
            "status": "Applied",
        },
    )
    assert application_response.status_code == 201
    application_id = application_response.get_json()["id"]

    response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "Follow up with the recruiter next Monday."},
    )

    assert response.status_code == 201
    data = response.get_json()
    note = ApplicationNotes.query.filter_by(id=data["id"]).first()

    assert data["application_id"] == application_id
    assert data["content"] == "Follow up with the recruiter next Monday."
    assert note is not None
    assert note.application_id == application_id
    assert note.content == "Follow up with the recruiter next Monday."

def test_delete_application_note(logged_in_client):
    application_response = logged_in_client.post(
            "/api/applications/create",
            json={
                "company_id": 1,
                "position": "Backend Developer",
                "status": "Applied",
            },
        )
    assert application_response.status_code == 201
    application_id = application_response.get_json()["id"]

    first_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "First note"},
    )
    second_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "Second note"},
    )

    assert first_note_response.status_code == 201
    assert second_note_response.status_code == 201

    first_note_id = first_note_response.get_json()["id"]
    second_note_id = second_note_response.get_json()["id"]

    delete_response = logged_in_client.delete(
        f"/api/applications/{application_id}/notes/{first_note_id}"
    )
    assert delete_response.status_code == 200
    assert delete_response.get_json()["message"] == ("Note deleted successfully")

    deleted_note = ApplicationNotes.query.filter_by(
        id=first_note_id
    ).first()

    remaining_note = ApplicationNotes.query.filter_by(
        id=second_note_id
    ).first()

    assert deleted_note is None
    assert remaining_note is not None
    assert remaining_note.content == "Second note"

def test_update_application_note(logged_in_client):
    application_response = logged_in_client.post(
            "/api/applications/create",
            json={
                "company_id": 1,
                "position": "Backend Developer",
                "status": "Applied",
            },
        )
    
    assert application_response.status_code == 201
    application_id = application_response.get_json()["id"]

    first_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "First note"},
    )
    second_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "Second note"},
    )

    assert first_note_response.status_code == 201
    assert second_note_response.status_code == 201

    first_note_id = first_note_response.get_json()["id"]
    second_note_id = second_note_response.get_json()["id"]

    updated_response = logged_in_client.put(
        f"/api/applications/{application_id}/notes/{first_note_id}",
        json={"content": "Updated Information"}
    )
    assert updated_response.status_code == 200
    assert updated_response.get_json()["content"] == ("Updated Information")

    updated_response = ApplicationNotes.query.filter_by(
        id=first_note_id
    ).first()

    remaining_note = ApplicationNotes.query.filter_by(
        id=second_note_id
    ).first()

    assert updated_response is not None
    assert remaining_note is not None
    assert remaining_note.content == "Second note"
    assert updated_response.content == "Updated Information"

def test_read_application_note(logged_in_client):
    application_response = logged_in_client.post(
            "/api/applications/create",
            json={
                "company_id": 1,
                "position": "Backend Developer",
                "status": "Applied",
            },
        )
    
    assert application_response.status_code == 201
    application_id = application_response.get_json()["id"]

    first_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "First note"},
    )
    second_note_response = logged_in_client.post(
        f"/api/applications/{application_id}/notes",
        json={"content": "Second note"},
    )

    assert first_note_response.status_code == 201
    assert second_note_response.status_code == 201

    first_note_id = first_note_response.get_json()["id"]
    second_note_id = second_note_response.get_json()["id"]

    notes_response = logged_in_client.get(
        f"/api/applications/{application_id}/notes"
    )

    assert notes_response.status_code == 200

    notes = notes_response.get_json()
    notes_by_id = {note["id"]: note for note in notes}

    assert len(notes) == 2
    assert notes_by_id[first_note_id]["application_id"] == application_id
    assert notes_by_id[first_note_id]["content"] == "First note"
    assert notes_by_id[second_note_id]["application_id"] == application_id
    assert notes_by_id[second_note_id]["content"] == "Second note"


