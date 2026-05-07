import sys
import os
import json

# Add root directory to path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.validation import ValidationResult
from app.models.deal import Deal
from ml_engine import validator

def verify_backend():
    db = SessionLocal()
    try:
        # 1. Create a dummy deal if none exists
        deal = db.query(Deal).first()
        if not deal:
            print("No deal found in database. Creating dummy deal...")
            deal = Deal(
                request_id=1,
                offer_id=1,
                buyer_username="buyer",
                seller_username="seller",
                price=100.0,
                commission=10.0,
                payment_status="escrowed",
                delivery_status="pending"
            )
            db.add(deal)
            db.commit()
            db.refresh(deal)

        # 2. Simulate validation
        print(f"Simulating validation for deal {deal.id}...")
        # Create a tiny dummy CSV content
        csv_content = "a,b,c\n1,2,3\n4,5,6"
        import tempfile
        with tempfile.NamedTemporaryFile(suffix=".csv", delete=False, mode='w') as tmp:
            tmp.write(csv_content)
            tmp_path = tmp.name

        report = validator.run_validation(tmp_path)
        os.remove(tmp_path)

        # 3. Save to database (mimicking delivery.py logic)
        score = report.get("final_trust_score", 0.0)
        status = report.get("status")
        
        validation_record = ValidationResult(
            username="seller",
            deal_id=deal.id,
            final_score=score,
            status="passed" if status == "PASS" else "failed",
            report_json=json.dumps(report)
        )
        db.add(validation_record)
        db.commit()
        db.refresh(validation_record)

        # 4. Verify retrieval
        retrieved = db.query(ValidationResult).filter(ValidationResult.id == validation_record.id).first()
        if retrieved and retrieved.report_json:
            parsed_report = json.loads(retrieved.report_json)
            print(f"Success! Report saved and retrieved for record {retrieved.id}")
            print(f"Final Score: {retrieved.final_score}")
            print(f"Report has {len(parsed_report.get('all_reports', {}))} modules.")
            return True
        else:
            print("Error: Report not found or report_json is empty.")
            return False

    except Exception as e:
        print(f"Verification failed: {e}")
        return False
    finally:
        db.close()

if __name__ == "__main__":
    if verify_backend():
        print("\nBackend Report Verification: PASSED")
    else:
        print("\nBackend Report Verification: FAILED")
        sys.exit(1)
