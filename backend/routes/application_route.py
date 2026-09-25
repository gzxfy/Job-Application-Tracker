from flask import Blueprint, jsonify, request, session
import backend.services.Application_services as app_services
from backend.services.Company_services import (
    create_company_with_only_name,
    get_company_by_id,
)

application_bp = Blueprint("application", __name__)


def logged_in_user_id():
    # Routes use the session instead of trusting a user ID from the request body.
    return session.get("user_id")


def application_response(application):
    # Keep response formatting in one place so every application route has the same shape.
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
    # Return only applications owned by the currently logged-in user.
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    applications = app_services.get_all_applications(user_id)
    return jsonify([application_response(application) for application in applications])


@application_bp.route("/api/applications/<int:application_id>", methods=["GET"])
def get_application(application_id):
    # The service applies the same ownership check for a single application.
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    application = app_services.get_application_by_id(application_id, user_id)
    if not application:
        return jsonify({"error": "Application not found"}), 404
    return jsonify(application_response(application))


@application_bp.route("/api/applications/create", methods=["POST"])
def create_application():
    # Read and validate the client payload before delegating database work to the service.
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    position = data.get("position", "").strip()
    company_name = data.get("company_name", "").strip()
    company_id = data.get("company_id")

    if not position:
        return jsonify({"error": "position is required"}), 400

    try:
        if company_name:
            company = create_company_with_only_name(user_id, company_name)
        else:
            company = get_company_by_id(company_id, user_id)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if not company:
        return jsonify({"error": "Company not found"}), 404

    application = app_services.create_application(
        user_id=user_id,
        company_id=company.id,
        position=position,
        job_url=data.get("job_url"),
        status=data.get("status", "Applied"),
        date_applied=data.get("date_applied"),
    )
    return jsonify(application_response(application)), 201


@application_bp.route("/api/applications/update/<int:application_id>", methods=["PUT"])
def update_application(application_id):
    # PUT supports partial application updates while preserving ownership checks.
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
    # Deletion is performed by the service only after it finds the user's row.
    user_id = logged_in_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    if not app_services.delete_application(application_id, user_id):
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": "Application deleted successfully"})
