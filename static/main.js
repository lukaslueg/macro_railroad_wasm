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

const EDITOR_HEIGHT_STORAGE_KEY = 'macro-railroad-editor-height';
const DEFAULT_EDITOR_HEIGHT = 350;
const MIN_EDITOR_HEIGHT = 160;
const MIN_DIAGRAM_HEIGHT = 200;
const LIGHT_EDITOR_THEME = 'ace/theme/github';
const DARK_EDITOR_THEME = 'ace/theme/twilight';

let aceEditor = null;
let wasmReady = false;
let currentTheme = 'light';
let editorResizeState = null;

// Diagram viewport state (zoom + pan)
const ZOOM_MIN = 0.1;
const ZOOM_MAX = 5;
const ZOOM_STEP = 0.25;
const ZOOM_WHEEL_FACTOR = 0.001;
let viewZoom = 1;
let viewPanX = 0;
let viewPanY = 0;
let panState = null;

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function applyViewTransform() {
    const output = document.getElementById('output');
    output.style.transform = `translate(${viewPanX}px, ${viewPanY}px) scale(${viewZoom})`;
}

function resetView() {
    viewZoom = 1;
    viewPanX = 0;
    viewPanY = 0;
    applyViewTransform();
}

function zoomBy(delta, centerX, centerY) {
    const oldZoom = viewZoom;
    viewZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, viewZoom + delta));
    if (centerX !== undefined && centerY !== undefined) {
        // Adjust pan so the point under the cursor stays fixed
        const ratio = viewZoom / oldZoom;
        viewPanX = centerX - ratio * (centerX - viewPanX);
        viewPanY = centerY - ratio * (centerY - viewPanY);
    }
    applyViewTransform();
}

function handleDiagramPointerDown(event) {
    if (panState || event.button !== 0) return;
    // Don't pan when clicking nav buttons
    if (event.target.closest('.diagram-nav')) return;
    event.preventDefault();
    const area = document.getElementById('diagram-area');
    const pointerId = event.pointerId;
    const onMove = e => {
        viewPanX += e.clientX - panState.lastX;
        viewPanY += e.clientY - panState.lastY;
        panState.lastX = e.clientX;
        panState.lastY = e.clientY;
        applyViewTransform();
    };
    const onUp = () => {
        area.classList.remove('is-panning');
        if (area.hasPointerCapture(pointerId)) {
            area.releasePointerCapture(pointerId);
        }
        area.removeEventListener('pointermove', onMove);
        area.removeEventListener('pointerup', onUp);
        area.removeEventListener('pointercancel', onUp);
        panState = null;
    };
    panState = { lastX: event.clientX, lastY: event.clientY };
    area.classList.add('is-panning');
    area.setPointerCapture(pointerId);
    area.addEventListener('pointermove', onMove);
    area.addEventListener('pointerup', onUp);
    area.addEventListener('pointercancel', onUp);
}

function handleDiagramWheel(event) {
    event.preventDefault();
    const area = document.getElementById('diagram-area');
    const rect = area.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const cursorY = event.clientY - rect.top;
    const delta = -event.deltaY * ZOOM_WHEEL_FACTOR * viewZoom;
    zoomBy(delta, cursorX, cursorY);
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
    resetView();
}

function getEditorResizeElements() {
    return {
        mainContent: document.querySelector('.main-content'),
        editorArea: document.querySelector('.editor-area'),
        resizeHandle: document.getElementById('editor-resize-handle'),
    };
}

function clampEditorHeight(height) {
    const { mainContent, resizeHandle } = getEditorResizeElements();
    if (!mainContent || !resizeHandle) return height;
    const availableHeight = mainContent.clientHeight - resizeHandle.offsetHeight;
    const maxHeight = Math.max(MIN_EDITOR_HEIGHT, availableHeight - MIN_DIAGRAM_HEIGHT);
    return Math.min(Math.max(height, MIN_EDITOR_HEIGHT), maxHeight);
}

function applyEditorHeight(height, persist = true) {
    const { editorArea } = getEditorResizeElements();
    if (!editorArea) return;
    const nextHeight = clampEditorHeight(height);
    editorArea.style.height = `${nextHeight}px`;
    if (persist) {
        localStorage.setItem(EDITOR_HEIGHT_STORAGE_KEY, String(Math.round(nextHeight)));
    }
    if (aceEditor) aceEditor.resize();
}

function restoreEditorHeight() {
    const savedHeight = Number.parseInt(localStorage.getItem(EDITOR_HEIGHT_STORAGE_KEY) || '', 10);
    applyEditorHeight(Number.isFinite(savedHeight) ? savedHeight : DEFAULT_EDITOR_HEIGHT, false);
}

function handleEditorResizeMove(event) {
    if (!editorResizeState) return;
    applyEditorHeight(editorResizeState.startHeight + (event.clientY - editorResizeState.startY), false);
}

function finishEditorResize(event) {
    if (!editorResizeState) return;
    applyEditorHeight(editorResizeState.startHeight + (event.clientY - editorResizeState.startY));
    editorResizeState.cleanup();
    editorResizeState = null;
}

