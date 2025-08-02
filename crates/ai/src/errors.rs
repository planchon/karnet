use surf::StatusCode;

impl From<surf::Error> for OpenRouterError {
    fn from(error: surf::Error) -> Self {
        OpenRouterError::HttpError(error)
    }
}

#[derive(Debug)]
pub enum OpenRouterError {
    HttpError(surf::Error),
    ApiError {
        code: StatusCode,
        message: String,
    },
    APIKeyNotSet,
    Serialization(serde_json::Error),
    UnknownError(String),
}