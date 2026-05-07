import pandas as pd
import numpy as np


def check_variance(df):

    variance_issues = []

    total_checks = 0

    total_valid = 0

    # ======================================
    # LOOP THROUGH ALL COLUMNS
    # ======================================

    for column in df.columns:

        series = df[column]

        # ==================================
        # TRY NUMERIC CONVERSION
        # ==================================

        numeric_series = pd.to_numeric(
            series,
            errors="coerce"
        )

        # ==================================
        # CHECK IF COLUMN IS MOSTLY NUMERIC
        # ==================================

        numeric_ratio = (
            numeric_series.notnull().sum()
            / len(series)
        )

        # ==================================
        # ONLY APPLY TO NUMERIC COLUMNS
        # ==================================

        if numeric_ratio < 0.8:

            continue

        clean_values = (
            numeric_series.dropna()
        )

        # ==================================
        # MINIMUM VALUES REQUIRED
        # ==================================

        if len(clean_values) < 5:

            continue

        mean = clean_values.mean()

        std = clean_values.std()

        # ==================================
        # ZERO VARIANCE
        # ==================================

        if std == 0:

            variance_issues.append({
                "column": column,
                "issue": "zero_variance"
            })

            continue

        # ==================================
        # OUTLIER DETECTION
        # ==================================

        for idx, value in enumerate(
            numeric_series
        ):

            if pd.isnull(value):

                continue

            total_checks += 1

            # ==============================
            # Z SCORE
            # ==============================

            z_score = abs(
                (value - mean) / std
            )

            # ==============================
            # HIGH VARIANCE VALUE
            # ==============================

            if z_score > 3:

                variance_issues.append({
                    "column": column,
                    "row": idx,
                    "value": float(value),
                    "issue": (
                        "high_variance_outlier"
                    ),
                    "z_score": round(
                        z_score,
                        2
                    )
                })

            else:

                total_valid += 1

    # ======================================
    # NO NUMERIC COLUMNS
    # ======================================

    if total_checks == 0:

        return {
            "status": "SKIPPED"
        }

    # ======================================
    # SCORE CALCULATION
    # ======================================

    valid_percentage = round(
        (
            total_valid /
            total_checks
        ) * 100,
        2
    )

    score = round(
        (
            total_valid /
            total_checks
        ) * 10,
        2
    )

    # ======================================
    # FINAL STATUS
    # ======================================

    status = (
        "PASSED"
        if valid_percentage >= 70
        else "FAILED"
    )

    # ======================================
    # FINAL RESPONSE
    # ======================================

    return {

        "status": status,

        "score": score,

        "max_score": 10,

        "valid_percentage": (
            valid_percentage
        ),

        "variance_issue_count": len(
            variance_issues
        ),

        "variance_issues": (
            variance_issues
        )
    }