class JobFlowException(Exception):
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class NotFoundError(JobFlowException):
    pass

class UnauthorizedError(JobFlowException):
    pass

class ForbiddenError(JobFlowException):
    pass

class ValidationError(JobFlowException):
    pass

class DuplicateError(JobFlowException):
    pass
