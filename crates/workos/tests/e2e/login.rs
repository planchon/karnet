use super::utils::get_workos_client;

#[tokio::test]
pub async fn full_flow_sso() {
    env_logger::init();

    let workos = get_workos_client();

    let redirect_uri = "http://localhost:1234/sso/callback";
    // this is a public test connection
    let connection = "conn_01JW1KZ44FVWJVMSZYHZ03GM63";

    let url = workos.get_authorization_url(redirect_uri.to_string(), connection.to_string()).await;

    let url = url.unwrap();

    assert!(!url.is_empty());
    assert!(url.contains("https://dashboard.workos.com/environment_"));
    assert!(url.contains(connection));
}

const E2E_TEST_EMAIL: &str = "e2e-test@brume.dev";
const E2E_TEST_PASSWORD: &str = "4r3279jkljkl@";

#[tokio::test]
pub async fn full_flow_user() {
    let workos = get_workos_client();

    let user = workos.create_user(E2E_TEST_EMAIL.to_string(), "Test".to_string(), "User".to_string(), E2E_TEST_PASSWORD.to_string(), true).await;

    if let Err(e) = user {
        log::error!("Error creating user: {:?}", e);
        return;
    }

    let user = user.unwrap();

    assert_eq!(user.email, E2E_TEST_EMAIL);
    assert_eq!(user.first_name, "Test");
    assert_eq!(user.last_name, "User");
    assert_eq!(user.email_verified, true);

    let login = workos.login(E2E_TEST_EMAIL.to_string(), E2E_TEST_PASSWORD.to_string()).await;

    if let Err(e) = login {
        log::error!("Error logging in: {:?}", e);
        return;
    }

    let login = login.unwrap();

    assert_eq!(login.user.email, E2E_TEST_EMAIL);
    assert_eq!(login.access_token.is_empty(), false);
    assert_eq!(login.refresh_token.is_empty(), false);

    if let Err(e) = workos.delete_user(user.id.clone()).await {
        log::error!("Error deleting user: {:?}", e);
    }
}