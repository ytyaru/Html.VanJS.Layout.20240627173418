(function(){
class ClientTriple { // windowのclientにFitするdiv要素
    constructor(children) {
        this._columns = van.state(`48% 4% 48%`)
        this._rows = van.state(`100%`)
        this._childs = ['red','green','blue'].map((c,i)=>new InDiv((0===i) ? children : null, c))
        this._el = van.tags.div({style:()=>this.#style()},
            ()=>this._childs[0].el,
            ()=>this._childs[1].el,
            ()=>this._childs[2].el,
        )
        van.derive(()=>this.resize())
    }
    get el() { return this._el }
    get first() { return this._childs[0] }
    get menu() { return this._childs[1] }
    get last() { return this._childs[2] }
    #style() { return `display:grid;grid-template-columns:${this._columns.val};grid-template-rows:${this._rows.val};` }
    resize(width=0, height=0) {
//        if (0===width) { width = document.documentElement.clientWidth }
//        if (0===height) { height = document.documentElement.clientHeight }
        if (0===width) { width = clientSize.w }
        if (0===height) { height = clientSize.h }
        const isLandscape = (height <= width)
        const menuBlockSize = 16
        const uiWidth = (isLandscape) ? ((width - menuBlockSize) / 2) : width
        const uiHeight = (isLandscape) ? height : ((height - menuBlockSize) / 2)
        const landscapeSizes = [`${uiWidth}px ${menuBlockSize}px ${uiWidth}px`, `${uiHeight}px`]
        const portraitSizes = [`${uiWidth}px`, `${uiHeight}px ${menuBlockSize}px ${uiHeight}px`]
        const sizes = (isLandscape) ? landscapeSizes : portraitSizes
        this._columns.val = sizes[0]
        this._rows.val = sizes[1]
//        this.#setFontSize(uiWidth)
    }
}
class InDiv {
    constructor(children, col) {
        this._wm = new CssWritingMode ()
        this._children = van.state(children || [])
        this._el = van.tags.div({
                style:()=>`width:100%;height:100%;overflow:auto;background-color:${col};${this._wm.css}`,
                onwheel:(e)=>this.#onWheel(e), 
            }, 
            ()=>van.tags.div(this._children.val))
    }
    get el() { return this._el }
    get children() { return this._children.val }
    set children(v) { if (Array.isArray(v)) this._children.val = v }
    get writingMode() { return this._wm }
    #onWheel(e) { // 縦書き時マウスホイールで横スクロールできるようにする
        if (this._wm.isVertical) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            this._el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
}
class CssWritingMode {
    constructor() {
        this._writingMode = van.state('horizontal-tb')
        this._textOrient = van.state('mixed')
    }
    get css() { return `${this.#writingMode}${this.#textOrient}` }
    get #writingMode() { return `writing-mode:${this._writingMode.val};` }
    get #textOrient() { return `text-orientation:${this._textOrient.val};` }
    get isVertical() { return 'vertical-rl'===this._writingMode.val }
    get isHorizontal() { return 'horizontal-tb'===this._writingMode.val }
    get label() { return this.isHorizontal ? '横' : '縦' }
    toggle() { this.isHorizontal ? this.setVertical() : this.setHorizontal() }
    setHorizontal() {
        this._writingMode.val = 'horizontal-tb'
        this._textOrient.val = 'mixed'
    }
    setVertical() {
        this._writingMode.val = 'vertical-rl'
        this._textOrient.val = 'upright'
    }
}
window.ClientTriple = ClientTriple
})()
