import pandas as pd
import numpy as np
from scipy.stats import ks_2samp
from typing import Dict, Any, Optional

def check_drift_and_bias(df: pd.DataFrame, reference_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
    """
    Performs data drift and bias checks on a pandas DataFrame.

    Detects numeric data drift using the KS-test and categorical bias (imbalance/dominance).

    Args:
        df (pd.DataFrame): The current DataFrame to check.
        reference_df (Optional[pd.DataFrame]): An optional reference DataFrame for drift detection.

    Returns:
        Dict[str, Any]: A dictionary containing drift and bias metrics and overall scores.
    """
    metrics = {
        "drift_detected": False,
        "numeric_drift": {},
        "categorical_bias": {},
        "drift_score": 1.0,
        "bias_score": 1.0,
        "summary": ""
    }
    summary_messages = []

    if df.empty:
        metrics["summary"] = "DataFrame is empty, no drift or bias checks performed."
        return metrics

    total_columns = len(df.columns)

    # --- Drift Detection (Numeric Columns) ---
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    if reference_df is not None and not reference_df.empty and numeric_cols:
        num_drift_count = 0
        for col in numeric_cols:
            if col in reference_df.columns and pd.api.types.is_numeric_dtype(reference_df[col]):
                # Drop NaNs for KS test
                data1 = df[col].dropna()
                data2 = reference_df[col].dropna()

                if len(data1) > 1 and len(data2) > 1:
                    try:
                        # Kolmogorov-Smirnov test for distribution difference
                        statistic, p_value = ks_2samp(data1, data2)
                        # A common alpha level for significance is 0.05
                        is_drift = p_value < 0.05
                        if is_drift:
                            num_drift_count += 1

                        metrics["numeric_drift"][col] = {
                            "ks_statistic": round(statistic, 4),
                            "p_value": round(p_value, 4),
                            "drift_detected": is_drift
                        }
                    except ValueError as e:
                        metrics["numeric_drift"][col] = {"error": str(e), "drift_detected": False}
                else:
                    metrics["numeric_drift"][col] = {"warning": "Not enough data for KS test", "drift_detected": False}
            else:
                metrics["numeric_drift"][col] = {"warning": "Column not found or not numeric in reference_df", "drift_detected": False}

        if num_drift_count > 0:
            metrics["drift_detected"] = True
            # Penalize drift score based on proportion of drifting numeric columns
            metrics["drift_score"] -= (num_drift_count / len(numeric_cols)) * 0.5
            summary_messages.append(f"Detected drift in {num_drift_count} numeric columns.")

    elif reference_df is None:
        metrics["summary"] += "No reference DataFrame provided for drift detection. "
    elif reference_df.empty:
        metrics["summary"] += "Reference DataFrame is empty, no drift detection performed. "

    # --- Bias Detection (Categorical Columns) ---
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()
    if categorical_cols:
        imbalanced_cols_count = 0
        for col in categorical_cols:
            value_counts = df[col].value_counts(normalize=True)
            if not value_counts.empty:
                # Dominance: if one category accounts for > 90%
                most_frequent_percentage = value_counts.max()
                is_dominant = most_frequent_percentage > 0.90

                # Imbalance: if the ratio of most common to least common is very high (e.g., > 10:1)
                # Avoid division by zero if there's only one unique value or very few values
                min_percentage = value_counts.min()
                is_imbalanced = False
                if min_percentage > 0 and most_frequent_percentage / min_percentage > 10: # Heuristic
                    is_imbalanced = True

                if is_dominant or is_imbalanced:
                    imbalanced_cols_count += 1

                metrics["categorical_bias"][col] = {
                    "most_frequent_value_percentage": round(most_frequent_percentage * 100, 2),
                    "is_dominant": is_dominant,
                    "is_imbalanced": is_imbalanced
                }
        if imbalanced_cols_count > 0:
            # Penalize bias score based on proportion of imbalanced categorical columns
            metrics["bias_score"] -= (imbalanced_cols_count / len(categorical_cols)) * 0.5
            summary_messages.append(f"Detected bias/imbalance in {imbalanced_cols_count} categorical columns.")

    # Ensure scores are within [0.0, 1.0]
    metrics["drift_score"] = max(0.0, min(1.0, metrics["drift_score"]))
    metrics["bias_score"] = max(0.0, min(1.0, metrics["bias_score"]))

    final_summary_message = "Data drift and bias analysis complete." if not summary_messages else " ".join(summary_messages)
    if metrics["drift_score"] < 0.5 or metrics["bias_score"] < 0.5:
        final_summary_message += " Overall data quality (drift/bias) is low."
    elif metrics["drift_score"] < 0.8 or metrics["bias_score"] < 0.8:
        final_summary_message += " Overall data quality (drift/bias) is moderate."
    else:
        final_summary_message += " Overall data quality (drift/bias) is good."
    metrics["summary"] = final_summary_message

    return metrics
