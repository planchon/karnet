use serde_json;
use surf;

#[derive(Debug)]
pub enum WorkOSClientError {
    SerdeError(serde_json::Error),
    SurfError(surf::Error),
}

impl From<serde_json::Error> for WorkOSClientError {
    fn from(e: serde_json::Error) -> Self {
        WorkOSClientError::SerdeError(e)
    }
}

impl From<surf::Error> for WorkOSClientError {
    fn from(e: surf::Error) -> Self {
        WorkOSClientError::SurfError(e)
    }
}

