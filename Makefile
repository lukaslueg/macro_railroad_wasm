.DEFAULT_GOAL := all

Cargo.lock:
	cargo update

pkg/macro_railroad_wasm_bg.wasm: Cargo.lock Cargo.toml src/lib.rs
	wasm-pack build --target web

pkg/macro_railroad_wasm.js: pkg/macro_railroad_wasm_bg.wasm;

static/macro_railroad_wasm_bg.wasm: pkg/macro_railroad_wasm_bg.wasm
	cp $< $@

static/macro_railroad_wasm.js: pkg/macro_railroad_wasm.js
	cp $< $@


.PHONY: all
all: static/macro_railroad_wasm_bg.wasm static/macro_railroad_wasm.js static/index.html;

.PHONY: serve
serve: all
	cd static && python3 -m http.server

.PHONY: clean
clean:
	-rm static/macro_railroad_wasm.js
	-rm static/macro_railroad_wasm_bg.wasm
	-rm -rf target/
	-rm -rf pkg/
