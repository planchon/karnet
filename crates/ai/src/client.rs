use crate::{chat::{self, ChatCompletionRequest, ChatCompletionResponse}, errors::OpenRouterError};

pub struct OpenRouterClient {
    pub base_url: String,
    pub api_key: String,
    pub app_title: Option<String>,
}



impl OpenRouterClient {
    pub fn new(api_key: String) -> Self {
        Self::with_base_url(api_key, "https://openrouter.ai/api/v1".to_string())
    }

    pub fn with_base_url(api_key: String, base_url: String) -> Self {
        Self {
            base_url,
            api_key,
            app_title: None,
        }
    }

    pub fn with_app_title(mut self, app_title: String) -> Self {
        self.app_title = Some(app_title);
        self
    }

    pub async fn send_chat_completion(&self, request: ChatCompletionRequest) -> Result<ChatCompletionResponse, OpenRouterError> {
        if self.api_key.is_empty() {
            return Err(OpenRouterError::APIKeyNotSet);
        }

        chat::send_chat_completion(self, request).await
    }
}