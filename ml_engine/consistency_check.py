import pandas as pd
import numpy as np
from typing import Dict, Any

def check_consistency(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs generic cross-column consistency checks on a pandas DataFrame.

    Detects contradictory or logically inconsistent patterns such as duplicate rows
    and inconsistent attribute values for potential key columns.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        Dict[str, Any]: A dictionary containing various consistency metrics and an
                        overall consistency_score (0.0-1.0).
    """
    if df.empty:
        return {
            "metrics": {
                "duplicate_rows_count": 0,
                "duplicate_rows_ratio": 0.0,
                "inconsistent_pseudo_key_attributes_count": 0,
                "pseudo_key_candidate_columns": []
            },
            "consistency_score": 1.0, # An empty DataFrame is considered perfectly consistent
            "summary": "DataFrame is empty, considered perfectly consistent."
        }

    total_rows = len(df)
    total_columns = len(df.columns)
    consistency_score = 1.0
    metrics = {}

    # --- Check 1: Duplicate Rows ---
    duplicate_rows = df.duplicated().sum()
    duplicate_rows_ratio = duplicate_rows / total_rows
    metrics["duplicate_rows_count"] = int(duplicate_rows)
    metrics["duplicate_rows_ratio"] = round(duplicate_rows_ratio, 4)

    # Penalize for duplicate rows
    consistency_score -= duplicate_rows_ratio

    # --- Check 2: Inconsistent Attributes for Pseudo-Keys (Heuristic) ---
    pseudo_key_candidate_columns = []
    inconsistent_attribute_count = 0

    # Heuristic for pseudo-key: column with more than 50% unique values.
    # Exclude columns that are truly boolean or very low cardinality as they are unlikely to be keys.
    for col in df.columns:
        num_unique = df[col].nunique()
        if num_unique / total_rows > 0.5:
            # If numeric, ensure it's not a boolean-like (0/1) column
            if pd.api.types.is_numeric_dtype(df[col]) and num_unique <= 2:
                continue # Likely a flag, not a key
            pseudo_key_candidate_columns.append(col)

    metrics["pseudo_key_candidate_columns"] = pseudo_key_candidate_columns

    if pseudo_key_candidate_columns and total_rows > 1: # Need at least 2 rows to find inconsistencies based on grouping
        for pk_col in pseudo_key_candidate_columns:
            other_cols = [col for col in df.columns if col != pk_col]
            if not other_cols: # If only one column and it's a pseudo-key, no other attributes to check
                continue

            grouped = df.groupby(pk_col)
            for pk_value, group in grouped:
                if len(group) > 1: # Only check if there are multiple rows for this pseudo-key value
                    for attr_col in other_cols:
                        # If an attribute column has more than one unique value within a pseudo-key group
                        # this means different values for the same pseudo-key, hence an inconsistency.
                        # Consider NaNs as distinct values for consistency checking here
                        if group[attr_col].nunique(dropna=False) > 1:
                            inconsistent_attribute_count += 1

    metrics["inconsistent_pseudo_key_attributes_count"] = inconsistent_attribute_count

    # Penalize for inconsistent attributes.
    inconsistent_attributes_penalty = 0.0
    if inconsistent_attribute_count > 0:
        # Scale penalty based on total possible attribute checks.
        # Max possible individual attribute violations: total rows * number of non-pseudo-key columns.
        # Adding 1e-9 to avoid division by zero if total_columns - len(pseudo_key_candidate_columns) is 0.
        max_possible_attribute_violations = total_rows * max(1, total_columns - len(pseudo_key_candidate_columns))
        inconsistent_attributes_penalty = inconsistent_attribute_count / (max_possible_attribute_violations + 1e-9)

        # Apply a weight to this penalty to balance its contribution to the overall score
        consistency_score -= (inconsistent_attributes_penalty * 0.5)

    # Ensure consistency score is within [0.0, 1.0]
    consistency_score = max(0.0, min(1.0, consistency_score))

    summary_message = "Data consistency analysis complete."
    if duplicate_rows > 0:
        summary_message += f" Detected {duplicate_rows} duplicate rows ({duplicate_rows_ratio:.2%})."
    if inconsistent_attribute_count > 0:
        summary_message += f" Found {inconsistent_attribute_count} inconsistent attribute values for pseudo-key columns."
    if consistency_score < 0.5:
        summary_message += " Overall data consistency is low."
    elif consistency_score < 0.8:
        summary_message += " Overall data consistency is moderate."
    else:
        summary_message += " Overall data consistency is good."

    return {
        "metrics": metrics,
        "consistency_score": round(consistency_score, 4),
        "summary": summary_message,
    }
