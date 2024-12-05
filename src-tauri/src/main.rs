// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;

#[async_std::main]
async fn main() {
    db::init().await;

    tauri_window_test_lib::run()
}
