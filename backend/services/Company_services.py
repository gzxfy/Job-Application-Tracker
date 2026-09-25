from backend.models.Company_model import Company
from backend.extensions import db

def get_company_by_id(company_id, user_id=None):
    """Return a company the user can access, including global demo companies."""
    if not company_id:
        return None

    query = Company.query.filter_by(id=company_id)
    if user_id is not None:
        query = query.filter(
            db.or_(Company.user_id == user_id, Company.user_id.is_(None))
        )
    return query.first()


def get_all_companies(user_id=None, search=None):
    """List accessible companies, optionally filtered by a name search."""
    query = Company.query
    if user_id is not None:
        query = query.filter(
            db.or_(Company.user_id == user_id, Company.user_id.is_(None))
        )
    if search and search.strip():
        query = query.filter(Company.name.ilike(f"%{search.strip()}%"))
    return query.order_by(Company.name).all()


def create_company(user_id, name, website=None, headquarters=None):
    if not name or not name.strip():
        raise ValueError("Must enter a name")

    company = Company(
        user_id=user_id,
        name=name.strip(),
        website=website.strip() if website else None,
        headquarters=headquarters.strip() if headquarters else None,
    )
    db.session.add(company)
    db.session.commit()
    return company


def update_company(company_id, user_id, name=None, website=None, headquarters=None):
    company = Company.query.filter_by(id=company_id, user_id=user_id).first()
    if not company:
        return None

    if name is not None:
        if not name.strip():
            raise ValueError("Company name cannot be empty")
        company.name = name.strip()
    if website is not None:
        if not website.strip():
            raise ValueError("Website cannot be empty")
        company.website = website.strip()
    if headquarters is not None:
        if not headquarters.strip():
            raise ValueError("Headquarters cannot be empty")
        company.headquarters = headquarters.strip()

    db.session.commit()
    return company


def delete_company(company_id, user_id):
    company = Company.query.filter_by(id=company_id, user_id=user_id).first()
    if not company:
        return False
    db.session.delete(company)
    db.session.commit()
    return True

# This will be first used when creating application to store a company with only name

def create_company_with_only_name(user_id, name):
    if not name or not name.strip():
        raise ValueError("Must enter a name")


    company = Company(
        user_id=user_id,
        name=name.strip(),
    )
    db.session.add(company)
    db.session.commit()
    return company
