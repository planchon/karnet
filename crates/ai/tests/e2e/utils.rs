use ai::client::OpenRouterClient;

pub fn get_api_key() -> String {
    dotenv::dotenv().ok();

    let key = std::env::var("OPENROUTER_API_KEY");
    match key {
        Ok(key) => key,
        Err(e) => {
            log::error!("OPENROUTER_API_KEY must be set: {}", e);
            panic!("{}", e);
        }
    }
}

pub fn create_client() -> OpenRouterClient{
    OpenRouterClient::new(get_api_key())
}