
from typing import Dict, Any


def fuse_scores(validation_reports: Dict[str, Dict[str, Any]],
                weights: Dict[str, float] | None = None) -> Dict[str, Any]:
    """
    Correctly fuses individual module scores into a single Trust Score (0–100).
    """

    score_key_map = {
        "structural_report": ["structural_score"],
        "statistical_report": ["statistical_score"],
        "semantic_report": ["semantic_score"],
        "generative_report": ["generative_score"],
        "information_quality_report": ["information_quality_score"],
        "consistency_report": ["consistency_score"],
        "temporal_report": ["temporal_score"],
        "drift_bias_report": ["drift_score", "bias_score"],
    }

    score_breakdown = {}
    weighted_sum = 0.0
    total_weight = 0.0

    if weights is None:
        weights = {k: 1.0 for k in score_key_map.keys()}

    for report_name, score_keys in score_key_map.items():
        report = validation_reports.get(report_name, {})

        for score_key in score_keys:
            score_value = report.get(score_key)
            breakdown_key = f"{report_name.replace('_report', '')}_{score_key}"

            if isinstance(score_value, (int, float)):
                weight = weights.get(report_name, 1.0)
                weighted_sum += float(score_value) * weight
                total_weight += weight
                score_breakdown[breakdown_key] = round(float(score_value), 4)
            else:
                score_breakdown[breakdown_key] = None

    final_trust_score = 0.0 if total_weight == 0 else round((weighted_sum / total_weight) * 100, 2)

    if final_trust_score >= 80:
        summary = "Overall data trust is High."
    elif final_trust_score >= 50:
        summary = "Overall data trust is Moderate."
    else:
        summary = "Overall data trust is Low."

    return {
        "final_trust_score": final_trust_score,
        "score_breakdown": score_breakdown,
        "summary": summary
    }