function startEditorResize(event) {
    if (editorResizeState || event.button !== 0) return;
    const { editorArea, resizeHandle } = getEditorResizeElements();
    if (!editorArea || !resizeHandle) return;
    event.preventDefault();
    const pointerId = event.pointerId;
    const onPointerMove = moveEvent => handleEditorResizeMove(moveEvent);
    const onPointerUp = upEvent => finishEditorResize(upEvent);
    const onPointerCancel = cancelEvent => finishEditorResize(cancelEvent);
    editorResizeState = {
        startY: event.clientY,
        startHeight: editorArea.getBoundingClientRect().height,
        cleanup: () => {
            document.body.classList.remove('is-resizing');
            if (resizeHandle.hasPointerCapture(pointerId)) {
                resizeHandle.releasePointerCapture(pointerId);
            }
            resizeHandle.removeEventListener('pointermove', onPointerMove);
            resizeHandle.removeEventListener('pointerup', onPointerUp);
            resizeHandle.removeEventListener('pointercancel', onPointerCancel);
        },
    };
    document.body.classList.add('is-resizing');
    resizeHandle.setPointerCapture(pointerId);
    resizeHandle.addEventListener('pointermove', onPointerMove);
    resizeHandle.addEventListener('pointerup', onPointerUp);
    resizeHandle.addEventListener('pointercancel', onPointerCancel);
}

function initAceEditor() {
    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.43.3/');

    const savedTheme = localStorage.getItem('macro-railroad-editor-theme')
        || (currentTheme === 'dark' ? DARK_EDITOR_THEME : LIGHT_EDITOR_THEME);

    restoreEditorHeight();
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

function getPreferredPageTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function restoreTheme() {
    currentTheme = localStorage.getItem('macro-railroad-theme') || getPreferredPageTheme();
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : '');
    updateThemeToggleLabel();
}

function handleThemeToggle() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    const editorTheme = currentTheme === 'dark' ? DARK_EDITOR_THEME : LIGHT_EDITOR_THEME;
    document.documentElement.setAttribute('data-theme', currentTheme === 'dark' ? 'dark' : '');
    localStorage.setItem('macro-railroad-theme', currentTheme);
    localStorage.setItem('macro-railroad-editor-theme', editorTheme);
    if (aceEditor) {
        aceEditor.setTheme(editorTheme);
    }
    document.getElementById('editor-theme').value = editorTheme;
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

function handleWindowResize() {
    const { editorArea } = getEditorResizeElements();
    if (!editorArea) return;
    applyEditorHeight(editorArea.getBoundingClientRect().height, false);
}

function handleUrlParam() {
    const m = new URLSearchParams(location.search).get('m');
    if (m) aceEditor.setValue(m, -1);
}

async function handleCopySvg() {
    const svg = document.querySelector('#output svg');
    if (!svg) {
        showToast('No diagram to copy — fix the macro syntax first');
        return;
    }
    await navigator.clipboard.writeText(svg.outerHTML);
    const btn = document.getElementById('copy-svg');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy SVG'; }, 1500);
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function handleSavePng() {
    const svg = document.querySelector('#output svg');
    if (!svg) {
        showToast('No diagram to export — fix the macro syntax first');
        return;
    }
    const scale = 2;
    const svgWidth = svg.getAttribute('width') || svg.getBoundingClientRect().width;
    const svgHeight = svg.getAttribute('height') || svg.getBoundingClientRect().height;
    const w = parseFloat(svgWidth) * scale;
    const h = parseFloat(svgHeight) * scale;
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        canvas.toBlob(pngBlob => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(pngBlob);
            const h3 = document.querySelector('#output h3');
            const backtickMatch = h3 && h3.textContent.match(/`([^`]+)`/);
            const macroName = backtickMatch ? backtickMatch[1] : 'macro_railroad';
            a.download = `${macroName}.png`;
            a.click();
            URL.revokeObjectURL(a.href);
        }, 'image/png');
    };
    img.src = url;
}

function wireEvents() {
    for (const id of ['opt_hide_internal', 'opt_preserve_groups', 'opt_fold_common_tails', 'opt_show_legend', 'opt_bright']) {
        document.getElementById(id).addEventListener('change', updateDiagram);
    }
    document.getElementById('copy-svg').addEventListener('click', handleCopySvg);
    document.getElementById('save-png').addEventListener('click', handleSavePng);
    document.getElementById('theme-toggle').addEventListener('click', handleThemeToggle);
    document.getElementById('toggle-options').addEventListener('click', handleToggleOptions);
    document.getElementById('editor-resize-handle').addEventListener('pointerdown', startEditorResize);
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
    // Diagram viewport: zoom + pan
    const diagramArea = document.getElementById('diagram-area');
    diagramArea.addEventListener('pointerdown', handleDiagramPointerDown);
    diagramArea.addEventListener('wheel', handleDiagramWheel, { passive: false });
    document.getElementById('zoom-in').addEventListener('click', () => zoomBy(ZOOM_STEP));
    document.getElementById('zoom-out').addEventListener('click', () => zoomBy(-ZOOM_STEP));
    document.getElementById('zoom-reset').addEventListener('click', resetView);

    window.addEventListener('resize', handleWindowResize);
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
