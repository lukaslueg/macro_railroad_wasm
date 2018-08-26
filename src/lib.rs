#![allow(stable_features)]
#![feature(proc_macro)]
#![feature(use_extern_macros)]

#[macro_use]
extern crate stdweb;
extern crate railroad;
extern crate macro_railroad;
extern crate syn;
extern crate htmlescape;

use stdweb::js_export;

#[allow(dead_code)]
mod built_info {
    include!(concat!(env!("OUT_DIR"), "/built.rs"));
}

#[js_export]
fn version_info() -> String {
    format!("WASM-blob built {} on {} using {}", built_info::BUILT_TIME_UTC, built_info::RUSTC_VERSION, built_info::DEPENDENCIES_STR)
}

#[js_export]
fn to_diagram_node(src: &str, hide_internal: bool, ungroup: bool, foldcommontails: bool, legend: bool) -> String {
    match to_diagram(src, hide_internal, ungroup, foldcommontails, legend) {
        Err(e) => {
            format!(r#"
Failed to parse, and I didn't even write an error-handler. Anyway:
<pre>{:?}</pre>
"#, e)
        },
        Ok((name, diagram)) => {
            format!(r#"
<h3>Syntax diagram for macro `{}`</h3>
<div style="width: {}px; height: auto; max-height: 100%; max-width: 100%">
{}
</div>
"#, name, (&diagram as &railroad::RailroadNode).width(), diagram)
        }
    }
}

fn to_diagram(src: &str, hide_internal: bool, ungroup: bool, foldcommontails: bool, legend: bool) -> Result<(String, railroad::Diagram<Box<railroad::RailroadNode>>), syn::synom::ParseError> {
    let macro_rules = macro_railroad::parser::parse(&src)?;

    let mut tree = macro_railroad::lowering::MacroRules::from(macro_rules);

    if hide_internal {
        tree.remove_internal();
    }

    if ungroup {
        tree.ungroup();
    }

    if foldcommontails {
        tree.foldcommontails();
    }

    tree.normalize();

    let name = tree.name.clone();

    let mut dia = macro_railroad::diagram::into_diagram(tree, legend);

    dia.add_default_css();
    macro_railroad::diagram::add_default_css(&mut dia);

    Ok((name, dia))
}
