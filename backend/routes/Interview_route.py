from flask import Blueprint, jsonify, request, session

import backend.services.Interview_services as interview_services


interview_bp = Blueprint("interview", __name__)


def current_user_id():
    return session.get("user_id")


def interview_response(interview):
    return {
        "id": interview.id,
        "application_id": interview.application_id,
        "company_id": interview.company_id,
        "interview_date": interview.interview_date,
        "interview_type": interview.interview_type,
        "notes": interview.notes,
        "status": interview.status,
        "created_at": interview.created_at,
        "updated_at": interview.updated_at,
    }


@interview_bp.route(
    "/api/applications/<int:application_id>/interviews",
    methods=["GET"],
)
def get_interviews(application_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    interviews = interview_services.get_all_interviews(application_id, user_id)
    if interviews is None:
        return jsonify({"error": "Application not found"}), 404

    return jsonify([interview_response(item) for item in interviews]), 200


@interview_bp.route(
    "/api/applications/<int:application_id>/interviews/<int:interview_id>",
    methods=["GET"],
)
def get_interview(application_id, interview_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    interview = interview_services.get_interview_by_id(
        application_id,
        interview_id,
        user_id,
    )
    if not interview:
        return jsonify({"error": "Interview not found"}), 404

    return jsonify(interview_response(interview)), 200


@interview_bp.route(
    "/api/applications/<int:application_id>/interviews",
    methods=["POST"],
)
def create_interview(application_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        interview = interview_services.create_interview(
            application_id=application_id,
            user_id=user_id,
            interview_date=data.get("interview_date"),
            interview_type=data.get("interview_type", ""),
            notes=data.get("notes"),
            status=data.get("status", "Scheduled"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if not interview:
        return jsonify({"error": "Application not found"}), 404

    return jsonify(interview_response(interview)), 201


@interview_bp.route(
    "/api/applications/<int:application_id>/interviews/<int:interview_id>",
    methods=["PUT"],
)
def update_interview(application_id, interview_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        interview = interview_services.update_interview(
            application_id=application_id,
            interview_id=interview_id,
            user_id=user_id,
            interview_date=data.get("interview_date"),
            interview_type=data.get("interview_type"),
            notes=data.get("notes"),
            status=data.get("status"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if not interview:
        return jsonify({"error": "Interview not found"}), 404

    return jsonify(interview_response(interview)), 200


@interview_bp.route(
    "/api/applications/<int:application_id>/interviews/<int:interview_id>",
    methods=["DELETE"],
)
def delete_interview(application_id, interview_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    deleted = interview_services.delete_interview(
        application_id,
        interview_id,
        user_id,
    )
    if not deleted:
        return jsonify({"error": "Interview not found"}), 404

    return jsonify({"message": "Interview deleted successfully"}), 200
