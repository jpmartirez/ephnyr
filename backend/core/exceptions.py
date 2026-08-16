from fastapi import HTTPException, status

class EphnyrException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class QuotaExceededException(EphnyrException):
    def __init__(self, detail: str = "Quota limit exceeded."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class ResourceNotFoundException(EphnyrException):
    def __init__(self, detail: str = "Requested resource not found."):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedException(EphnyrException):
    def __init__(self, detail: str = "Could not validate authorization credentials."):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

class DuplicateResourceException(EphnyrException):
    def __init__(self, detail: str = "Resource already exists."):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)
