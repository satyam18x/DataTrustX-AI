import pandas as pd

from fastapi import (
    FastAPI,
    UploadFile,
    File
)

from fastapi.middleware.cors import (
    CORSMiddleware
)

import io

from utils.column_detector import (
    detect_columns
)

from checks.duplicate_check import (
    check_duplicate_ids
)

from checks.missing_value_check import (
    check_missing_values
)

from checks.datatype_check import (
    check_datatypes
)

from checks.email_check import (
    check_emails
)

from checks.age_range_check import (
    check_age_range
)

from checks.website_check import (
    check_websites
)

from checks.salary_check import (
    check_salary
)

from checks.variance_check import (
    check_variance
)

from checks.country_check import (
    check_countries
)

from checks.phone_check import (
    check_phone_numbers
)

from score_engine import (
    calculate_trust_score
)

# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(

    title="DataTrustX API",

    description=(
        "Dynamic Dataset Trust "
        "Validation Engine"
    ),

    version="2.0.0"
)

# ==========================================
# CORS
# ==========================================

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ==========================================
# ROOT API
# ==========================================

@app.get("/")

def root():

    return {

        "message": (
            "Welcome to DataTrustX API"
        )
    }

# ==========================================
# DATASET VALIDATION API
# ==========================================

@app.post("/validate")

async def validate_dataset(

    file: UploadFile = File(...)

):

    # ======================================
    # READ CSV
    # ======================================

    try:

        contents = await file.read()

        df = pd.read_csv(

            io.StringIO(
                contents.decode("utf-8")
            )
        )

    except Exception as e:

        return {

            "status": "FAILED",

            "error": (
                f"CSV_READ_ERROR: {str(e)}"
            )
        }

    # ======================================
    # DETECT COLUMNS
    # ======================================

    detected_columns = detect_columns(df)

    # ======================================
    # STRUCTURED REPORT
    # ======================================

    final_report = {

        "dataset_summary": {

            "file_name": file.filename,

            "total_rows": len(df),

            "total_columns": len(
                df.columns
            ),

            "column_names": (
                df.columns.tolist()
            ),

            "detected_columns": (
                detected_columns
            )
        },

        "checks": [],

        "final_score": {}
    }

    # ======================================
    # RUN CHECKS
    # ======================================

    checks = [

        (
            "duplicate_check",

            check_duplicate_ids(
                df,
                detected_columns
            )
        ),

        (
            "missing_value_check",

            check_missing_values(df)
        ),

        (
            "datatype_check",

            check_datatypes(df)
        ),

        (
            "email_check",

            check_emails(
                df,
                detected_columns
            )
        ),

        (
            "age_range_check",

            check_age_range(
                df,
                detected_columns
            )
        ),

        (
            "website_check",

            check_websites(
                df,
                detected_columns
            )
        ),

        (
            "salary_check",

            check_salary(
                df,
                detected_columns
            )
        ),

        (
            "variance_check",

            check_variance(df)
        ),

        (
            "country_check",

            check_countries(
                df,
                detected_columns
            )
        ),

        (
            "phone_check",

            check_phone_numbers(
                df,
                detected_columns
            )
        )
    ]

    # ======================================
    # FORMAT CHECK RESULTS
    # ======================================

    report_for_score = {}

    for check_name, result in checks:

        report_for_score[
            check_name
        ] = result

        formatted_result = {

            "check_name": (
                check_name
            ),

            "status": result.get(
                "status"
            ),

            "score": result.get(
                "score"
            ),

            "max_score": result.get(
                "max_score"
            ),

            "valid_percentage": (
                result.get(
                    "valid_percentage"
                )
            ),

            "details": result
        }

        final_report[
            "checks"
        ].append(
            formatted_result
        )

    # ======================================
    # FINAL TRUST SCORE
    # ======================================

    score_summary = (
        calculate_trust_score(
            report_for_score
        )
    )

    final_report[
        "final_score"
    ] = score_summary

    # ======================================
    # FINAL RESPONSE
    # ======================================

    return final_report