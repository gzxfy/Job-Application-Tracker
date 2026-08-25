from flask import Blueprint, request, jsonify
import backend.services.application_services as app_services

application_bp = Blueprint('application', __name__)

@application_bp.route('/applications', methods=['GET'])
def get_applications():
    applications = app_services.get_all_applications()
    return jsonify([{
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    } for app in applications])

@application_bp.route('/applications/<int:application_id>', methods=['GET'])
def get_application(application_id):
    app = app_services.get_application_by_id(application_id)
    if not app:
        return jsonify({'error': 'Application not found'}), 404
    return jsonify({
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    })

@application_bp.route('/applications/status/<string:status>', methods=['GET'])
def get_applications_by_status(status):
    applications = app_services.get_applications_by_status(status)
    return jsonify([{
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    } for app in applications])

@application_bp.route('/applications/company/<string:company>', methods=['GET'])
def get_applications_by_company(company):
    applications = app_services.get_applications_by_company(company)
    return jsonify([{
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    } for app in applications])

@application_bp.route('/applications/position/<string:position>', methods=['GET'])
def get_applications_by_position(position):
    applications = app_services.get_applications_by_position(position)
    return jsonify([{
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    } for app in applications])

@application_bp.route('/applications/applied_date/<string:applied_date>', methods=['GET'])
def get_applications_by_applied_date(applied_date):
    applications = app_services.get_applications_by_applied_date(applied_date)
    return jsonify([{
        'id': app.id,
        'company': app.company,
        'position': app.position,
        'status': app.status,
        'notes': app.notes,
        'applied_date': app.applied_date
    } for app in applications])

@application_bp.route('/applications/update/<int:application_id>', methods=['PUT'])
def update_application(application_id):
    data = request.get_json()
    company = data.get('company')
    position = data.get('position')
    status = data.get('status')
    notes = data.get('notes')
    application = app_services.update_application(application_id, company, position, status, notes)
    if not application:
        return jsonify({'error': 'Application not found'}), 404
    return jsonify({
        'id': application.id,
        'company': application.company,
        'position': application.position,
        'status': application.status,
        'notes': application.notes,
        'applied_date': application.applied_date
    })

@application_bp.route('/applications/delete/<int:application_id>', methods=['DELETE'])
def delete_application(application_id, method="DELETE"):
    success = app_services.delete_application(application_id)
    if not success:
        return jsonify({'success': False, 'error': 'Application not found'}), 404
    return jsonify({'success': True, 'message': 'Application deleted successfully'})

@application_bp.route('/applications/create', methods=['POST'])
def create_application():
    data = request.get_json()
    company = data.get('company')
    position = data.get('position')
    status = data.get('status', 'Applied')
    notes = data.get('notes')
    application = app_services.create_application(company, position, status, notes)
    return jsonify({
        'id': application.id,
        'company': application.company,
        'position': application.position,
        'status': application.status,
        'notes': application.notes,
        'applied_date': application.applied_date
    })