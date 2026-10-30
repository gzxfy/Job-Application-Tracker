from backend.repositories import company_repository as companies


def get_company_by_id(company_id, user_id=None):
    if not company_id:
        return None
    return companies.get_accessible(company_id, user_id)


def get_all_companies(user_id=None, search=None):
    return companies.list_accessible(user_id, search.strip() if search else None)


def create_company(user_id, name, website=None, headquarters=None):
    if not name or not name.strip():
        raise ValueError("Must enter a name")

    company = companies.create(
        user_id=user_id,
        name=name.strip(),
        website=website.strip() if website else None,
        headquarters=headquarters.strip() if headquarters else None,
    )
    return company


def update_company(company_id, user_id, name=None, website=None, headquarters=None):
    company = companies.get_owned(company_id, user_id)
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

    companies.save(company)
    return company


def delete_company(company_id, user_id):
    company = companies.get_owned(company_id, user_id)
    if not company:
        return False
    companies.delete(company)
    return True

# This will be first used when creating application to store a company with only name

def create_company_with_only_name(user_id, name):
    if not name or not name.strip():
        raise ValueError("Must enter a name")


    company = companies.create(
        user_id=user_id,
        name=name.strip(),
    )
    return company
