use actix_web::{
    HttpResponse,
    web,
};
use openai_dive::v1::api::Client;
use openai_dive::v1::resources::chat::{
    ChatCompletionParametersBuilder, ChatCompletionResponseFormat, ChatMessage, ChatMessageContent
};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct ChatMessageRequest {
    model: String,
    messages: String,
}

pub async fn chat_message(
    data: web::Json<ChatMessageRequest>,
    llm_client: web::Data<Client>,
) -> Result<HttpResponse, actix_web::Error> {
    let create_message_data = data.into_inner();

    let parameters = ChatCompletionParametersBuilder::default()
        .model(create_message_data.model)
        .messages(vec![ChatMessage::User {
            content: ChatMessageContent::Text(create_message_data.messages),
            name: None,
        }])
        .response_format(ChatCompletionResponseFormat::Text)
        .build()
        .unwrap();

    let result = llm_client.chat().create(parameters).await.unwrap();

    Ok(HttpResponse::Ok().json(result))
}
