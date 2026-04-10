import init, { version_info, to_diagram_node } from './macro_railroad_wasm.js';


const MACROS = {
    panic: `macro_rules! panic {
    () => { ... };
    ($msg:expr) => { ... };
    ($msg:expr,) => { ... };
    ($fmt:expr, $($arg:tt)+) => { ... };
}`,

    bitflags: `macro_rules! bitflags {
    (
        $(#[$outer:meta])*
        pub struct $BitFlags:ident: $T:ty {
            $(
                $(#[$inner:ident $($args:tt)*])*
                const $Flag:ident = $value:expr;
            )+
        }
    ) => { ... };
    (
        $(#[$outer:meta])*
        struct $BitFlags:ident: $T:ty {
            $(
                $(#[$inner:ident $($args:tt)*])*
                const $Flag:ident = $value:expr;
            )+
        }
    ) => { ... };
    (
        $(#[$outer:meta])*
        pub ($($vis:tt)+) struct $BitFlags:ident: $T:ty {
            $(
                $(#[$inner:ident $($args:tt)*])*
                const $Flag:ident = $value:expr;
            )+
        }
    ) => { ... };
}`,

    cfg_if: `macro_rules! cfg_if {
    ($(
        if #[cfg($($meta:meta),*)] { $($it:item)* }
    ) else * else {
        $($it2:item)*
    }) => { ... };
    (
        if #[cfg($($i_met:meta),*)] { $($i_it:item)* }
        $(
            else if #[cfg($($e_met:meta),*)] { $($e_it:item)* }
        )*
    ) => { ... };
    (@__items ($($not:meta,)*) ; ) => { ... };
    (@__items ($($not:meta,)*) ; ( ($($m:meta),*) ($($it:item)*) ), $($rest:tt)*) => { ... };
    (@__apply $m:meta, $($it:item)*) => { ... };
}`,

    gfxdefines: `macro_rules! gfx_defines {
    ($(#[$attr:meta])* vertex $name:ident {
            $( $(#[$field_attr:meta])* $field:ident : $ty:ty = $e:expr, )+
    }) => { ... };
    ($(#[$attr:meta])* constant $name:ident {
            $( $(#[$field_attr:meta])* $field:ident : $ty:ty = $e:expr, )+
    }) => { ... };
    (pipeline $name:ident {
            $( $field:ident : $ty:ty = $e:expr, )+
    }) => { ... };
    ($(#[$attr:meta])* vertex $name:ident {
            $( $(#[$field_attr:meta])* $field:ident : $ty:ty = $e:expr, )+
    } $($tail:tt)+) => { ... };
    ($(#[$attr:meta])* constant $name:ident {
            $( $(#[$field_attr:meta])* $field:ident : $ty:ty = $e:expr, )+
    } $($tail:tt)+) => { ... };
    ($keyword:ident $name:ident {
            $( $field:ident : $ty:ty = $e:expr, )+
    } $($tail:tt)+) => { ... };
}`,

    sep: `macro_rules! sep {
    ($i:expr,  $separator:path, tuple ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, pair ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, delimited ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, separated_pair ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, preceded ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, terminated ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, do_parse ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, permutation ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, alt ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, alt_complete ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, switch ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, separated_list ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, many0 ! ($($rest:tt)*) ) => { ... };
    ($i:expr,  $separator:path, many1 ! ($($rest:tt)*) ) => { ... };
    ($i:expr, $separator:path, return_error!( $($rest:tt)* )) => { ... };
    ($i:expr, $separator:path, $submac:ident!( $($rest:tt)* )) => { ... };
    ($i:expr, $separator:path, $f:expr) => { ... };
}`,

    method: `macro_rules! method {
    ($name:ident<$a:ty>( $i:ty ) -> $o:ty, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$i:ty,$o:ty,$e:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$i:ty,$o:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$o:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty>( $i:ty ) -> $o:ty, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$i:ty,$o:ty,$e:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$i:ty,$o:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$o:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty>, $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty>( $i:ty ) -> $o:ty, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$i:ty,$o:ty,$e:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$i:ty,$o:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty,$o:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    ($name:ident<$a:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty>( $i:ty ) -> $o:ty, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$i:ty,$o:ty,$e:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$i:ty,$o:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty,$o:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
    (pub $name:ident<$a:ty>, mut $self_:ident, $submac:ident!( $($args:tt)* )) => { ... };
}`,

    cond_reduce: `macro_rules! cond_reduce {
    ($i:expr, $cond:expr, $submac:ident!( $($args:tt)* )) => { ... };
    ($i:expr, $cond:expr) => { ... };
    ($i:expr, $cond:expr, $f:expr) => { ... };
}`,

    named_attrs: `macro_rules! named_args {
    (pub $func_name:ident ( $( $arg:ident : $typ:ty ),* ) < $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    (pub $func_name:ident < 'a > ( $( $arg:ident : $typ:ty ),* ) < $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    ($func_name:ident ( $( $arg:ident : $typ:ty ),* ) < $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    ($func_name:ident < 'a > ( $( $arg:ident : $typ:ty ),* ) < $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    (pub $func_name:ident ( $( $arg:ident : $typ:ty ),* ) < $input_type:ty, $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    ($func_name:ident ( $( $arg:ident : $typ:ty ),* ) < $input_type:ty, $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    (pub $func_name:ident < 'a > ( $( $arg:ident : $typ:ty ),* ) < $input_type:ty, $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
    ($func_name:ident < 'a > ( $( $arg:ident : $typ:ty ),* ) < $input_type:ty, $return_type:ty > , $submac:ident!( $($args:tt)* ) ) => { ... };
}`,

    verify: `macro_rules! verify {
    (__impl $i:expr, $submac:ident!( $($args:tt)* ), $submac2:ident!( $($args2:tt)* )) => { ... };
    ($i:expr, $submac:ident!( $($args:tt)* ), $g:expr) => { ... };
    ($i:expr, $submac:ident!( $($args:tt)* ), $submac2:ident!( $($args2:tt)* )) => { ... };
    ($i:expr, $f:expr, $g:expr) => { ... };
    ($i:expr, $f:expr, $submac:ident!( $($args:tt)* )) => { ... };
}`,

    hodor: `macro_rules! HODOR {
 ($ptr:ident; $vec:ident;) => {};
 ($ptr:ident; $vec:ident;  HODOR.  HODOR? $($x:tt)*) => {
    $ptr+=1;
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident;  HODOR?  HODOR. $($x:tt)*) => {
    $ptr-=1;
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident;  HODOR.  HODOR. $($x:tt)*) => {
    $vec[$ptr]+=1;
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident;  HODOR!  HODOR! $($x:tt)*) => {
    $vec[$ptr]-=1;
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident;  HODOR!  HODOR. $($x:tt)*) => {
    print($vec[$ptr]);
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident;  HODOR.  HODOR! $($x:tt)*) => {
    $vec[$ptr] = input();
    HODOR!($ptr; $vec; $($x)*);
 };

 ($ptr:ident; $vec:ident; [ $($inner:tt)* ] $($x:tt)*) => {
    while $vec[$ptr] != 0 {
       HODOR!($ptr; $vec; $($inner)*) ;
    }
    HODOR!($ptr; $vec; $($x)+)
 };
}`,
};

