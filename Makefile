.DEFAULT_GOAL := target/deploy/macro_railroad_wasm.wasm

Cargo.lock:
	cargo update

target/deploy/macro_railroad_wasm.wasm: Cargo.lock Cargo.toml Web.toml src/lib.rs static/index.html static/forkme.svg
	cargo web deploy --release
	wasm-opt -Oz -o $@ $@
