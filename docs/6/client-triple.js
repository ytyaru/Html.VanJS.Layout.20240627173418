class ClientTriple { // windowのclientにFitするdiv要素
    constructor(children) {
        this._children = van.state(children || [])
        this._columns = van.state(`48% 4% 48%`)
        this._rows = van.state(`100%`)
//        this._el = ()=>van.tags.div({style:()=>this.#style()}, 
        //this._el = ()=>van.tags.div({style:()=>`box-sizing:border-box;width:${clientSize.w};height:${clientSize.h};padding:0;margin:0;overflow-y:auto;color:black;background-color:red;`}, 
//            this._children.val,
//        )
        this._el = van.tags.div({style:()=>this.#style()})
        console.log(this._size)
    }
    get el() { return this._el }
    get first() { return this._el.children.item(0) }
    get last () { return this._el.children.item(1) }
    get menu () { return this._el.children.item(2) }
    set first(el) { this.#setChild(el, 0) }
    set menu (el) { this.#setChild(el, 1) }
    set last (el) { this.#setChild(el, 2) }
    #setChild(el, i) {
        if (this._el.children.length < i) { throw new Error(`first,menu,lastの順にセットしてください。`) }
        if (i===this._el.children.length) { this._el.appendChild(el) }
        else { this._el.children.item(i).remove(); this._el.insertBefore(el, this._el.children.item(i-1)) }
    }
//    get children() { return this._children }
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
