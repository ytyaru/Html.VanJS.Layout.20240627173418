class TextEditor {
    constructor(value='') {
        this._value = van.state(value)
        this._blocks = van.state([])
        this._lineCount = {
            hasWrap: {
                now: van.state(0), // scrollTop / line-height
                all: van.state(0), // scrollTop / line-height
            },
            newLine: van.state(0), // 改行コード数
            block: {
                now: van.state(0),   // 現テキストブロック位置
                all: van.state(0),   // 全テキストブロック数
            },
//            newLine: van.state(0), // 改行コード数
//            block: van.state(0),   // テキストブロック数
            client: van.state(0),  // clientHeight内で表示可能な行数
        }
        this.#makeEl()
    }
    get el() { return this._el }
    get value( ) { return this._value.val }
    set value(v) { this._value.val = v }
    get blocks( ) { return this._blocks.val }
    set blocks(v) { this._blocks.val = v }
    #makeEl() {
        this._el = van.tags.textarea({
            style:()=>`width:100%;height:100%;resize:none;box-sizing:border-box;font-size:1rem;line-height:1.7rem;letter-spacing:0.05rem;`, 
            placeholder:'テキストエリア', 
            value:this.value,
            oninput:(e)=>{
                this.value = e.target.value, // 二連続改行で一パラグラフとするなら位置計算は簡単
                this.blocks = this.toBlocks(this.value)
                console.log(this.blocks)
                //this.#countBlock(e)
                this.#count(e)
            },
            onkeyup:(e)=>this.#count(e),
            onkeydown:(e)=>this.#count(e),
            onmouseup:(e)=>this.#count(e),
//            onkeyup:(e)=>this.#countBlock(e),
//            onkeydown:(e)=>this.#countBlock(e),
            onscroll:(e)=>{
                this.#countWrap(e)
                console.log('scroll:', e)
                //this.#scrollView()
//                this.#moveCaret(0, e.target.scrollTop)
            }
            /*
            onscroll:(e)=>{
                // スクロール最上位置の行数を取得する（折返しも一行とカウントされてしまう！）
                const top = e.target.scrollTop
                const lh = parsefloat(getComputedStyle(e.target).lineHeight)
                //const lh = e.target.scrollHeight / math.max(1, e.target.value.split('\n').length)
                console.log('top:', top, 'left:',e.target.scrollLeft)
                console.log('lineHeight:', lh)
                const lineNo = (0===top) ? 0 : Math.ceil(top / lh)
                console.log('lineNo:', lineNo)
            },
            */
        })
        van.derive(()=>this._lineCount.client.val=Math.floor(this.el.clientHeight/this.#getLineHeight()))
    }
    #count(e) {
        this.#countNewLine()
        this.#countBlock()
        //this.#scrollView(this._lineCount.block.now.val+1)
        this.#scrollView()
        //this.#scrollView(e)
    }
    #countNewLine() { this._lineCount.newLine.val = (this._el.value.match(/[\n]/gm) || []).length }
    //#countBlock() { this._lineCount.block.val = (this._el.value.match(/[\n]{2,}/gm) || []).length }
    #countBlock() {
        this._lineCount.block.all.val = (this._el.value.match(/[\n]{2,}/gm) || []).length
        this.#countBlockNow()
        console.log()
    }
    #countBlockNow() {
        const calletStr = this.value.substring(0, this.el.selectionStart) // 先頭からキャレット位置までの文字列
        this._lineCount.block.now.val = (calletStr.match(/[\n]{2,}/gm) || []).length; // 2つ以上連続した改行の数
    }
    #getLineHeight(el) { return parseFloat(getComputedStyle(el || this.el).lineHeight) }
    #countWrap(e) {
        const top = e.target.scrollTop
        //const lh = parseFloat(getComputedStyle(e.target).lineHeight)
        const lh = this.#getLineHeight(e.target)
        //const lh = e.target.scrollHeight / Math.max(1, e.target.value.split('\n').length)
        console.log('Top:', top, 'Left:',e.target.scrollLeft)
        console.log('lineHeight:', lh)
        const lineNo = (0===top) ? 0 : Math.ceil(top / lh)
        console.log('lineNo:', lineNo)
        this._lineCount.hasWrap.now.val = (0===top) ? 0 : Math.ceil(top / lh)
        this._lineCount.hasWrap.all.val = Math.ceil(e.target.scrollHeight / lh)
        console.log(`${this._lineCount.hasWrap.now.val}/${this._lineCount.hasWrap.all.val}`)
        console.log(`Top:${top}, Height:${e.target.scrollHeight}, ${top + e.target.clientHeight}, ${this.#isScrollTop}, ${this.#isScrollBottom}`)
//        this.#scrollView()
    }
    get #isScrollTop() { return 0===this.el.scrollTop }
    get #isScrollBottom() { return this.el.scrollHeight<=Math.ceil(this.el.scrollTop+this.el.clientHeight) }
