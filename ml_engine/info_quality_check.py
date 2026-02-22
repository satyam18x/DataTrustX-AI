import pandas as pd
import numpy as np
from scipy.stats import entropy
from typing import Dict, Any

def check_information_quality(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes information quality metrics for a pandas DataFrame, including entropy per column.

    Args:
        df (pd.DataFrame): The input DataFrame.

    Returns:
        Dict[str, Any]: A dictionary containing column-wise metrics and an overall
                        information_quality_score (0.0-1.0).
    """
    if df.empty:
        return {
            "column_metrics": {},
            "information_quality_score": 0.0,
            "summary": {
                "num_low_information_columns": 0,
                "total_columns": 0,
                "reason": "DataFrame is empty."
            }
        }

    column_metrics = {}
    low_information_columns_count = 0
    total_columns = len(df.columns)
    # Max possible entropy for a column with all unique values, used for normalization.
    # If len(df) is 1, log(1) is 0, handled in normalization.
    max_possible_entropy = np.log(len(df)) if len(df) > 1 else 0

    column_scores = [] # Stores normalized entropy for each column

    for col in df.columns:
        col_data = df[col]
        # Drop NaNs for value_counts to get a more accurate distribution of present data
        # If all values are NaN, value_counts will be empty.
        value_counts = col_data.value_counts(normalize=True)

        col_entropy = 0.0
        if not value_counts.empty:
            col_entropy = entropy(value_counts)

        num_unique = col_data.nunique()
        most_frequent_value_percentage = 0.0
        if not value_counts.empty:
            most_frequent_value_percentage = value_counts.max() * 100

        is_low_information = False
        # Heuristic for low information:
        # 1. Only one unique value (constant column)
        # 2. Entropy is very low (close to zero, indicating skewed distribution)
        # 3. One value dominates significantly (e.g., >90% of data)
        if num_unique <= 1 or col_entropy < 0.1 or most_frequent_value_percentage > 90:
            is_low_information = True
            low_information_columns_count += 1

        # Normalize column entropy by the maximum possible entropy for a column of this length.
        # If max_possible_entropy is 0 (e.g., df has only 1 row), normalized_col_entropy is also 0.
        normalized_col_entropy = col_entropy / max_possible_entropy if max_possible_entropy > 0 else 0.0
        column_scores.append(normalized_col_entropy)

        column_metrics[col] = {
            "entropy": round(col_entropy, 4),
            "normalized_entropy": round(normalized_col_entropy, 4),
            "unique_values": num_unique,
            "most_frequent_value_percentage": round(most_frequent_value_percentage, 2),
            "is_low_information": is_low_information,
            "data_type": str(col_data.dtype)
        }

    # Calculate overall information quality score as the average of normalized column entropies.
    # Score ranges from 0.0 to 1.0.
    if column_scores:
        information_quality_score = np.mean(column_scores)
    else:
        information_quality_score = 0.0 # No columns in the DataFrame or empty DataFrame

    # Apply a penalty based on the proportion of low-information columns.
    # This helps in cases where average entropy might be high due to a few very good columns,
    # but many others are still low-information.
    if total_columns > 0:
        # Example: if half columns are low-info, apply a 25% reduction (0.5 * 0.5)
        low_info_penalty_factor = (low_information_columns_count / total_columns) * 0.5
        information_quality_score = max(0.0, information_quality_score - low_info_penalty_factor)
        # Ensure score doesn't go below 0 due to penalty

    return {
        "column_metrics": column_metrics,
        "information_quality_score": round(information_quality_score, 4),
        "summary": {
            "num_low_information_columns": low_information_columns_count,
            "total_columns": total_columns,
            "overall_average_entropy": round(np.mean([m['entropy'] for m in column_metrics.values()]) if column_metrics else 0.0, 4)
        }
    }