let aceEditor = null;
let wasmReady = false;
let currentTheme = 'light';

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function updateDiagram() {
    if (!aceEditor || !wasmReady) return;
    const src = aceEditor.getValue();
    const hideInternal = document.getElementById('opt_hide_internal').checked;
    const preserveGroups = document.getElementById('opt_preserve_groups').checked;
    const foldCommonTails = document.getElementById('opt_fold_common_tails').checked;
    const showLegend = document.getElementById('opt_show_legend').checked;
    const isBright = document.getElementById('opt_bright').checked;
    try {
        document.getElementById('output').innerHTML = to_diagram_node(
            src, hideInternal, !preserveGroups, foldCommonTails, showLegend, isBright
        );
    } catch (err) {
        document.getElementById('output').innerHTML =
            `<div class="error-text">Parse error:\n${escapeHtml(String(err))}</div>`;
    }
}

function initAceEditor() {
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.43.3/');

    const savedTheme = localStorage.getItem('macro-railroad-editor-theme')
        || (currentTheme === 'dark' ? 'ace/theme/twilight' : 'ace/theme/github');

    aceEditor = ace.edit('ace-editor', {
        mode: 'ace/mode/rust',
        theme: savedTheme,
        wrap: true,
        fontSize: '11px',
        useWorker: false,
        showPrintMargin: false,
    });
    aceEditor.setOptions({
        highlightActiveLine: false,
        useSoftTabs: true,
        tabSize: 4,
    });
    aceEditor.setValue(MACROS.bitflags, -1);
    aceEditor.on('change', updateDiagram);

    // Sync select to active theme
    document.getElementById('editor-theme').value = savedTheme;
}

