use serde::{Deserialize, Serialize};
use serde_json;
use surf::http::{convert::json, headers::{AUTHORIZATION, CONTENT_TYPE}};

use crate::error::WorkOSClientError;

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkOSUser {
    pub object: String,
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub email_verified: bool,
    pub created_at: String,
    pub updated_at: String,
}

pub async fn create_user(api_key: String, email: String, first_name: String, last_name: String, password: String, email_verified: bool) -> Result<WorkOSUser, WorkOSClientError> {
    let url = format!("https://api.workos.com/user_management/users");

    let request = surf::post(url)
        .header(AUTHORIZATION, format!("Bearer {}", api_key))
        .body_json(&json!({
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "password": password,
            "email_verified": email_verified,
        }))?;

    let mut response = request.await?;

    let body = response.body_string().await?;

    log::warn!("response: {:?}", body);

    let body = serde_json::from_str::<WorkOSUser>(&body);

    if let Err(e) = body {
        log::error!("Error creating user: {:?}", e);
        return Err(e.into());
    }

    Ok(body?)
}

pub async fn delete_user(api_key: String, user_id: String) -> Result<(), surf::Error> {
    let url = format!("https://api.workos.com/user_management/users/{}", user_id);

    surf::delete(url)
        .header(AUTHORIZATION, format!("Bearer {}", api_key)).await?;

    Ok(())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginResponse {
    pub user: WorkOSUser,
    pub access_token: String,
    pub refresh_token: String,
}

pub async fn login(client_id: String, api_key: String, email: String, password: String) -> Result<LoginResponse, WorkOSClientError> {
    let url = "https://api.workos.com/user_management/authenticate";

    let body = json!({
        "email": email,
        "password": password,
        "client_id": client_id,
        "client_secret": api_key,
        "grant_type": "password",
    });

    let request = surf::post(url)
        .header(AUTHORIZATION, format!("Bearer {}", api_key))
        .header(CONTENT_TYPE, "application/json")
        .body_json(&body)?;

    let mut response = request.await?;

    let body = response.body_string().await?;

    log::warn!("response: {:?}", body);

    let body = serde_json::from_str::<LoginResponse>(&body);

    if let Err(e) = body {
        log::error!("Error creating user: {:?}", e);
        return Err(e.into());
    }

    Ok(body?)
}