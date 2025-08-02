use workos::client::Workos;

pub fn get_workos_client() -> Workos {
    dotenv::dotenv().ok();

    let client_id = std::env::var("WORKOS_CLIENT_ID").expect("WORKOS_CLIENT_ID must be set");
    let api_key = std::env::var("WORKOS_API_KEY").expect("WORKOS_API_KEY must be set");

    Workos::new(
        client_id,
        api_key,
    )
}