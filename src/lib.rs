use wasm_bindgen::prelude::*;

#[allow(dead_code)]
mod built_info {
    include!(concat!(env!("OUT_DIR"), "/built.rs"));
}

#[wasm_bindgen]
pub fn version_info() -> String {
    format!(
        "WASM-blob built {} on {} using {}",
        built_info::BUILT_TIME_UTC,
        built_info::RUSTC_VERSION,
        built_info::DIRECT_DEPENDENCIES_STR
    )
}

#[wasm_bindgen]
pub fn to_diagram_node(
    src: &str,
    hide_internal: bool,
    ungroup: bool,
    foldcommontails: bool,
    legend: bool,
    bright: bool,
) -> String {
    match to_diagram(src, hide_internal, ungroup, foldcommontails, legend, bright) {
        Err(e) => format!(
            r#"
Failed to parse, and I didn't even write an error-handler. Anyway:
<pre>{:?}</pre>
"#,
            e
        ),
        Ok((name, diagram)) => format!(
            r#"
<h3>Syntax diagram for macro `{}`</h3>
<div style="width: {}px; height: auto; max-height: 100%; max-width: 100%">
{}
</div>
"#,
            name,
            (&diagram as &dyn macro_railroad::railroad::Node).width(),
            diagram
        ),
    }
}

fn to_diagram(
    src: &str,
    hide_internal: bool,
    ungroup: bool,
    foldcommontails: bool,
    legend: bool,
    bright: bool,
) -> Result<
    (
        String,
        macro_railroad::railroad::Diagram<Box<dyn macro_railroad::railroad::Node>>,
    ),
    macro_railroad::syn::parse::Error,
> {
    let macro_rules = macro_railroad::parser::parse(src)?;

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

    let style = if bright {
        macro_railroad::railroad::Stylesheet::Light
    } else {
        macro_railroad::railroad::Stylesheet::Dark
    };
    dia.add_stylesheet(&style);
    macro_railroad::diagram::add_default_css(&mut dia, &style);

    Ok((name, dia))
}
