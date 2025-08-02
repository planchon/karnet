use crate::{error::WorkOSClientError, sso, user::{self, WorkOSUser}};

pub struct Workos {
    client_id: String,
    api_key: String,
}

impl Workos {
    pub fn new(client_id: String, api_key: String) -> Self {
        Self { client_id, api_key }
    }

    pub async fn get_authorization_url(&self, redirect_uri: String, connection: String) -> Result<String, WorkOSClientError> {
        sso::get_authorization_url(self.client_id.clone(), redirect_uri, connection).await
    }

    pub async fn create_user(&self, email: String, first_name: String, last_name: String, password: String, email_verified: bool) -> Result<WorkOSUser, WorkOSClientError> {
        user::create_user(self.api_key.clone(), email, first_name, last_name, password, email_verified).await
    }

    pub async fn delete_user(&self, user_id: String) -> Result<(), surf::Error> {
        user::delete_user(self.api_key.clone(), user_id).await
    }   

    pub async fn login(&self, email: String, password: String) -> Result<user::LoginResponse, WorkOSClientError> {
        user::login(self.client_id.clone(), self.api_key.clone(), email, password).await
    }
}