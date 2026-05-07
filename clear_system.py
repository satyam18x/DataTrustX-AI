from app.core.database import engine, SessionLocal
from app.models import user, validation, request, offer, deal, escrow, dispute
import os
import shutil

def clear_data():
    # Clear tables
    models = [user, validation, request, offer, deal, escrow, dispute]
    for model in models:
        try:
            model.Base.metadata.drop_all(bind=engine)
            model.Base.metadata.create_all(bind=engine)
            print(f"Cleared tables for {model.__name__}")
        except Exception as e:
            print(f"Error clearing {model.__name__}: {e}")

    # Clear uploads
    uploads_dir = 'uploads'
    if os.path.exists(uploads_dir):
        for filename in os.listdir(uploads_dir):
            file_path = os.path.join(uploads_dir, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                print(f"Deleted {file_path}")
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')

if __name__ == "__main__":
    clear_data()
