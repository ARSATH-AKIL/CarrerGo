from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import mysql.connector
import os

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

DB_CONFIG = {
    "host": "localhost",
    "user": "jobs",
    "password": "12345",
    "database": "careergo_db"
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads",
    "resumes"
)

ALLOWED_RESUME_EXTENSIONS = {
    "pdf",
    "doc",
    "docx"
}

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

def get_db_connection():

    try:

        connection = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            database=DB_CONFIG["database"],
            autocommit=False
        )

        return connection

    except mysql.connector.Error as e:

        print("MYSQL CONNECTION ERROR:", e)

        return None

def test_database_connection():

    db = get_db_connection()

    if db:

        print("===================================")
        print("MYSQL DATABASE CONNECTED")
        print("DATABASE:", DB_CONFIG["database"])
        print("===================================")

        db.close()

    else:

        print("===================================")
        print("MYSQL DATABASE CONNECTION FAILED")
        print("===================================")

def allowed_resume_file(filename):

    if not filename:
        return False

    if "." not in filename:
        return False

    extension = filename.rsplit(
        ".",
        1
    )[1].lower()

    return extension in ALLOWED_RESUME_EXTENSIONS

def get_resume_file_path(resume_path):

    if not resume_path:
        return None

    if os.path.isabs(resume_path):

        return resume_path

    return os.path.join(
        BASE_DIR,
        resume_path
    )

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "CareerGo Backend is Running!",
        "status": "success"
    }), 200