//    #scrollView() { document.querySelector(`#viewer *:nth-child(${now})`).scrollIntoView() }
//    #scrollView() { document.querySelector(`#viewer *:nth-child(${this._lineCount.hasWrap.now.val})`).scrollIntoView() }
    //#scrollView(i) { console.log(i||this._lineCount.hasWrap.now.val);document.querySelector(`#viewer *:nth-child(${i || this._lineCount.hasWrap.now.val})`).scrollIntoView() }

    /*
    #getCaretPos() {
        const pos = getSelection().getRangeAt(0).getBoundingClientRect();
                    
                    
    }
    */
    /*
    #scrollView(i) {
//    #scrollView() {
//        const top = this.el.scrollTop
//        const blockIdx = this._lineCount.block.now.val+1 || this._lineCount.hasWrap.now.val
        console.log(i||this._lineCount.hasWrap.now.val)
        const el = document.querySelector(`#viewer *:nth-child(${i || this._lineCount.hasWrap.now.val})`)
        if (el) el.scrollIntoView()
    }
    */
    /*
    #scrollView() {
        const blockIdx = (0===this.el.scrollTop) ? 0 : (this._lineCount.block.now.val+1 || this._lineCount.hasWrap.now.val)
//        const blockIdx = this._lineCount.block.now.val+1 || this._lineCount.hasWrap.now.val
//        console.log(i||this._lineCount.hasWrap.now.val)
        const el = document.querySelector(`#viewer *:nth-child(${blockIdx})`)
        if (el) el.scrollIntoView()
    }
    */
    //#scrollView(e) {
    #scrollView() {
        const blockIdx = (0===this.el.scrollTop) ? 0 : (this._lineCount.block.now.val+1 || this._lineCount.hasWrap.now.val)
//        const blockIdx = this._lineCount.block.now.val+1 || this._lineCount.hasWrap.now.val
//        console.log(i||this._lineCount.hasWrap.now.val)
        const el = document.querySelector(`#viewer *:nth-child(${blockIdx})`)
//        if (el) el.scrollIntoView()
        //if (el) el.scrollIntoView({block:'center'})
        //if (el) el.scrollIntoView({block:'end'})
        if (this.#isScrollTop) { document.querySelector(`#client-triple-last`).scrollTo({top:0}) }
        else if (this.#isScrollBottom) { document.querySelector(`#client-triple-last`).scrollTo({top:this.el.scrollHeight - this.el.clientHeight}) }
        else {
            if (el) el.scrollIntoView()
            const caret = getCaretCoordinates(this.el, this.el.selectionStart)
            console.log(caret, `cliehtHeight:${this.el.clientHeight}`, `clientTop:${caret.top - this.el.scrollTop}`, `scrollTop:${this.el.scrollTop}`)
        }

        
        /*
        const caret = getCaretCoordinates(this.el, this.el.selectionStart)
        console.log(caret)
        //this.el.clientHeight

        const clientY = caret.top - this.el.scrollTop
        const scrollTopDiff = this.el.clientHeight - clientY
        const el = document.querySelector(`#viewer *:nth-child(${blockIdx})`)
        console.log(el, scrollTopDiff)
        //if (el) { el.scrollTo({top:el.offsetTop + scrollTopDiff, left:0}) }
        //if (el) { document.querySelector(`#viewer`).scrollTo({top:el.offsetTop + scrollTopDiff, left:0}) }
        if (el) { document.querySelector(`#client-triple-last`).scrollTo({top:el.offsetTop + scrollTopDiff, left:0}) }
        */
        //el.scrollBy({top:, left:})
        /*
        const pos = getSelection().getRangeAt(0).getBoundingClientRect();
        console.log(getSelection())
        console.log(getSelection().getRangeAt(0))
        console.log(pos)
        console.log('clientHeight', pos.height)
        */
    }
    #moveCaret(x, y) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        console.log(sel)
        console.log(document.caretRangeFromPoint(x, y))
        sel.addRange(document.caretRangeFromPoint(x, y));
    }
    /*
    #countBlock(e) {
        const v = e.target.value
        console.log(v, e.target.selectionStart)
        const calletStr = v.substring(0, e.target.selectionStart) // 先頭からキャレット位置までの文字列
        const now = (calletStr.match(/[\n]{2,}/gm) || []).length + 1; // 2つ以上連続した改行の数
        const all = (v.match(/[\n]{2,}/gm) || []).length + 1; // 2つ以上連続した改行の数
        console.log(now, calletStr)
        console.log(all, v)
        console.log(`ブロック数: ${now}/${all}`)

        // テキストエリアのスクロール先頭位置にあたるHTML要素を表示する
        console.log(triple.last.children.slice(-1)[0])
        console.log(triple.last.children.slice(-1)[0]())
        console.log(triple.last.children.slice(-1)[0]().children)
        console.log(triple.last.children.slice(-1)[0]().children[now-1])
        console.log([...triple.last.children.slice(-1)[0]().children][now-1])
        document.querySelector(`#viewer *:nth-child(${now})`).scrollIntoView()
    }
    */
    toBlocks(text) {
        if (0===text.trim().length) { return [] }
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')
        const blocks = []; let start = 0;
        for (let match of text.matchAll(/\n\n/gm)) {
            blocks.push(this.#trimLine(text.slice(start, match.index)))
            start = match.index + 2
        }
        blocks.push(this.#trimLine(text.slice(start)))
        return blocks.filter(v=>v)
    }
    #trimLine(s) { return s.replace(/^\n*|\n*$/g, '') }
}
