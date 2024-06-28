class FitDiv { // windowにFitするdiv要素
    constructor(children) {
        this._size = {
            w: van.state(document.body.clientWidth),
            h: van.state(document.documentElement.clientHeight),
        }
        this._children = van.state(children || [])
        //window.addEventListener('resize', async(e)=>this.resize())
        this._el = ()=>van.tags.div({style:()=>`box-sizing:border-box;width:${this.size.w.val};height:${this.size.h.val};padding:0;margin:0;overflow-y:auto;color:black;background-color:red;`}, 
            this._children.val,
        )
        console.log(this._size)
    }
    get el() { return this._el }
    get size() { return this._size }
    get children() { return this._children }
    resize() {
        this._size.w.val = document.body.clientWidth
        this._size.h.val = document.documentElement.clientHeight
        console.log(this._size)
    }

}
