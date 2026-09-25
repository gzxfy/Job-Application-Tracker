from flask import Blueprint, jsonify, request, session

import backend.services.Company_services as company_services

company_bp = Blueprint("company", __name__)


def current_user_id():
    # Routes use the session instead of trusting a user ID from the request body.
    return session.get("user_id")


def company_response(company):
    # Keep the JSON shape consistent for every company endpoint.
    return {
        "id": company.id,
        "user_id": company.user_id,
        "name": company.name,
        "website": company.website,
        "headquarters": company.headquarters,
    }


@company_bp.route("/api/companies", methods=["GET"])
def get_companies():
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    companies = company_services.get_all_companies(user_id)
    return jsonify([company_response(company) for company in companies]), 200


@company_bp.route("/api/companies/<int:company_id>", methods=["GET"])
def get_company(company_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    company = company_services.get_company_by_id(company_id, user_id)
    if not company:
        return jsonify({"error": "Company not found"}), 404

    return jsonify(company_response(company)), 200


@company_bp.route("/api/companies", methods=["POST"])
def create_company():
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        company = company_services.create_company(
            user_id=user_id,
            name=data.get("name") or data.get("company_name", ""),
            website=data.get("website"),
            headquarters=data.get("headquarters"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(company_response(company)), 201


@company_bp.route("/api/companies/<int:company_id>", methods=["PUT"])
def update_company(company_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    data = request.get_json() or {}

    try:
        company = company_services.update_company(
            company_id=company_id,
            user_id=user_id,
            name=data.get("name"),
            website=data.get("website"),
            headquarters=data.get("headquarters"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if not company:
        return jsonify({"error": "Company not found"}), 404

    return jsonify(company_response(company)), 200


@company_bp.route("/api/companies/<int:company_id>", methods=["DELETE"])
def delete_company(company_id):
    user_id = current_user_id()
    if not user_id:
        return jsonify({"error": "Please log in"}), 401

    if not company_services.delete_company(company_id, user_id):
        return jsonify({"error": "Company not found"}), 404

    return jsonify({"message": "Company deleted successfully"}), 200