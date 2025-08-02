use crate::error::WorkOSClientError;

pub async fn get_authorization_url(client_id: String, redirect_uri: String, connection: String) -> Result<String, WorkOSClientError> {
    let url = format!("https://api.workos.com/sso/authorize?response_type=code&client_id={}&redirect_uri={}&connection={}", client_id, redirect_uri, connection);

    let request = surf::get(url);

    let mut response = request.await?;

    let body = response.body_string().await?; 

    Ok(body)
}