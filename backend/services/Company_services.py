from backend.models.Company_model import Company
# get by id
def get_company_by_id(company_id):
    if not company_id:
        return None

    query = Company.query.filter_by(id=company_id).first()

    return query

# grab all companies
def get_all_companies():
    return Company.query.all()

# TODO: add more services related activities for the company side of this model. Like create company, edit company, etc