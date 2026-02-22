import pandas as pd
import numpy as np
from typing import Dict, Any

def check_structural_integrity(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs structural integrity checks on a pandas DataFrame.

    Detects issues like empty datasets, duplicate rows, missing values,
    invalid column names, and datatype inconsistencies.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        Dict[str, Any]: A dictionary containing various structural metrics and an
                        overall structural_score (0.0-1.0).
    """
    structural_score = 1.0
    metrics = {}
    summary_messages = []

    # 1. Detect empty or unreadable datasets (represented by an empty DataFrame)
    if df.empty:
        return {
            "metrics": {
                "is_empty": True,
                "duplicate_rows_count": 0,
                "duplicate_rows_ratio": 0.0,
                "missing_values_ratio": 0.0,
                "invalid_column_names_count": 0,
                "column_name_duplicates": [],
                "inconsistent_datatypes_columns": []
            },
            "structural_score": 0.0,
            "summary": "DataFrame is empty, structural integrity score is 0.0."
        }
    metrics["is_empty"] = False

    total_rows = len(df)
    total_columns = len(df.columns)

    # 2. Detect duplicate rows and compute duplicate ratio
    duplicate_rows = df.duplicated().sum()
    duplicate_rows_ratio = duplicate_rows / total_rows if total_rows > 0 else 0.0
    metrics["duplicate_rows_count"] = int(duplicate_rows)
    metrics["duplicate_rows_ratio"] = round(duplicate_rows_ratio, 4)
    if duplicate_rows > 0:
        structural_score -= duplicate_rows_ratio * 0.4 # Significant penalty
        summary_messages.append(f"Detected {duplicate_rows} duplicate rows ({duplicate_rows_ratio:.2%}).")

    # 3. Compute missing value ratio
    total_missing = df.isnull().sum().sum()
    total_cells = total_rows * total_columns
    missing_values_ratio = total_missing / total_cells if total_cells > 0 else 0.0
    metrics["missing_values_ratio"] = round(missing_values_ratio, 4)
    if missing_values_ratio > 0:
        structural_score -= missing_values_ratio * 0.3 # Moderate penalty
        summary_messages.append(f"Detected {total_missing} missing values ({missing_values_ratio:.2%}).")

    # 4. Validate column names (non-empty, unique)
    invalid_column_names_count = 0
    column_name_duplicates = []
    unique_column_names = set()
    for col in df.columns:
        if not isinstance(col, str) or not col.strip():
            invalid_column_names_count += 1
        if col in unique_column_names:
            column_name_duplicates.append(col)
        else:
            unique_column_names.add(col)
    metrics["invalid_column_names_count"] = invalid_column_names_count
    metrics["column_name_duplicates"] = list(set(column_name_duplicates)) # Ensure unique duplicates list

    if invalid_column_names_count > 0:
        structural_score -= (invalid_column_names_count / total_columns) * 0.2 # Penalty for invalid names
        summary_messages.append(f"Found {invalid_column_names_count} invalid (empty or non-string) column names.")
    if len(column_name_duplicates) > 0:
        structural_score -= (len(column_name_duplicates) / total_columns) * 0.2 # Penalty for duplicate names
        summary_messages.append(f"Found duplicate column names: {', '.join(list(set(column_name_duplicates)))}.")

    # 5. Detect datatype inconsistencies (mixed types within a column)
    inconsistent_datatypes_columns = []
    for col in df.columns:
        # Exclude purely numeric columns, as mixed types often manifest as objects.
        # Pandas automatically handles mixed types by inferring 'object' dtype.
        # We specifically look for object columns that contain non-numeric types when numeric types are also present.
        if df[col].dtype == 'object':
            # Check if column contains both numeric and non-numeric values (excluding NaN)
            is_numeric = pd.to_numeric(df[col], errors='coerce').notna()
            is_non_numeric = df[col].apply(lambda x: not pd.isna(x) and not isinstance(x, (int, float, np.number)))

            if is_numeric.any() and is_non_numeric.any():
                inconsistent_datatypes_columns.append(col)
    metrics["inconsistent_datatypes_columns"] = inconsistent_datatypes_columns

    if len(inconsistent_datatypes_columns) > 0:
        structural_score -= (len(inconsistent_datatypes_columns) / total_columns) * 0.3 # Moderate penalty
        summary_messages.append(f"Found datatype inconsistencies in columns: {', '.join(inconsistent_datatypes_columns)}.")

    # Ensure score is within [0.0, 1.0]
    structural_score = max(0.0, min(1.0, structural_score))

    final_summary = "Structural integrity analysis complete." if not summary_messages else " ".join(summary_messages)
    if structural_score < 0.5:
        final_summary += " Overall structural integrity is low."
    elif structural_score < 0.8:
        final_summary += " Overall structural integrity is moderate."
    else:
        final_summary += " Overall structural integrity is good."

    return {
        "metrics": metrics,
        "structural_score": round(structural_score, 4),
        "summary": final_summary,
    }
