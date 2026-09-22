from flask import Blueprint, jsonify, request, session

import backend.services.Application_Note_services as note_services


application_notes_bp = Blueprint("application_notes", __name__)


def note_response(note):
    return {
        "id": note.id,
        "application_id": note.application_id,
        "content": note.content,
        "created_at": note.created_at,
        "updated_at": note.updated_at,
    }


@application_notes_bp.route("/api/applications/<int:application_id>/notes", methods=["POST"])
def create_note(application_id):
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        note = note_services.create_application_notes(
            application_id=application_id,
            user_id=user_id,
            content=data.get("content", ""),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(note_response(note)), 201


@application_notes_bp.route("/api/applications/<int:application_id>/notes",methods=["GET"])
def get_notes(application_id):
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    notes = note_services.get_application_notes(
        application_id=application_id,
        user_id=user_id,
    )

    if notes is None:
        return jsonify({"error": "Application not found"}), 404

    return jsonify([note_response(note) for note in notes]), 200


@application_notes_bp.route("/api/applications/<int:application_id>/notes/<int:application_note_id>", methods=["PUT"])
def update_note(application_id, application_note_id):
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        note = note_services.update_application_note_content(
            application_id=application_id,
            user_id=user_id,
            application_note_id=application_note_id,
            content=data.get("content", ""),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if not note:
        return jsonify({"error": "Note not found"}), 404

    return jsonify(note_response(note)), 200


@application_notes_bp.route("/api/applications/<int:application_id>/notes/<int:application_note_id>", methods=["DELETE"])
def delete_note(application_id, application_note_id):
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    deleted = note_services.delete_application_notes(
        application_id=application_id,
        user_id=user_id,
        application_note_id=application_note_id,
    )

    if not deleted:
        return jsonify({"error": "Note not found"}), 404

    return jsonify({"message": "Note deleted successfully"}), 200