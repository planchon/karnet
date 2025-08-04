use actix_web::HttpResponse;

pub async fn chat_message(
) -> Result<HttpResponse, actix_web::Error> {
    Ok(HttpResponse::Ok().body("Hello, world!"))
}