import pandas as pd
import numpy as np
from typing import Dict, Any

def check_temporal_consistency(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs temporal consistency checks on a pandas DataFrame.

    Automatically detects timestamp/datetime columns, checks for missing timestamps,
    non-monotonic sequences, and irregular time gaps.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        Dict[str, Any]: A dictionary containing various temporal metrics and an
                        overall temporal_score (0.0-1.0).
    """
    if df.empty:
        return {
            "metrics": {
                "datetime_columns_found": [],
                "missing_timestamps_count": 0,
                "non_monotonic_sequences_count": 0,
                "irregular_gap_columns_count": 0,
            },
            "temporal_score": 1.0,
            "summary": "DataFrame is empty, considered perfectly temporally consistent."
        }

    total_rows = len(df)
    temporal_score = 1.0
    metrics = {
        "datetime_columns_found": [],
        "missing_timestamps_count": 0,
        "non_monotonic_sequences_count": 0,
        "irregular_gap_columns_count": 0,
    }

    datetime_cols = [col for col in df.columns if pd.api.types.is_datetime64_any_dtype(df[col])]
    metrics["datetime_columns_found"] = datetime_cols

    if not datetime_cols:
        return {
            "metrics": metrics,
            "temporal_score": 1.0,
            "summary": "No datetime columns found, considered perfectly temporally consistent."
        }

    for col in datetime_cols:
        col_data = df[col]

        # 1. Missing timestamps
        missing_count = col_data.isnull().sum()
        metrics["missing_timestamps_count"] += missing_count
        if missing_count > 0:
            temporal_score -= (missing_count / total_rows) * 0.3 # Penalize for missing timestamps

        # Filter out NaNs for sequence and gap checks to avoid errors
        clean_data = col_data.dropna()
        if len(clean_data) < 2: # Need at least two non-null values to check monotonicity and gaps
            continue

        # 2. Non-monotonic sequences
        # Check if it's increasing or decreasing. If neither, it's non-monotonic.
        if not (clean_data.is_monotonic_increasing or clean_data.is_monotonic_decreasing):
            metrics["non_monotonic_sequences_count"] += 1
            temporal_score -= 0.2 # Fixed penalty for a non-monotonic column

        # 3. Irregular time gaps (basic check)
        # Calculate differences and check variance. High variance means irregular gaps.
        # This is a heuristic and might need tuning.
        time_diffs = clean_data.sort_values().diff().dropna()
        if not time_diffs.empty:
            # We convert timedelta to total seconds for variance calculation
            diff_seconds = time_diffs.dt.total_seconds()
            # Only penalize if mean is positive to avoid issues with zero/negative differences for certain cases
            if diff_seconds.mean() > 0 and diff_seconds.std() > diff_seconds.mean() * 0.5:
                # If std dev is more than 50% of the mean, consider it irregular
                metrics["irregular_gap_columns_count"] += 1
                temporal_score -= 0.1 # Fixed penalty for irregular gaps

    # Ensure score is within [0.0, 1.0]
    temporal_score = max(0.0, min(1.0, temporal_score))

    summary_message = "Temporal consistency analysis complete."
    if metrics["missing_timestamps_count"] > 0:
        summary_message += f" Detected {metrics['missing_timestamps_count']} missing timestamps."
    if metrics["non_monotonic_sequences_count"] > 0:
        summary_message += f" Found {metrics['non_monotonic_sequences_count']} non-monotonic datetime columns."
    if metrics["irregular_gap_columns_count"] > 0:
        summary_message += f" Found {metrics['irregular_gap_columns_count']} datetime columns with irregular gaps."
    if temporal_score < 0.5:
        summary_message += " Overall temporal consistency is low."
    elif temporal_score < 0.8:
        summary_message += " Overall temporal consistency is moderate."
    else:
        summary_message += " Overall temporal consistency is good."

    return {
        "metrics": metrics,
        "temporal_score": round(temporal_score, 4),
        "summary": summary_message,
    }
