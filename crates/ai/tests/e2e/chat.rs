use ai::{chat::{ChatCompletionRequest, Message}, errors::OpenRouterError};
use ai::types::Role;

use super::utils::create_client;

const FREE_TEST_MODEL: &str = "openrouter/horizon-beta";

#[tokio::test]
async fn test_basic_chat() -> Result<(), OpenRouterError> {
    env_logger::init();

    let client = create_client();

    let messages = vec![
        Message {
            role: Role::User,
            content: "We are testing the connection to the server. Only answer with 'Hello, world!'".to_string(),
        },
    ];

    let request = ChatCompletionRequest {
        model: FREE_TEST_MODEL.to_string(),
        messages,
        stream: None,
    };

    let response = client.send_chat_completion(request).await?; 

    assert!(!response.id.is_empty(), "Response ID should not be empty");
    assert_eq!(response.model, FREE_TEST_MODEL, "Model name should be the same as the test model");

    let content = response.choices[0].message.content.clone();

    assert!(!content.is_empty(), "Response content should not be empty");
    assert!(content.contains("Hello, world!"), "Response content should contain 'Hello, world!'");

    Ok(())
}
