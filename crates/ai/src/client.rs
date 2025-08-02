use crate::{chat::{self, ChatCompletionRequest, ChatCompletionResponse}, errors::OpenRouterError};

pub struct OpenRouterClient {
    pub base_url: String,
    pub api_key: String,
    pub app_title: Option<String>,
}



impl OpenRouterClient {
    pub fn new(api_key: String) -> Self {
        Self {
            base_url: "https://openrouter.ai/api/v1".to_string(),
            api_key,
            app_title: None,
        }
    }

    pub async fn send_chat_completion(&self, request: ChatCompletionRequest) -> Result<ChatCompletionResponse, OpenRouterError> {
        if self.api_key.is_empty() {
            return Err(OpenRouterError::APIKeyNotSet);
        }

        chat::send_chat_completion(self, request).await
    }
}