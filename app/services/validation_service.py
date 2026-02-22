from io import StringIO
import pandas as pd

from ml_engine.validator import run_validation_df



def validate_csv_bytes(file_bytes: bytes):
    csv_str = file_bytes.decode("utf-8")
    df = pd.read_csv(StringIO(csv_str))

    return run_validation_df(df)
