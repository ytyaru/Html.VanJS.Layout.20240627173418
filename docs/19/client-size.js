(function(){
class ClientSize {
    constructor(children) {
        window.addEventListener('DOMContentLoaded', async(event) => {
            this._size = {
                w: van.state(document.body.clientWidth),
                h: van.state(document.documentElement.clientHeight),
            }
            window.addEventListener('resize', async(e)=>this.resize())
        })
    }
    resize() {
        this._size.w.val = document.body.clientWidth
        this._size.h.val = document.documentElement.clientHeight
        console.log(this._size)
    }
    get w() { return this._size.w.val }
    get h() { return this._size.h.val }
    get vScrollbarBlockSize() { return window.innerWidth - document.body.clientWidth }
    get hSscrollbarBlockSize() { return window.innerHeight - document.body.clientHeight }
    get hasVScrollbar() { return 0 < this.vScrollbarBlockSize }
    get hasHScrollbar() { return 0 < this.hScrollbarBlockSize }
}
window.clientSize = new ClientSize()
})()
