from app import create_app

def create_test_application(client):
    return client.post('/applications/create', json={
        'company': 'Test Company',
        'position': 'Test Position',
        'status': 'Applied',
        'notes': 'Test Notes'
    })

app = create_app()

def test_create_application():
    client = app.test_client()
    response = create_test_application(client)
    assert response.status_code == 200
    data = response.get_json()
    assert data['company'] == 'Test Company'
    assert data['position'] == 'Test Position'
    assert data['status'] == 'Applied'
    assert data['notes'] == 'Test Notes'
    assert 'id' in data
    assert 'applied_date' in data

def test_get_application_by_id():
    client = app.test_client()
    # First, create an application to ensure there is one to retrieve
    create_response = create_test_application(client)
    assert create_response.status_code == 200
    created_data = create_response.get_json()
    application_id = created_data['id']

    # Now, retrieve the application by ID
    response = client.get(f'/applications/{application_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['id'] == application_id
    assert data['company'] == 'Test Company'
    assert data['position'] == 'Test Position'
    assert data['status'] == 'Applied'
    assert data['notes'] == 'Test Notes'
    assert 'applied_date' in data


def test_get_all_applications():
    client = app.test_client()
    # First, create an application to ensure there is at least one
    create_response = create_test_application(client)
    assert create_response.status_code == 200

    # Now, retrieve all applications
    response = client.get('/applications')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert 'id' in data[0]
    assert 'company' in data[0]
    assert 'position' in data[0]
    assert 'status' in data[0]
    assert 'notes' in data[0]
    assert 'applied_date' in data[0]

def test_delete_application():
    client = app.test_client()
    # First, create an application to ensure there is one to delete
    create_response = create_test_application(client)
    assert create_response.status_code == 200
    created_data = create_response.get_json()
    application_id = created_data['id']

    # Now, delete the application by ID
    response = client.delete(f'/applications/delete/{application_id}')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True

    # Verify the application has been deleted
    get_response = client.get(f'/applications/{application_id}')
    assert get_response.status_code == 404
    get_data = get_response.get_json()
    assert get_data['error'] == 'Application not found'

def test_update_application():
    client = app.test_client()
    # First, create an application to ensure there is one to update
    create_response = create_test_application(client)
    assert create_response.status_code == 200
    created_data = create_response.get_json()
    application_id = created_data['id']

    # Now, update the application by ID
    update_data = {
        'company': 'Updated Company',
        'position': 'Updated Position',
        'status': 'Interviewing',
        'notes': 'Updated Notes'
    }
    response = client.put(f'/applications/update/{application_id}', json=update_data)
    assert response.status_code == 200
    data = response.get_json()
    data['company'] = "New Company"
    assert data['id'] == application_id
    assert data['company'] == 'New Company'
    assert data['position'] == 'Updated Position'
    assert data['status'] == 'Interviewing'
    assert data['notes'] == 'Updated Notes'
    assert 'applied_date' in data
