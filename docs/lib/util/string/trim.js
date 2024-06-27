String.prototype.trimLine = function() { return this.replace(/^\n*|\n*$/g, '') }
String.prototype.trimAny = function(s) { return this.replace(new RegExp('^' + s + '+|' + s + '+$', 'g'), '') }
