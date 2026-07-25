import csv
import io
from typing import List
from app.schemas.recruiter import RecruiterCreate
from app.core.exceptions import ValidationError
from pydantic import ValidationError as PydanticValidationError

class CSVImportService:
    def parse_recruiter_csv(self, file_content: bytes) -> List[RecruiterCreate]:
        """Parse uploaded CSV and return valid recruiter schemas."""
        try:
            content = file_content.decode('utf-8')
        except UnicodeDecodeError:
            raise ValidationError("File must be UTF-8 encoded")
            
        reader = csv.DictReader(io.StringIO(content))
        recruiters = []
        
        if not reader.fieldnames:
            raise ValidationError("CSV is empty or missing headers")
            
        required_fields = ['name', 'email']
        for field in required_fields:
            if field not in reader.fieldnames:
                raise ValidationError(f"Missing required column: {field}")
                
        for row_num, row in enumerate(reader, start=2):
            try:
                recruiter = RecruiterCreate(
                    name=row.get('name', '').strip(),
                    email=row.get('email', '').strip(),
                    phone=row.get('phone', '').strip() or None,
                    linkedin_url=row.get('linkedin_url', '').strip() or None,
                    notes=row.get('notes', '').strip() or None
                )
                recruiters.append(recruiter)
            except PydanticValidationError as e:
                # Log error or collect per-row errors
                raise ValidationError(f"Validation error on row {row_num}: {e}")
                
        return recruiters

csv_import_service = CSVImportService()
