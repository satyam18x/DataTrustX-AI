import uuid

class MockPaymentProvider:
    def create_payment(self, amount: float):
        return {
            "payment_id": str(uuid.uuid4()),
            "amount": amount,
            "status": "success"
        }
