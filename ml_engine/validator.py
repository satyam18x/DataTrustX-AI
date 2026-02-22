import pandas as pd
import numpy as np
from typing import Dict, Any, Optional

from ml_engine import (
    info_quality_check,
    consistency_check,
    temporal_check,
    structural_check,
    statistical_check,
    semantic_check,
    generative_check,
    drift_bias_check,
    score_fusion
)


def make_json_safe(obj: Any) -> Any:
    """
    Recursively convert ALL non-JSON-safe objects
    (NumPy, sklearn, torch outputs) into native Python types.
    This function is intentionally defensive.
    """
    # Dict
    if isinstance(obj, dict):
        return {str(k): make_json_safe(v) for k, v in obj.items()}

    # List / Tuple / Set
    if isinstance(obj, (list, tuple, set)):
        return [make_json_safe(v) for v in obj]

    # NumPy arrays
    if isinstance(obj, np.ndarray):
        return obj.tolist()

    # NumPy scalar types (VERY IMPORTANT)
    if isinstance(obj, np.generic):
        return obj.item()

    # Pandas NA / NaT
    if obj is pd.NA:
        return None

    # Everything else (int, float, str, bool, None)
    return obj


def run_validation_df(df: pd.DataFrame, reference_df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
    validation_reports: Dict[str, Dict[str, Any]] = {}

    final_result = {
        "status": "FAIL",
        "reason": "Validation process did not complete successfully.",
        "final_trust_score": 0.0,
        "score_breakdown": {},
        "all_reports": {}
    }

    # Run validation modules
    validation_reports["information_quality_report"] = info_quality_check.check_information_quality(df)
    validation_reports["consistency_report"] = consistency_check.check_consistency(df)
    validation_reports["temporal_report"] = temporal_check.check_temporal_consistency(df)
    validation_reports["structural_report"] = structural_check.check_structural_integrity(df)
    validation_reports["statistical_report"] = statistical_check.check_statistical_properties(df)
    validation_reports["semantic_report"] = semantic_check.check_semantic_properties(df)
    validation_reports["generative_report"] = generative_check.check_generative_properties(df)
    validation_reports["drift_bias_report"] = drift_bias_check.check_drift_and_bias(df, reference_df)

    fused = score_fusion.fuse_scores(validation_reports)
    final_trust_score = fused.get("final_trust_score", 0.0)

    final_result["final_trust_score"] = float(final_trust_score)
    final_result["score_breakdown"] = fused.get("score_breakdown", {})

    threshold = 70.0
    if final_trust_score >= threshold:
        final_result["status"] = "PASS"
        final_result["reason"] = "Data quality meets the required trust threshold."
    else:
        final_result["status"] = "FAIL"
        final_result["reason"] = "Data quality does not meet the required trust threshold."

    final_result["all_reports"] = validation_reports

    return make_json_safe(final_result)


def run_validation(csv_path: str, reference_path: Optional[str] = None) -> Dict[str, Any]:
    validation_reports: Dict[str, Dict[str, Any]] = {}

    final_result = {
        "status": "FAIL",
        "reason": "Validation process did not complete successfully.",
        "final_trust_score": 0.0,
        "score_breakdown": {},
        "all_reports": {}
    }

    # Load primary dataset
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        final_result["reason"] = f"Error loading CSV: {e}"
        return final_result

    # Load reference dataset (optional)
    reference_df = None
    if reference_path:
        try:
            reference_df = pd.read_csv(reference_path)
        except Exception:
            reference_df = None

    # Run validation modules
    validation_reports["information_quality_report"] = info_quality_check.check_information_quality(df)
    validation_reports["consistency_report"] = consistency_check.check_consistency(df)
    validation_reports["temporal_report"] = temporal_check.check_temporal_consistency(df)
    validation_reports["structural_report"] = structural_check.check_structural_integrity(df)
    validation_reports["statistical_report"] = statistical_check.check_statistical_properties(df)
    validation_reports["semantic_report"] = semantic_check.check_semantic_properties(df)
    validation_reports["generative_report"] = generative_check.check_generative_properties(df)
    validation_reports["drift_bias_report"] = drift_bias_check.check_drift_and_bias(df, reference_df)

    # Fuse scores
    fused = score_fusion.fuse_scores(validation_reports)
    final_trust_score = fused.get("final_trust_score", 0.0)

    final_result["final_trust_score"] = float(final_trust_score)
    final_result["score_breakdown"] = fused.get("score_breakdown", {})

    # PASS / FAIL decision
    threshold = 70.0
    if final_trust_score >= threshold:
        final_result["status"] = "PASS"
        final_result["reason"] = "Data quality meets the required trust threshold."
    else:
        final_result["status"] = "FAIL"
        final_result["reason"] = "Data quality does not meet the required trust threshold."

    final_result["all_reports"] = validation_reports

    # 🔐 FINAL GUARANTEE: JSON-safe output
    return make_json_safe(final_result)
