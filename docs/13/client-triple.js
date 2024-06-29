(function(){
class ClientTriple { // windowのclientにFitするdiv要素
    constructor(children) {
        this._columns = van.state(`48% 4% 48%`)
        this._rows = van.state(`100%`)
        this._childs = ['red','green','blue'].map((c,i)=>new InDiv((0===i) ? children : null, c, 1===i))
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
        this.menu.writingMode[`set${(isLandscape) ? 'Vertical' : 'Horizontal'}`]()
//        this.#setFontSize(uiWidth)
    }
    /*
    #getFontSize(uiWidth) {                       // 一行40字迄。字間0.05em（1字間／20字）の場合で計算
        const lineOfChars = uiWidth / 16
        if (lineOfChars <= 30) { return 16 }      //      〜480px（  〜30字）
        else if (lineOfChars <= 42) { return 18 } // 481px〜672px（25〜35字）
        else { return uiWidth / 42 }              // 673px〜     （    40字）
    }
    #setFontSize(uiWidth) { document.querySelector(':root').style.setProperty('--font-size', `${this.#getFontSize(uiWidth)}px`); console.log('--font-size:', `${this.#getFontSize(uiWidth)}px`); }
    */
}
class InDiv {
    constructor(children, col, isMin) {
        this._wm = new CssWritingMode()
        this._fs = new CssFontSize(null, this._wm, isMin)
        this._children = van.state(children || [])
        this._el = van.tags.div({
                style:()=>`width:100%;height:100%;border:0;overflow:auto;${this.#minStyle()}background-color:${col};${this._wm.css}${this._fs.css}`,
                onwheel:(e)=>this.#onWheel(e), 
            }, 
            ()=>van.tags.div(this._children.val))
        this._fs.el = this._el
        // 初期フォントサイズ設定用
//        setTimeout(()=>this._wm.toggle(), 10)
//        setTimeout(()=>this._wm.toggle(), 50)
    }
    get el() { return this._el }
    get children() { return this._children.val }
    set children(v) { if (Array.isArray(v)) this._children.val = v }
    get writingMode() { return this._wm }
    #minStyle() { return (this.isMin) ? `letter-spacing:0;line-height:1em;` : '' }
    #onWheel(e) { // 縦書き時マウスホイールで横スクロールできるようにする
        if (this._wm.isVertical) {
            if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            this._el.scrollLeft += e.deltaY;
            e.preventDefault();
        }
    }
//    get #style(){return `width:100%;height:100%;border:0;overflow:auto;background-color:${col};${this._wm.css}${this._fs.css}`}
}
// サイズ：https://hccbe.com/Misc/ElePosSiz/
class CssFontSize {
    //constructor(el, wm, isMin=false) { this._el = el; this._wm = wm; this.isMin = isMin }
    constructor(el, wm, isMin=false) { this._el = van.state(el); this._wm = wm; this.isMin = isMin }
    calc() {
        if (this.isMin) { return 16 }
        const lineOfChars = this.#inlineSize / 16
        if (lineOfChars <= 30) { return 16 }      //      〜480px（  〜30字）
        else if (lineOfChars <= 42) { return 18 } // 481px〜672px（25〜35字）
        else { return this.#inlineSize / 42 }           // 673px〜     （    40字）
    }
    //set el(v) { this._el = v }
    get el( ) { return this._el.val }
    set el(v) { this._el.val = v }
    get css() { return `font-size:${this.calc()}px;` }
    get #size() { return this.#toIb(...this.#clientWh) }
    #toIb(w, h) { // return [inline, block]
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #inlineSize() { return this.#toIb(...this.#clientWh)[0] }
    get #blockSize() { return this.#toIb(...this.#clientWh)[1] }
    /*
    get #inlineSize() { return this.#toIb(...this.#wh)[0] - this.#toIb(...this.#scrollWh)[0] }
    get #blockSize() { return this.#toIb(...this.#wh)[1] - this.#toIb(...this.#scrollWh)[1] }
//    get #inlineSize() { return this.#toIb(...this.#wh)[0] }
//    get #blockSize() { return this.#toIb(...this.#wh)[1] }
    get #wh() {
        if (this._el) {
//            const r = this._el.getBoundingClientRect()
//            return [r.width, r.height] // === offset === client + scroll + border
        } else { return [document.body.clientWidth, document.documentElement.clientHeight] }
    }
    //get size() { return this.#ib }
    get #ib() {
        const [w, h] = this.#wh
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #inlineSize() { return this.#ib[0] }
    get #blockSize() { return this.#ib[1] }
    */
    get #offsetWh() { // client + scroll + border === getBoundingClientRect()
        //if (this._el) { return [this._el.offsetWidth, this._el.offsetHeight] }
        if (this.el) { return [this.el.offsetWidth, this.el.offsetHeight] }
        else { return [document.documentElement.offsetWidth, document.documentElement.offsetHeight] }
    }
    get #clientWh() {
        //if (this._el) { return [this._el.clientWidth, this._el.clientHeight] }
        if (this.el) { return [this.el.clientWidth, this.el.clientHeight] }
        else { return [document.documentElement.clientWidth, document.documentElement.clientHeight] }
    }
    get #scrollWh() {
        const [ow, oh] = this.#offsetWh
        const [cw, ch] = this.#clientWh
        return [ow-cw, oh-ch];
    }
    /*
    get #clientIb() {
        const [w, h] = this.#clientWh
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #offsetIb() {
        const [w, h] = this.#offsetWh
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #scrollIb() {
        const [w, h] = this.#offsetWh
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #clientSize() {
        const [w, h] = this.#wh
        const i = this._wm.isHorizontal ? w : h
        const b = this._wm.isHorizontal ? h : w
        return [i, b]
    }
    get #inlineScrollSize() {
        const i = 
        return
    }


  let clientWidth = table[0].clientWidth;
  let offsetWidth = table[0].offsetWidth;
  let scrollbarWidth = offsetWidth - clientWidth;

this.get(0).scrollHeight > this.innerHeight()
    */
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
