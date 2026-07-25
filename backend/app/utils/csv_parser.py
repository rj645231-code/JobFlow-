import csv
import io
from typing import List, Dict, Any

def parse_csv_content(content: str) -> List[Dict[str, Any]]:
    """Parse generic CSV string into a list of dictionaries."""
    reader = csv.DictReader(io.StringIO(content))
    return [row for row in reader]
