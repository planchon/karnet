use clap::Parser;

#[derive(Debug, Parser, Clone)]
#[clap(version, author)]
pub struct EnvConfig {
    #[clap(long, env = "HTTP_PORT")]
    pub http_port: u16,

    #[clap(long, env = "OPENROUTER_API_KEY")]
    pub openrouter_api_key: String,

    #[clap(long, env = "WORKOS_CLIENT_ID")]
    pub workos_client_id: String,

    #[clap(long, env = "WORKOS_API_KEY")]
    pub workos_api_key: String,
}
