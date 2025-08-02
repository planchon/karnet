use serde::{Deserialize, Serialize};
use surf::http::{headers::{AUTHORIZATION, CONTENT_TYPE}, mime::JSON};

use crate::{client::OpenRouterClient, errors::{OpenRouterError}, types::{Choice, Role}};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Message {
    pub role: Role,
    pub content: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct ChatCompletionRequest {
    pub model: String,
    pub messages: Vec<Message>,

    #[serde(skip)]
    pub stream: Option<bool> 
}

impl ChatCompletionRequest {
    pub fn new(model: String, messages: Vec<Message>) -> Self {
        Self {
            model,
            messages,
            stream: None,
        }
    }
}

#[derive(Deserialize, Debug, Clone)]
pub struct ChatCompletionResponse {
    pub id: String,
    pub choices: Vec<Choice>,
    pub created: u64,
    pub model: String,
}

pub async fn send_chat_completion(
    client: &OpenRouterClient,
    chat_request: ChatCompletionRequest,
) -> Result<ChatCompletionResponse, OpenRouterError> {
    let url = format!("{}/chat/completions", client.base_url);

    log::debug!("Chat request: {:?}", chat_request);

    let mut request= surf::post(url)
        .header(AUTHORIZATION, format!("Bearer {}", client.api_key))
        .header(CONTENT_TYPE, JSON)
        .body_json(&chat_request)?;

    if let Some(app_title) = client.app_title.clone() {
        request = request.header("X-Title", app_title);
    }

    log::debug!("Sending chat completion request to OpenRouter: {:?}", request);

    let mut response = request.await?;

    if response.status().is_success() {
        let body = response.body_json().await?;
        Ok(body)
    } else {
        let text = response.body_string().await.unwrap_or_else(|_| "Failed to get error message".to_string());

        Err(OpenRouterError::ApiError {
            code: response.status(),
            message: text,
        })
    }

}