import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader, TensorDataset
from typing import Dict, Any

# Define the Autoencoder model
class Autoencoder(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(Autoencoder, self).__init__()
        # Encoder
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, input_dim // 2),
            nn.ReLU(),
            nn.Linear(input_dim // 2, latent_dim),
            nn.ReLU()
        )
        # Decoder
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, input_dim // 2),
            nn.ReLU(),
            nn.Linear(input_dim // 2, input_dim)
        )

    def forward(self, x):
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

def check_generative_properties(df: pd.DataFrame, epochs: int = 5, batch_size: int = 32) -> Dict[str, Any]:
    """
    Performs generative checks on a pandas DataFrame using a lightweight Autoencoder.

    Detects numeric columns, trains an Autoencoder, computes reconstruction error,
    and converts it into a generative realism score (0.0-1.0).

    Args:
        df (pd.DataFrame): The input DataFrame.
        epochs (int): Number of epochs to train the autoencoder (kept small for performance).
        batch_size (int): Batch size for training the autoencoder.

    Returns:
        Dict[str, Any]: A dictionary containing various generative metrics and an
                        overall generative_score (0.0-1.0).
    """
    generative_score = 1.0
    metrics = {
        "numeric_columns_found": [],
        "reconstruction_error": 0.0,
        "autoencoder_trained": False,
        "reason": ""
    }
    summary_messages = []

    if df.empty:
        metrics["reason"] = "DataFrame is empty."
        return {
            "metrics": metrics,
            "generative_score": 1.0, # Empty dataframe is "generatively sound" by default
            "summary": "DataFrame is empty, considered perfectly generatively sound."
        }

    # Identify numeric columns
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    metrics["numeric_columns_found"] = numeric_cols

    if not numeric_cols:
        metrics["reason"] = "No numeric columns found."
        return {
            "metrics": metrics,
            "generative_score": 1.0,
            "summary": "No numeric columns found, considered perfectly generatively sound."
        }

    numeric_df = df[numeric_cols].copy()

    # Handle missing values (mean imputation)
    numeric_df_imputed = numeric_df.fillna(numeric_df.mean())

    # Check if enough samples for Autoencoder training
    min_samples_for_ae = 2 * len(numeric_cols) # Heuristic: at least twice the number of features
    if len(numeric_df_imputed) < min_samples_for_ae or len(numeric_cols) == 0:
        metrics["reason"] = f"Not enough samples ({len(numeric_df_imputed)}) or features ({len(numeric_cols)}) for Autoencoder training (minimum {min_samples_for_ae} samples required)."
        summary_messages.append(metrics["reason"])
        return {
            "metrics": metrics,
            "generative_score": 1.0, # Cannot assess, so default to sound
            "summary": "Insufficient data for generative model analysis."
        }

    # Check for all constant columns, which can cause issues with scaling and AE training
    if numeric_df_imputed.nunique().sum() == 0 or (numeric_df_imputed.std() == 0).all():
         metrics["reason"] = "All numeric columns have zero variance, skipping Autoencoder training."
         summary_messages.append(metrics["reason"])
         return {
            "metrics": metrics,
            "generative_score": 1.0, # Cannot assess, so default to sound
            "summary": "All numeric columns are constant, considered perfectly generatively sound."
         }

    # Scale the data
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(numeric_df_imputed)

    # Convert to PyTorch tensors
    X = torch.tensor(scaled_data, dtype=torch.float32)

    # Prepare DataLoader
    dataset = TensorDataset(X)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    input_dim = X.shape[1]
    latent_dim = max(2, input_dim // 4) # Heuristic for latent dimension, ensure at least 2

    model = Autoencoder(input_dim, latent_dim)
    criterion = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    # Train the Autoencoder
    try:
        for epoch in range(epochs):
            for data in dataloader:
                inputs = data[0]
                outputs = model(inputs)
                loss = criterion(outputs, inputs)

                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
        metrics["autoencoder_trained"] = True
    except Exception as e:
        metrics["reason"] = f"Error during Autoencoder training: {e}"
        summary_messages.append(metrics["reason"])
        return {
            "metrics": metrics,
            "generative_score": 0.5, # Default to moderate if training fails
            "summary": "Generative analysis failed due to training error."
        }


    # Compute reconstruction error
    model.eval() # Set model to evaluation mode
    with torch.no_grad():
        reconstructed_data = model(X)
        reconstruction_error = criterion(reconstructed_data, X).item() # .item() to get scalar
    metrics["reconstruction_error"] = round(reconstruction_error, 4)

    # Convert reconstruction error to generative realism score
    # A low reconstruction error implies high generative realism.
    # For StandardScaler output, MSE of 1 would roughly indicate the model is outputting noise similar to input variance.
    # A score of 1.0 for perfect reconstruction (error 0) and 0.0 for very poor (error >= 1.0, for scaled data)
    max_plausible_error_for_score = 1.0 # This threshold implies that an MSE of 1 on scaled data is considered 'worst'
    generative_score = max(0.0, 1.0 - (reconstruction_error / max_plausible_error_for_score))

    # Ensure score is within [0.0, 1.0]
    generative_score = max(0.0, min(1.0, generative_score))

    final_summary = "Generative properties analysis complete." if not summary_messages else " ".join(summary_messages)
    if generative_score < 0.5:
        final_summary += " Overall generative realism is low."
    elif generative_score < 0.8:
        final_summary += " Overall generative realism is moderate."
    else:
        final_summary += " Overall generative realism is good."

    return {
        "metrics": metrics,
        "generative_score": round(generative_score, 4),
        "summary": final_summary,
    }
