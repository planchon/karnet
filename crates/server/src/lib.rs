use actix_web::{middleware::Logger, web, App, HttpServer};

mod handler;
mod routes;
mod options;

use clap::Parser;
use log::LevelFilter;
use openai_dive::v1::api::Client;
use options::EnvConfig;

pub fn main() -> Result<(), std::io::Error> {
    env_logger::builder().filter_level(LevelFilter::Debug).init();
    dotenvy::dotenv().ok();

    let config = EnvConfig::parse();

    log::info!("Starting server on port {}", config.http_port);
    log::debug!("OpenRouter API key: {}", config.openrouter_api_key);
    log::debug!("WorkOS API key: {}", config.workos_api_key);
    log::debug!("WorkOS client ID: {}", config.workos_client_id);

    let mut llm_client = Client {
        headers: None,
        project: None,
        api_key: config.openrouter_api_key,
        base_url: "https://openrouter.ai/api/v1".to_string(),
        http_client: reqwest::Client::new(),
        organization: None,
    };

    actix_web::rt::System::new().block_on(async move {
        HttpServer::new(move || {
            App::new()
                .app_data(web::Data::new(llm_client.clone()))
                .wrap(Logger::new("%r %s %b %T"))
                .service(web::scope("/v1")
                    .route("/health", web::get().to(|| async { "OK" }))
                    .service(web::resource("/chat")
                        .route(
                            web::post().to(routes::messages::chat_message)
                        )
                
                    )
                )
        })
        .workers(1)
        .bind(("0.0.0.0", 8080))
        .unwrap()
        .run()
        .await
    })?;

    Ok(())
}