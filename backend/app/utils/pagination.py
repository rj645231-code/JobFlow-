from typing import TypeVar, List, Generic

T = TypeVar("T")

class PaginatedList(Generic[T]):
    def __init__(self, items: List[T], total: int, page: int, size: int):
        self.items = items
        self.total = total
        self.page = page
        self.size = size
