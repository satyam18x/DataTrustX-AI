import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
from typing import Dict, Any

def check_statistical_properties(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Performs statistical checks on a pandas DataFrame, including outlier detection
    and detection of zero-variance numeric columns.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        Dict[str, Any]: A dictionary containing various statistical metrics and an
                        overall statistical_score (0.0-1.0).
    """
    if df.empty:
        return {
            "metrics": {
                "numeric_columns_found": [],
                "outlier_ratio_isolation_forest": 0.0,
                "outlier_ratio_lof": 0.0,
                "zero_variance_columns": [],
                "num_zero_variance_columns": 0
            },
            "statistical_score": 1.0,
            "summary": "DataFrame is empty, considered perfectly statistically sound."
        }

    statistical_score = 1.0
    metrics = {
        "numeric_columns_found": [],
        "outlier_ratio_isolation_forest": 0.0,
        "outlier_ratio_lof": 0.0,
        "zero_variance_columns": [],
        "num_zero_variance_columns": 0
    }
    summary_messages = []

    # Identify numeric columns
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    metrics["numeric_columns_found"] = numeric_cols

    if not numeric_cols:
        return {
            "metrics": metrics,
            "statistical_score": 1.0,
            "summary": "No numeric columns found, considered perfectly statistically sound."
        }

    numeric_df = df[numeric_cols].copy()

    # 1. Detect zero-variance numeric columns
    for col in numeric_cols:
        # Drop NaNs before checking variance to avoid issues with all-NaN columns reporting 0 variance
        if numeric_df[col].dropna().nunique() <= 1: # nunique() <= 1 covers zero-variance and constant columns
            metrics["zero_variance_columns"].append(col)
            metrics["num_zero_variance_columns"] += 1

    if metrics["num_zero_variance_columns"] > 0:
        # Penalize for zero-variance columns. Higher penalty if many columns are constant.
        statistical_score -= (metrics["num_zero_variance_columns"] / len(numeric_cols)) * 0.2
        summary_messages.append(f"Detected {metrics['num_zero_variance_columns']} zero-variance columns: {', '.join(metrics['zero_variance_columns'])}.")

    # Handle missing values for outlier detection (Impute with mean for simplicity)
    # We only impute for outlier detection, not modifying the original df for other checks
    numeric_df_imputed = numeric_df.fillna(numeric_df.mean())

    # Only proceed with outlier detection if there's enough data and features
    if len(numeric_df_imputed) > 1 and len(numeric_cols) > 0:
        # 2. Outlier detection using Isolation Forest
        try:
            iso_forest = IsolationForest(random_state=42)
            iso_preds = iso_forest.fit_predict(numeric_df_imputed)
            # -1 are outliers, 1 are inliers
            outliers_iso_forest = (iso_preds == -1).sum()
            outlier_ratio_iso_forest = outliers_iso_forest / len(numeric_df_imputed)
            metrics["outlier_ratio_isolation_forest"] = round(outlier_ratio_iso_forest, 4)
            if outlier_ratio_iso_forest > 0.05: # Threshold for penalty
                statistical_score -= outlier_ratio_iso_forest * 0.4 # Moderate to high penalty
                summary_messages.append(f"Isolation Forest detected {outliers_iso_forest} outliers ({outlier_ratio_iso_forest:.2%}).")
        except Exception as e:
            summary_messages.append(f"Warning: Isolation Forest failed: {e}")

        # 3. Outlier detection using Local Outlier Factor (LOF)
        # LOF is sensitive to number of neighbors, default is 20
        try:
            # n_neighbors must be less than or equal to the number of samples
            n_neighbors_lof = min(20, len(numeric_df_imputed) - 1)
            if n_neighbors_lof > 1: # Need at least 2 neighbors for LOF
                lof = LocalOutlierFactor(n_neighbors=n_neighbors_lof)
                lof_preds = lof.fit_predict(numeric_df_imputed)
                # -1 are outliers, 1 are inliers
                outliers_lof = (lof_preds == -1).sum()
                outlier_ratio_lof = outliers_lof / len(numeric_df_imputed)
                metrics["outlier_ratio_lof"] = round(outlier_ratio_lof, 4)
                if outlier_ratio_lof > 0.05: # Threshold for penalty
                    statistical_score -= outlier_ratio_lof * 0.3 # Moderate penalty
                    summary_messages.append(f"Local Outlier Factor detected {outliers_lof} outliers ({outlier_ratio_lof:.2%}).")
            else:
                summary_messages.append("Not enough samples for Local Outlier Factor (LOF) analysis.")
        except Exception as e:
            summary_messages.append(f"Warning: Local Outlier Factor failed: {e}")

    # Ensure score is within [0.0, 1.0]
    statistical_score = max(0.0, min(1.0, statistical_score))

    final_summary = "Statistical properties analysis complete." if not summary_messages else " ".join(summary_messages)
    if statistical_score < 0.5:
        final_summary += " Overall statistical quality is low."
    elif statistical_score < 0.8:
        final_summary += " Overall statistical quality is moderate."
    else:
        final_summary += " Overall statistical quality is good."

    return {
        "metrics": metrics,
        "statistical_score": round(statistical_score, 4),
        "summary": final_summary,
    }
