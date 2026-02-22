import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from typing import Dict, Any, List

def check_semantic_properties(df: pd.DataFrame, sample_size: int = 1000) -> Dict[str, Any]:
    """
    Performs semantic checks on a pandas DataFrame by analyzing text columns.

    Automatically detects text columns, generates embeddings, computes semantic coherence,
    and detects incoherent or meaningless text patterns.

    Args:
        df (pd.DataFrame): The input DataFrame.
        sample_size (int): The number of rows to sample for embedding and similarity computation
                           to handle large datasets efficiently.

    Returns:
        Dict[str, Any]: A dictionary containing various semantic metrics and an
                        overall semantic_score (0.0-1.0).
    """
    semantic_score = 1.0
    metrics = {
        "text_columns_found": [],
        "avg_pairwise_cosine_similarity": 0.0,
        "low_coherence_texts_count": 0,
        "total_text_rows_analyzed": 0
    }
    summary_messages = []

    if df.empty:
        return {
            "metrics": metrics,
            "semantic_score": 1.0,
            "summary": "DataFrame is empty, considered perfectly semantically sound."
        }

    # Identify text (object/string) columns
    text_cols = [col for col in df.columns if df[col].dtype == 'object' and df[col].apply(lambda x: isinstance(x, str)).any()]
    metrics["text_columns_found"] = text_cols

    if not text_cols:
        return {
            "metrics": metrics,
            "semantic_score": 1.0,
            "summary": "No text columns found, considered perfectly semantically sound."
        }

    # Combine text columns into a single string per row, handling NaNs
    # Filter out rows where all text columns are NaN
    combined_texts = df[text_cols].astype(str).agg(' '.join, axis=1)
    combined_texts = combined_texts[combined_texts.str.strip() != 'nan' * len(text_cols)] # Remove rows with only 'nan's

    if combined_texts.empty:
        return {
            "metrics": metrics,
            "semantic_score": 1.0,
            "summary": "Text columns found but no valid text data for analysis."
        }

    # Sample data for efficiency
    if len(combined_texts) > sample_size:
        combined_texts_sample = combined_texts.sample(n=sample_size, random_state=42)
    else:
        combined_texts_sample = combined_texts

    metrics["total_text_rows_analyzed"] = len(combined_texts_sample)

    if len(combined_texts_sample) < 2: # Need at least two texts to compare for coherence
        return {
            "metrics": metrics,
            "semantic_score": 1.0,
            "summary": "Not enough text data to perform semantic coherence checks (less than 2 samples)."
        }

    try:
        # Load a pre-trained Sentence-Transformer model
        # Using a small, fast model for general purpose
        model = SentenceTransformer('all-MiniLM-L6-v2')

        # Generate embeddings
        embeddings = model.encode(combined_texts_sample.tolist(), show_progress_bar=False)

        # Compute pairwise cosine similarity
        # This can be computationally intensive for large samples, consider alternative if needed
        cosine_scores = cosine_similarity(embeddings)

        # Exclude self-similarity (diagonal) and duplicate pairs (upper/lower triangle)
        # Average non-self-similarity scores
        np.fill_diagonal(cosine_scores, np.nan) # Set diagonal to NaN
        avg_pairwise_similarity = np.nanmean(cosine_scores) # Compute mean, ignoring NaNs

        metrics["avg_pairwise_cosine_similarity"] = round(avg_pairwise_similarity, 4)

        # Detect low coherence texts (heuristic: similarity below a certain threshold to all other texts)
        # For simplicity, we'll check if a text's average similarity to others is very low
        # This is a basic heuristic and can be improved.
        individual_avg_similarities = np.nanmean(cosine_scores, axis=1)
        low_coherence_threshold = 0.2 # Example threshold
        low_coherence_texts_count = (individual_avg_similarities < low_coherence_threshold).sum()
        metrics["low_coherence_texts_count"] = int(low_coherence_texts_count)

        # Penalize for low semantic coherence
        # The semantic score is proportional to the average similarity, and inversely proportional to low coherence texts
        semantic_score = avg_pairwise_similarity
        if low_coherence_texts_count > 0:
            semantic_score -= (low_coherence_texts_count / len(combined_texts_sample)) * 0.5
            summary_messages.append(f"Detected {low_coherence_texts_count} texts with low semantic coherence.")

    except Exception as e:
        summary_messages.append(f"Warning: Semantic analysis failed: {e}. Skipping semantic scoring.")
        semantic_score = 0.5 # Default to moderate score if analysis fails

    # Ensure score is within [0.0, 1.0]
    semantic_score = max(0.0, min(1.0, semantic_score))

    final_summary = "Semantic properties analysis complete." if not summary_messages else " ".join(summary_messages)
    if semantic_score < 0.5:
        final_summary += " Overall semantic quality is low."
    elif semantic_score < 0.8:
        final_summary += " Overall semantic quality is moderate."
    else:
        final_summary += " Overall semantic quality is good."

    return {
        "metrics": metrics,
        "semantic_score": round(semantic_score, 4),
        "summary": final_summary,
    }