@app.route("/api/register", methods=["POST"])
def register():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:

            return jsonify({
                "message": "Name, email and password are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            SELECT id
            FROM job_seekers
            WHERE email = %s
            """,
            (email,)
        )

        existing = cursor.fetchone()

        if existing:

            return jsonify({
                "message": "Email already registered"
            }), 409

        cursor.execute(
            """
            INSERT INTO job_seekers
            (
                name,
                email,
                password
            )
            VALUES (%s, %s, %s)
            """,
            (
                name,
                email,
                password
            )
        )

        db.commit()

        return jsonify({
            "message": "Registration successful"
        }), 201

    except Exception as e:

        if db:
            db.rollback()

        print("REGISTER ERROR:", e)

        return jsonify({
            "message": "Registration failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/login", methods=["POST"])
def login():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "message": "Email and password are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password,
                resume
            FROM job_seekers
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "message": "User account not found"
            }), 404

        if user["password"] != password:

            return jsonify({
                "message": "Invalid password"
            }), 401

        return jsonify({

            "message": "Login successful",

            "user": {

                "id": user["id"],

                "name": user["name"],

                "email": user["email"],

                "role": "user",

                "resume": user.get("resume")

            }

        }), 200

    except Exception as e:

        print("LOGIN ERROR:", e)

        return jsonify({
            "message": "Login failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/company/register", methods=["POST"])
def company_register():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:

            return jsonify({
                "message": "Name, email and password are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing = cursor.fetchone()

        if existing:

            return jsonify({
                "message": "Email already registered"
            }), 409

        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES (%s, %s, %s, %s)
            """,
            (
                name,
                email,
                password,
                "company"
            )
        )

        db.commit()

        return jsonify({
            "message": "Company registered successfully"
        }), 201

    except Exception as e:

        if db:
            db.rollback()

        print("COMPANY REGISTER ERROR:", e)

        return jsonify({
            "message": "Company registration failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/company/login", methods=["POST"])
def company_login():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "message": "Email and password are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = %s
            AND role = 'company'
            """,
            (email,)
        )

        company = cursor.fetchone()

        if not company:

            return jsonify({
                "message": "Company account not found"
            }), 404

        if company["password"] != password:

            return jsonify({
                "message": "Invalid password"
            }), 401

        return jsonify({

            "message": "Company login successful",

            "company": {

                "id": company["id"],

                "name": company["name"],

                "email": company["email"],

                "role": company["role"]

            }

        }), 200

    except Exception as e:

        print("COMPANY LOGIN ERROR:", e)

        return jsonify({
            "message": "Login failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/admin/login", methods=["POST"])
def admin_login():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:

            return jsonify({
                "message": "Email and password are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                password,
                role
            FROM users
            WHERE email = %s
            AND role = 'admin'
            """,
            (email,)
        )

        admin = cursor.fetchone()

        if not admin:

            return jsonify({
                "message": "Admin account not found"
            }), 404

        if admin["password"] != password:

            return jsonify({
                "message": "Invalid admin password"
            }), 401

        return jsonify({

            "message": "Admin login successful",

            "admin": {

                "id": admin["id"],

                "name": admin["name"],

                "email": admin["email"],

                "role": admin["role"]

            }

        }), 200

    except Exception as e:

        print("ADMIN LOGIN ERROR:", e)

        return jsonify({
            "message": "Admin login failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/admin/dashboard", methods=["GET"])
def admin_dashboard():

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM job_seekers
            """
        )

        users = cursor.fetchone()["total"] or 0

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM users
            WHERE role = 'company'
            """
        )

        companies = cursor.fetchone()["total"] or 0

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM jobs
            """
        )

        jobs = cursor.fetchone()["total"] or 0

        active_jobs = jobs

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM applications
            """
        )

        applications = cursor.fetchone()["total"] or 0

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM applications
            WHERE LOWER(TRIM(status))
            IN ('applied', 'pending')
            """
        )

        pending_applications = cursor.fetchone()["total"] or 0

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM applications
            WHERE LOWER(TRIM(status))
            IN ('accepted', 'accept')
            """
        )

        accepted_applications = cursor.fetchone()["total"] or 0

        cursor.execute(
            """
            SELECT COUNT(*) AS total
            FROM applications
            WHERE LOWER(TRIM(status))
            IN ('rejected', 'reject')
            """
        )

        rejected_applications = cursor.fetchone()["total"] or 0

        return jsonify({

            "stats": {

                "users": users,

                "companies": companies,

                "jobs": jobs,

                "active_jobs": active_jobs,

                "applications": applications,

                "pending_applications":
                    pending_applications,

                "accepted_applications":
                    accepted_applications,

                "rejected_applications":
                    rejected_applications

            }

        }), 200

    except Exception as e:

        print("ADMIN DASHBOARD ERROR:", e)

        return jsonify({

            "message":
                "Unable to get admin dashboard",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/jobs", methods=["POST"])
def create_job():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        company_id = data.get("company_id")
        title = data.get("title")
        description = data.get("description")
        location = data.get("location")
        salary = data.get("salary")
        job_type = data.get("job_type") or data.get("type")
        skills = data.get("skills")

        if not company_id:

            return jsonify({
                "message": "Company ID is required"
            }), 400

        if not title:

            return jsonify({
                "message": "Job title is required"
            }), 400

        if not description:

            return jsonify({
                "message": "Job description is required"
            }), 400

        if not location:

            return jsonify({
                "message": "Location is required"
            }), 400

        if not salary:

            return jsonify({
                "message": "Salary is required"
            }), 400

        if not job_type:

            return jsonify({
                "message": "Job type is required"
            }), 400

        if not skills:

            return jsonify({
                "message": "Skills are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE id = %s
            AND role = 'company'
            """,
            (company_id,)
        )

        company = cursor.fetchone()

        if not company:

            return jsonify({
                "message": "Company not found"
            }), 404

        cursor.execute(
            """
            INSERT INTO jobs
            (
                company,
                title,
                description,
                location,
                salary,
                type,
                skills
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                company_id,
                title,
                description,
                location,
                salary,
                job_type,
                skills
            )
        )

        db.commit()

        return jsonify({

            "message":
                "Job posted successfully",

            "job_id":
                cursor.lastrowid

        }), 201

    except Exception as e:

        if db:
            db.rollback()

        print("CREATE JOB ERROR:", e)

        return jsonify({

            "message":
                "Failed to post job",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route("/api/jobs", methods=["GET"])
def get_jobs():

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                jobs.id,
                jobs.company,
                jobs.title,
                jobs.description,
                jobs.location,
                jobs.salary,
                jobs.type,
                jobs.skills,

                users.name AS company_name,
                users.email AS company_email

            FROM jobs

            LEFT JOIN users
            ON jobs.company = users.id

            ORDER BY jobs.id DESC
            """
        )

        jobs = cursor.fetchall()

        return jsonify({
            "jobs": jobs
        }), 200

    except Exception as e:

        print("GET JOBS ERROR:", e)

        return jsonify({

            "message":
                "Unable to get jobs",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/company/jobs/<int:company_id>",
    methods=["GET"]
)
def get_company_jobs(company_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                jobs.id,
                jobs.company,
                jobs.title,
                jobs.description,
                jobs.location,
                jobs.salary,
                jobs.type,
                jobs.skills,

                users.name AS company_name,
                users.email AS company_email

            FROM jobs

            LEFT JOIN users
            ON jobs.company = users.id

            WHERE jobs.company = %s

            ORDER BY jobs.id DESC
            """,
            (company_id,)
        )

        jobs = cursor.fetchall()

        return jsonify({
            "jobs": jobs
        }), 200

    except Exception as e:

        print("COMPANY JOBS ERROR:", e)

        return jsonify({

            "message":
                "Unable to get company jobs",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/jobs/<int:job_id>",
    methods=["GET"]
)
def get_job(job_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                jobs.id,
                jobs.company,
                jobs.title,
                jobs.description,
                jobs.location,
                jobs.salary,
                jobs.type,
                jobs.skills,

                users.name AS company_name,
                users.email AS company_email

            FROM jobs

            LEFT JOIN users
            ON jobs.company = users.id

            WHERE jobs.id = %s
            """,
            (job_id,)
        )

        job = cursor.fetchone()

        if not job:

            return jsonify({
                "message": "Job not found"
            }), 404

        return jsonify({
            "job": job
        }), 200

    except Exception as e:

        print("GET JOB ERROR:", e)

        return jsonify({

            "message":
                "Unable to get job",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/jobs/<int:job_id>",
    methods=["PUT"]
)
def update_job(job_id):

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        title = data.get("title")
        location = data.get("location")
        salary = data.get("salary")
        job_type = data.get("type") or data.get("job_type")
        description = data.get("description")
        skills = data.get("skills")

        if (
            not title
            or not location
            or not salary
            or not job_type
            or not description
            or not skills
        ):

            return jsonify({
                "message": "All job fields are required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        if not cursor.fetchone():

            return jsonify({
                "message": "Job not found"
            }), 404

        cursor.execute(
            """
            UPDATE jobs

            SET
                title = %s,
                location = %s,
                salary = %s,
                type = %s,
                description = %s,
                skills = %s

            WHERE id = %s
            """,
            (
                title,
                location,
                salary,
                job_type,
                description,
                skills,
                job_id
            )
        )

        db.commit()

        return jsonify({
            "message": "Job updated successfully"
        }), 200

    except Exception as e:

        if db:
            db.rollback()

        print("UPDATE JOB ERROR:", e)

        return jsonify({

            "message":
                "Failed to update job",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/jobs/<int:job_id>",
    methods=["DELETE"]
)
def delete_job(job_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            DELETE FROM applications
            WHERE job_id = %s
            """,
            (job_id,)
        )

        cursor.execute(
            """
            DELETE FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        if cursor.rowcount == 0:

            db.rollback()

            return jsonify({
                "message": "Job not found"
            }), 404

        db.commit()

        return jsonify({
            "message": "Job deleted successfully"
        }), 200

    except Exception as e:

        if db:
            db.rollback()

        print("DELETE JOB ERROR:", e)

        return jsonify({

            "message":
                "Failed to delete job",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/applications",
    methods=["POST"]
)
def create_application():

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        job_id = data.get("job_id")
        user_id = data.get("user_id")

        if not job_id:

            return jsonify({
                "message": "Job ID is required"
            }), 400

        if not user_id:

            return jsonify({
                "message": "User ID is required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        if not cursor.fetchone():

            return jsonify({
                "message": "Job not found"
            }), 404

        cursor.execute(
            """
            SELECT id
            FROM job_seekers
            WHERE id = %s
            """,
            (user_id,)
        )

        if not cursor.fetchone():

            return jsonify({
                "message": "User not found"
            }), 404

        cursor.execute(
            """
            SELECT
                id,
                status,
                applied_at

            FROM applications

            WHERE job_id = %s
            AND user_id = %s
            """,
            (
                job_id,
                user_id
            )
        )

        existing = cursor.fetchone()

        if existing:

            return jsonify({

                "message":
                    "You have already applied for this job",

                "already_applied":
                    True,

                "applied":
                    True,

                "application":
                    existing

            }), 409

        cursor.execute(
            """
            INSERT INTO applications
            (
                job_id,
                user_id,
                status
            )

            VALUES
            (%s, %s, %s)
            """,
            (
                job_id,
                user_id,
                "Applied"
            )
        )

        db.commit()

        return jsonify({

            "message":
                "Application submitted successfully",

            "application_id":
                cursor.lastrowid,

            "already_applied":
                True,

            "applied":
                True

        }), 201

    except Exception as e:

        if db:
            db.rollback()

        print("APPLICATION ERROR:", e)

        return jsonify({

            "message":
                "Failed to submit application",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/applications/check/<int:job_id>/<int:user_id>",
    methods=["GET"]
)
def check_application(job_id, user_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                applications.id,
                applications.job_id,
                applications.user_id,
                applications.status,
                applications.applied_at,

                jobs.title AS job_title

            FROM applications

            INNER JOIN jobs
            ON applications.job_id = jobs.id

            WHERE applications.job_id = %s
            AND applications.user_id = %s
            """,
            (
                job_id,
                user_id
            )
        )

        application = cursor.fetchone()

        if application:

            return jsonify({

                "applied":
                    True,

                "already_applied":
                    True,

                "application":
                    application

            }), 200

        return jsonify({

            "applied":
                False,

            "already_applied":
                False,

            "application":
                None

        }), 200

    except Exception as e:

        print("CHECK APPLICATION ERROR:", e)

        return jsonify({

            "message":
                "Unable to check application",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/applications",
    methods=["GET"]
)
def get_applications():

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT

                applications.id,
                applications.job_id,
                applications.user_id,
                applications.status,
                applications.applied_at,

                jobs.title AS job_title,
                jobs.location,
                jobs.salary,
                jobs.type,

                applicant.name AS applicant_name,
                applicant.email AS applicant_email,
                applicant.resume AS applicant_resume,

                company.id AS company_id,
                company.name AS company_name

            FROM applications

            LEFT JOIN jobs
            ON applications.job_id = jobs.id

            LEFT JOIN job_seekers AS applicant
            ON applications.user_id = applicant.id

            LEFT JOIN users AS company
            ON jobs.company = company.id

            ORDER BY applications.id DESC
            """
        )

        applications = cursor.fetchall()

        return jsonify({

            "applications":
                applications

        }), 200

    except Exception as e:

        print("GET APPLICATIONS ERROR:", e)

        return jsonify({

            "message":
                "Unable to get applications",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/user/applications/<int:user_id>",
    methods=["GET"]
)
def get_user_applications(user_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT

                applications.id AS application_id,
                applications.job_id,
                applications.user_id,
                applications.status,
                applications.applied_at,

                jobs.title,
                jobs.description,
                jobs.location,
                jobs.salary,
                jobs.type,
                jobs.skills,

                users.name AS company_name,
                users.email AS company_email

            FROM applications

            INNER JOIN jobs
            ON applications.job_id = jobs.id

            LEFT JOIN users
            ON jobs.company = users.id

            WHERE applications.user_id = %s

            ORDER BY applications.applied_at DESC
            """,
            (user_id,)
        )

        applications = cursor.fetchall()

        return jsonify({

            "applications":
                applications

        }), 200

    except Exception as e:

        print("USER APPLICATIONS ERROR:", e)

        return jsonify({

            "message":
                "Unable to get user applications",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/company/applications/<int:company_id>",
    methods=["GET"]
)
def get_company_applications(company_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT

                applications.id,
                applications.job_id,
                applications.user_id,
                applications.status,
                applications.applied_at,

                jobs.title AS job_title,
                jobs.location,
                jobs.salary,
                jobs.type,

                applicant.name AS applicant_name,
                applicant.email AS applicant_email,
                applicant.resume AS applicant_resume,

                company.id AS company_id,
                company.name AS company_name,
                company.email AS company_email

            FROM applications

            INNER JOIN jobs
            ON applications.job_id = jobs.id

            INNER JOIN job_seekers AS applicant
            ON applications.user_id = applicant.id

            INNER JOIN users AS company
            ON jobs.company = company.id

            WHERE jobs.company = %s

            ORDER BY applications.id DESC
            """,
            (company_id,)
        )

        applications = cursor.fetchall()

        for application in applications:

            if application.get("applicant_resume"):

                application["resume_available"] = True

                application["resume_view_url"] = (
                    f"/api/company/applicant-resume/"
                    f"{company_id}/"
                    f"{application['user_id']}"
                )

                application["resume_download_url"] = (
                    f"/api/company/applicant-resume/"
                    f"{company_id}/"
                    f"{application['user_id']}"
                    f"?download=true"
                )

            else:

                application["resume_available"] = False

                application["resume_view_url"] = None

                application["resume_download_url"] = None

        return jsonify({

            "applications":
                applications

        }), 200

    except Exception as e:

        print("COMPANY APPLICATIONS ERROR:", e)

        return jsonify({

            "message":
                "Unable to get company applications",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/applications/<int:application_id>",
    methods=["PUT"]
)
def update_application_status(application_id):

    db = None
    cursor = None

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "message": "No data received"
            }), 400

        status = data.get("status")

        if not status:

            return jsonify({
                "message": "Status is required"
            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({
                "message": "Database connection failed"
            }), 500

        cursor = db.cursor()

        cursor.execute(
            """
            UPDATE applications

            SET status = %s

            WHERE id = %s
            """,
            (
                status,
                application_id
            )
        )

        if cursor.rowcount == 0:

            db.rollback()

            return jsonify({
                "message": "Application not found"
            }), 404

        db.commit()

        return jsonify({

            "message":
                "Application status updated successfully"

        }), 200

    except Exception as e:

        if db:
            db.rollback()

        print("UPDATE APPLICATION ERROR:", e)

        return jsonify({

            "message":
                "Failed to update application",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/user/upload-resume",
    methods=["POST"]
)
def upload_resume():

    db = None
    cursor = None

    try:

        print("\n===================================")
        print("RESUME UPLOAD API HIT")
        print("===================================")

        user_id = request.form.get("user_id")

        resume = request.files.get("resume")

        print("USER ID:", user_id)

        print(
            "RESUME:",
            resume.filename if resume else None
        )

        if not user_id:

            return jsonify({
                "message":
                    "User ID is required"
            }), 400

        if not resume:

            return jsonify({
                "message":
                    "Resume file is required"
            }), 400

        if not allowed_resume_file(
            resume.filename
        ):

            return jsonify({

                "message":
                    "Only PDF, DOC and DOCX files are allowed"

            }), 400

        filename = secure_filename(
            resume.filename
        )

        if not filename:

            return jsonify({

                "message":
                    "Invalid resume filename"

            }), 400

        db = get_db_connection()

        if not db:

            return jsonify({

                "message":
                    "Database connection failed"

            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                resume
            FROM job_seekers
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({

                "message":
                    "User not found"

            }), 404

        old_resume = user.get("resume")

        if old_resume:

            old_file_path = get_resume_file_path(
                old_resume
            )

            if (
                old_file_path
                and os.path.exists(old_file_path)
            ):

                try:

                    os.remove(old_file_path)

                    print(
                        "OLD RESUME DELETED:",
                        old_file_path
                    )

                except Exception as delete_error:

                    print(
                        "OLD RESUME DELETE ERROR:",
                        delete_error
                    )

        new_filename = (
            f"user_{user_id}_{filename}"
        )

        file_path = os.path.join(
            UPLOAD_FOLDER,
            new_filename
        )

        resume.save(file_path)

        database_path = os.path.join(
            "uploads",
            "resumes",
            new_filename
        ).replace(
            "\\",
            "/"
        )

        cursor.execute(
            """
            UPDATE job_seekers

            SET resume = %s

            WHERE id = %s
            """,
            (
                database_path,
                user_id
            )
        )

        db.commit()

        print(
            "NEW RESUME SAVED:",
            file_path
        )

        print(
            "DATABASE PATH:",
            database_path
        )

        return jsonify({

            "message":
                "Resume uploaded successfully",

            "resume":
                database_path,

            "resume_url":
                f"/api/user/resume/{user_id}",

            "file_name":
                filename

        }), 200

    except Exception as e:

        if db:
            db.rollback()

        print(
            "RESUME UPLOAD ERROR:",
            e
        )

        return jsonify({

            "message":
                "Resume upload failed",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/user/resume/<int:user_id>",
    methods=["GET"]
)
def view_user_resume(user_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message":
                    "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                resume
            FROM job_seekers
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "message":
                    "User not found"
            }), 404

        if not user.get("resume"):

            return jsonify({
                "message":
                    "Resume not uploaded"
            }), 404

        file_path = get_resume_file_path(
            user["resume"]
        )

        if not file_path:

            return jsonify({
                "message":
                    "Resume path not found"
            }), 404

        if not os.path.exists(file_path):

            return jsonify({
                "message":
                    "Resume file not found on server"
            }), 404

        return send_file(
            file_path,
            as_attachment=False
        )

    except Exception as e:

        print(
            "VIEW USER RESUME ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to open resume",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/company/applicant-resume/<int:company_id>/<int:user_id>",
    methods=["GET"]
)
def company_applicant_resume(
    company_id,
    user_id
):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message":
                    "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email
            FROM users
            WHERE id = %s
            AND role = 'company'
            """,
            (company_id,)
        )

        company = cursor.fetchone()

        if not company:

            return jsonify({
                "message":
                    "Company not found"
            }), 404

        cursor.execute(
            """
            SELECT

                job_seekers.id,
                job_seekers.name,
                job_seekers.email,
                job_seekers.resume,

                applications.id AS application_id,

                jobs.id AS job_id,
                jobs.title AS job_title,
                jobs.company

            FROM job_seekers

            INNER JOIN applications
            ON applications.user_id = job_seekers.id

            INNER JOIN jobs
            ON applications.job_id = jobs.id

            WHERE job_seekers.id = %s
            AND jobs.company = %s

            LIMIT 1
            """,
            (
                user_id,
                company_id
            )
        )

        applicant = cursor.fetchone()

        if not applicant:

            return jsonify({

                "message":
                    "This applicant has not applied to your company"

            }), 403

        if not applicant.get("resume"):

            return jsonify({

                "message":
                    "Applicant has not uploaded a resume"

            }), 404

        file_path = get_resume_file_path(
            applicant["resume"]
        )

        if not file_path:

            return jsonify({

                "message":
                    "Resume path not found"

            }), 404

        if not os.path.exists(file_path):

            return jsonify({

                "message":
                    "Resume file not found on server",

                "path":
                    file_path

            }), 404

        download = request.args.get(
            "download",
            "false"
        ).lower() == "true"

        if download:

            return send_file(

                file_path,

                as_attachment=True,

                download_name=os.path.basename(
                    file_path
                )

            )

        return send_file(

            file_path,

            as_attachment=False

        )

    except Exception as e:

        print(
            "COMPANY RESUME ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to open applicant resume",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/user/profile/<int:user_id>",
    methods=["GET"]
)
def get_user_profile(user_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message":
                    "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                resume
            FROM job_seekers
            WHERE id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:

            return jsonify({
                "message":
                    "User not found"
            }), 404

        if user.get("resume"):

            user["resume_url"] = (
                f"/api/user/resume/{user_id}"
            )

        else:

            user["resume_url"] = None

        user["role"] = "user"

        return jsonify({
            "user": user
        }), 200

    except Exception as e:

        print(
            "USER PROFILE ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to get user profile",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

@app.route(
    "/api/company/profile/<int:company_id>",
    methods=["GET"]
)
def get_company_profile(company_id):

    db = None
    cursor = None

    try:

        db = get_db_connection()

        if not db:

            return jsonify({
                "message":
                    "Database connection failed"
            }), 500

        cursor = db.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                name,
                email,
                role
            FROM users
            WHERE id = %s
            AND role = 'company'
            """,
            (company_id,)
        )

        company = cursor.fetchone()

        if not company:

            return jsonify({
                "message":
                    "Company not found"
            }), 404

        return jsonify({
            "company": company
        }), 200

    except Exception as e:

        print(
            "COMPANY PROFILE ERROR:",
            e
        )

        return jsonify({

            "message":
                "Unable to get company profile",

            "error":
                str(e)

        }), 500

    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()

print("\n==============================================")
print("             CAREERGO API ROUTES")
print("==============================================")

for rule in app.url_map.iter_rules():

    print(
        f"{rule.methods} -> {rule}"
    )

print("==============================================\n")

if __name__ == "__main__":

    test_database_connection()

    print("\n==============================================")
    print("CareerGo Backend Started")
    print("http://127.0.0.1:5000")
    print("==============================================\n")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )