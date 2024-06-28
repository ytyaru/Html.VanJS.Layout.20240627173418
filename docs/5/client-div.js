class ClientDiv { // windowのclientにFitするdiv要素
    constructor(children) {
        this._children = van.state(children || [])
        this._el = ()=>van.tags.div({style:()=>`box-sizing:border-box;width:${clientSize.w};height:${clientSize.h};padding:0;margin:0;overflow-y:auto;color:black;background-color:red;`}, 
            this._children.val,
        )
        console.log(this._size)
    }
    get el() { return this._el }
    get children() { return this._children }
}