function updateThemeToggleLabel() {
    const label = document.getElementById('theme-toggle-label');
    if (label) label.textContent = currentTheme === 'dark' ? 'Light mode' : 'Dark mode';
}

function restoreTheme() {
    const saved = localStorage.getItem('macro-railroad-theme') || 'light';
    currentTheme = saved;
    document.documentElement.setAttribute('data-theme', saved === 'dark' ? 'dark' : '');
    updateThemeToggleLabel();
}

function handleThemeToggle() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : '');
    localStorage.setItem('macro-railroad-theme', currentTheme);
    // Sync opt_bright to match page theme: light page → bright diagrams
    document.getElementById('opt_bright').checked = currentTheme === 'light';
    updateThemeToggleLabel();
    updateDiagram();
}

function handleToggleOptions() {
    const container = document.querySelector('.app-container');
    const hidden = container.hasAttribute('data-options-hidden');
    if (hidden) {
        container.removeAttribute('data-options-hidden');
        localStorage.removeItem('macro-railroad-options-hidden');
    } else {
        container.setAttribute('data-options-hidden', '');
        localStorage.setItem('macro-railroad-options-hidden', '1');
    }
    document.getElementById('toggle-options-label').textContent =
        container.hasAttribute('data-options-hidden') ? 'Show Options' : 'Hide Options';
    // Resize the Ace editor to fill the newly available width
    if (aceEditor) aceEditor.resize();
}

function handleUrlParam() {
    const m = new URLSearchParams(location.search).get('m');
    if (m) aceEditor.setValue(m, -1);
}

async function handleCopySvg() {
    const svg = document.querySelector('#output svg');
    if (!svg) return;
    await navigator.clipboard.writeText(svg.outerHTML);
    const btn = document.getElementById('copy-svg');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy SVG'; }, 1500);
}

function wireEvents() {
    for (const id of ['opt_hide_internal', 'opt_preserve_groups', 'opt_fold_common_tails', 'opt_show_legend', 'opt_bright']) {
        document.getElementById(id).addEventListener('change', updateDiagram);
    }
    document.getElementById('copy-svg').addEventListener('click', handleCopySvg);
    document.getElementById('theme-toggle').addEventListener('click', handleThemeToggle);
    document.getElementById('toggle-options').addEventListener('click', handleToggleOptions);
    document.getElementById('editor-theme').addEventListener('change', e => {
        const theme = e.target.value;
        aceEditor.setTheme(theme);
        localStorage.setItem('macro-railroad-editor-theme', theme);
    });
    document.querySelector('.example-list').addEventListener('click', e => {
        const link = e.target.closest('[data-macro]');
        if (!link) return;
        e.preventDefault();
        const text = MACROS[link.dataset.macro];
        if (text) aceEditor.setValue(text, -1);
    });
}

async function bootstrap() {
    restoreTheme();
    if (localStorage.getItem('macro-railroad-options-hidden')) {
        document.querySelector('.app-container').setAttribute('data-options-hidden', '');
        document.getElementById('toggle-options-label').textContent = 'Show Options';
    }
    await init();
    wasmReady = true;
    document.getElementById('version-info').textContent = version_info();
    initAceEditor();
    // Sync opt_bright with restored theme after editor is ready
    document.getElementById('opt_bright').checked = currentTheme === 'light';
    wireEvents();
    handleUrlParam();
    updateDiagram();
}

document.addEventListener('DOMContentLoaded', bootstrap);
