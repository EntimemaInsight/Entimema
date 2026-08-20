class RuntimeAPIError(RuntimeError):
    def __init__(self, status: int, code: str, message: str, *, retryable: bool = False) -> None:
        self.status, self.code, self.message, self.retryable = status, code, message, retryable
