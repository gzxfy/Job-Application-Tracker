from flask import Blueprint, jsonify, request, session
import backend.services.Application_services as app_services


application_bp = Blueprint("application", __name__)


def logged_in_user_id():
    return session.get("user_id")


def application_response(application):
    return {
        "id": application.id,
        "user_id": application.user_id,
        "company_id": application.company_id,
        "company_name": application.company.name,
        "position": application.position,
        "job_url": application.job_url,
        "status": application.status,
        "date_applied": application.date_applied,
    }


@application_bp.route("/api/applications", methods=["GET"])
def get_applications():
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    applications = app_services.get_all_applications(user_id)
    return jsonify([application_response(application) for application in applications])


@application_bp.route("/api/applications/<int:application_id>", methods=["GET"])
def get_application(application_id):
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    application = app_services.get_application_by_id(application_id, user_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404
    return jsonify(application_response(application))


@application_bp.route("/api/applications/create", methods=["POST"])
def create_application():
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}
    company_id = data.get("company_id")
    position = data.get("position")
    if company_id is None or not position:
        return jsonify({"error": "company_id and position are required"}), 400

    application = app_services.create_application(
        user_id=user_id,
        company_id=company_id,
        position=position,
        job_url=data.get("job_url"),
        status=data.get("status", "Applied"),
        date_applied=data.get("date_applied"),
    )
    return jsonify(application_response(application)), 201


@application_bp.route("/api/applications/update/<int:application_id>", methods=["PUT"])
def update_application(application_id):
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}
    application = app_services.update_application(
        application_id=application_id,
        user_id=user_id,
        company_id=data.get("company_id"),
        position=data.get("position"),
        job_url=data.get("job_url"),
        status=data.get("status"),
    )
    if not application:
        return jsonify({"error": "Application not found"}), 404
    return jsonify(application_response(application))


@application_bp.route("/api/applications/delete/<int:application_id>", methods=["DELETE"])
def delete_application(application_id):
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    if not app_services.delete_application(application_id, user_id):
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": "Application deleted successfully"})
