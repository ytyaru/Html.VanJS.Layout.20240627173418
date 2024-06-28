(function(){
class ClientSize {
    constructor(children) {
        this._size = {
            w: van.state(document.body.clientWidth),
            h: van.state(document.documentElement.clientHeight),
        }
        window.addEventListener('resize', async(e)=>this.resize())
    }
    resize() {
        this._size.w.val = document.body.clientWidth
        this._size.h.val = document.documentElement.clientHeight
        console.log(this._size)
    }
    get w() { return this._size.w.val }
    get h() { return this._size.h.val }
}
window.clientSize = new ClientSize()
})()
