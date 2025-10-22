use std::rc::Rc;

use deno_ast::{MediaType, ParseParams};
use deno_core::{
    error::{CoreError, ModuleLoaderError},
    op2, ModuleLoadResponse, ModuleSourceCode,
};
use deno_error::JsErrorBox;

#[op2(async)]
#[string]
async fn op_read_file(#[string] path: String) -> Result<String, std::io::Error> {
    let content = tokio::fs::read_to_string(path).await?;
    Ok(content)
}

struct TSModuleLoader;

impl deno_core::ModuleLoader for TSModuleLoader {
    fn resolve(
        &self,
        specifier: &str,
        referrer: &str,
        _kind: deno_core::ResolutionKind,
    ) -> Result<deno_core::ModuleSpecifier, ModuleLoaderError> {
        deno_core::resolve_import(specifier, referrer).map_err(|e| e.into())
    }

    fn load(
        &self,
        module_specifier: &deno_core::ModuleSpecifier,
        _maybe_referrer: Option<&deno_core::ModuleSpecifier>,
        _is_dyn_import: bool,
        _requested_module_type: deno_core::RequestedModuleType,
    ) -> deno_core::ModuleLoadResponse {
        let module_specifier = module_specifier.clone();
        let module_load = move || {
            let path = module_specifier.to_file_path().unwrap();

            let media_type = MediaType::from_path(&path);
            let (module_type, should_transpile) = match media_type {
                MediaType::JavaScript | MediaType::Cjs | MediaType::Mjs => {
                    (deno_core::ModuleType::JavaScript, false)
                }
                MediaType::Jsx => (deno_core::ModuleType::JavaScript, true),
                MediaType::TypeScript | MediaType::Mts | MediaType::Cts => {
                    (deno_core::ModuleType::JavaScript, true)
                }
                MediaType::Json => (deno_core::ModuleType::Json, false),
                _ => panic!("Unsupported media type: {}", media_type),
            };

            let code = std::fs::read_to_string(&path)?;
            let code = if should_transpile {
                let parsed = deno_ast::parse_module(ParseParams {
                    specifier: module_specifier.clone(),
                    text: code.into(),
                    media_type,
                    capture_tokens: false,
                    scope_analysis: false,
                    maybe_syntax: None,
                })
                .map_err(JsErrorBox::from_err)?;

                parsed
                    .transpile(
                        &Default::default(),
                        &Default::default(),
                        &Default::default(),
                    )
                    .map_err(JsErrorBox::from_err)?
                    .into_source()
                    .text
            } else {
                code
            };

            Ok(deno_core::ModuleSource::new(
                module_type,
                ModuleSourceCode::String(code.into()),
                &module_specifier,
                None,
            ))
        };

        ModuleLoadResponse::Sync(module_load())
    }
}

deno_core::extension!(
    karnetjs,
    ops = [op_read_file],
    esm_entry_point = "ext:karnetjs/runtime.js",
    esm = [dir "src/js", "runtime.js"]
);

async fn run_js(file_path: &str) -> Result<(), CoreError> {
    let main_module = deno_core::resolve_path(file_path, &std::env::current_dir()?).unwrap();

    let mut js_runtime = deno_core::JsRuntime::new(deno_core::RuntimeOptions {
        module_loader: Some(Rc::new(TSModuleLoader)),
        extensions: vec![karnetjs::init_ops_and_esm()],
        ..Default::default()
    });

    let module_id = js_runtime.load_main_es_module(&main_module).await?;
    let result = js_runtime.mod_evaluate(module_id);

    js_runtime.run_event_loop(Default::default()).await?;

    result.await
}

fn main() {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .enable_all()
        .build()
        .unwrap();
    if let Err(e) = runtime.block_on(run_js("src/test.ts")) {
        eprintln!("Error: {}", e);
    }
}
