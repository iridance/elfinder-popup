/*
 * elFinder popup Extention
 * Version 0.5.0 (2016-11-30)
 * Author Irice
 */
function popup()
{
    if (!window.elfinder) {
        window.elfinder = {
            instance: [],
            getFileCallback: function(childWindow, files){
                var reg = new RegExp('(?:[\?&]|&amp;)index=([^&]+)', "i");
                var match = childWindow.location.search.match(reg);
                var index = (match && match.length > 1) ? match[1] : null;
                //console.log(index, files);
                if (index && files) {
                    window.elfinder.instance[index].getFileCallback(files);
                    childWindow.close();
                }
            }
        };
    }
    this.index = null;
    this.width = 1280;
    this.height = 720;
    this.url = location.protocol + '//' + location.hostname + '/finder/browse';
    this.param = 'scrollbars=1,resizable=0,location=0';//,toolbar=0,menubar=0,status=0 //window.open options
    this.popup = function(){
        var instance = window.elfinder.instance;
        this.index = instance.length;
        this._window = window.open(
            this.url + '?index=' + this.index,
            'elfinder' + this.index,
            'width=' + this.width + ',height=' + this.height + ',' + this.param
        );
        instance.push(this);
    };
}

function elfinderPopup(opt)
{
    var handler = {
        get:function(obj, prop){
            if(prop === 'getFileCallback'){
                //console.log('isget');
                window.elfinder.instance.splice(this.index, 1);
                return obj._callback;
            } else if (prop in obj){
                return obj[prop];
            }
        },
        set:function(obj, prop, val){
            if(prop === 'getFileCallback'){
                //console.log('isset');
                obj._callback = val;
                return;
            } else if (prop in obj){
                obj[prop] = val;
                return;
            }
        }
    };
    var instance = new Proxy(new popup(), handler);
    if(opt){
        for(var key in opt){
            instance[key] = opt[key];
        }
    }
    return instance;
}