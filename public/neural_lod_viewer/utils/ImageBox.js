/*!
    ImageBox.js
    Copyright (c) 2016 Jan Novak <novakj4@gmail.com> and Benedikt Bitterli <benedikt.bitterli@gmail.com>
    Released under the MIT license

    Permission is hereby granted, free of charge, to any person obtaining a copy of this
    software and associated documentation files (the "Software"), to deal in the Software
    without restriction, including without limitation the rights to use, copy, modify,
    merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
    permit persons to whom the Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be included in all copies
    or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

    The wheelzoom class is based on code written by Jack Moore.
    The original source code is released under the MIT license
    and can be found at http://www.jacklmoore.com/wheelzoom.
*/
var screenWidth = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var screenHeight = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

//var imageBoxSettings = {
//    zoom: 0.1,
//    width: screenWidth * 0.6,
//    height: screenHeight * 0.6
//};

var num_lods = methods.length;
var num_scenes = scenes.length;

window.wheelzoom = (function(){
    console.log("whaaaat")

    var canvas = document.createElement('canvas');

    var main = function(img, settings){
        if (!img || !img.nodeName || img.nodeName !== 'IMG') { return; }

        var width;
        var height;
        var previousEvent;
        var cachedDataUrl;

        function setSrcToBackground(img, hack) {
            img.style.backgroundImage = 'url("'+img.src+'")';
            img.style.backgroundRepeat = 'no-repeat';
            canvas.width = settings.width;
            canvas.height = settings.height;

            // First need to determine whether we need to resize the image. If
            // so, we want to preserve the aspect ratio and make sure the whole
            // image fits in the screen

            
            // canvas.height = Math.max(settings.height, img.naturalHeight);
            cachedDataUrl = canvas.toDataURL();
            img.src = cachedDataUrl;
            if (!hack) {
                img.bgOffset = (canvas.width - img.bgWidth)/2;
                img.style.backgroundSize = img.bgWidth+'px '+img.bgHeight+'px';
                img.style.backgroundPosition = img.bgOffset + img.bgPosX+'px '+img.bgPosY+'px';
            }
        }

        function updateBgStyle() {
            if (img.bgPosX > 0) {
                img.bgPosX = 0;
            } else if (img.bgPosX < img.imWidth - img.bgWidth) {
                img.bgPosX = img.imWidth - img.bgWidth;
            }

            if (img.bgPosY > 0) {
                img.bgPosY = 0;
            } else if (img.bgPosY < height - img.bgHeight) {
                img.bgPosY = height - img.bgHeight;
            }

            img.style.backgroundSize = img.bgWidth+'px '+img.bgHeight+'px';
            img.style.backgroundPosition = img.bgOffset + img.bgPosX+'px '+img.bgPosY+'px';
        }

        function reset() {
            img.bgWidth = img.imWidth;
            img.bgHeight = img.imHeight;
            img.bgPosX = img.bgPosY = 0;
            updateBgStyle();
        }

        function onwheel(e) {
            var deltaY = 0;

            e.preventDefault();

            if (e.deltaY) { // FireFox 17+ (IE9+, Chrome 31+?)
                deltaY = -e.deltaY;
            } else if (e.wheelDelta) {
                deltaY = e.wheelDelta;
            }

            // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
            // We have to calculate the target element's position relative to the document, and subtrack that from the
            // cursor's position relative to the document.
            var rect = img.getBoundingClientRect();
            var offsetX = e.pageX - rect.left - window.pageXOffset - img.bgOffset;
            var offsetY = e.pageY - rect.top - window.pageYOffset;

            // Record the offset between the bg edge and cursor:
            var bgCursorX = offsetX - img.bgPosX;
            var bgCursorY = offsetY - img.bgPosY;

            // Use the previous offset to get the percent offset between the bg edge and cursor:
            var bgRatioX = bgCursorX/img.bgWidth;
            var bgRatioY = bgCursorY/img.bgHeight;

            // Update the bg size:
            if (deltaY < 0) {
                img.bgWidth += img.bgWidth*settings.zoom;
                img.bgHeight += img.bgHeight*settings.zoom;
            } else {
                img.bgWidth -= img.bgWidth*settings.zoom;
                img.bgHeight -= img.bgHeight*settings.zoom;
            }

            // Take the percent offset and apply it to the new size:
            img.bgPosX = offsetX - (img.bgWidth * bgRatioX);
            img.bgPosY = offsetY - (img.bgHeight * bgRatioY);

            // Prevent zooming out beyond the starting size
            if (img.bgWidth <= img.imWidth || img.bgHeight <= img.imHeight) {
                reset();
            } else {
                updateBgStyle();
            }
        }

        function drag(e) {
            e.preventDefault();
            img.bgPosX += (e.pageX - previousEvent.pageX);
            img.bgPosY += (e.pageY - previousEvent.pageY);
            previousEvent = e;
            updateBgStyle();
        }

        function removeDrag() {
            document.removeEventListener('mouseup', removeDrag);
            document.removeEventListener('mousemove', drag);
        }

        // Make the background draggable
        function draggable(e) {
            e.preventDefault();
            previousEvent = e;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', removeDrag);
        }

        function load() {
            if (img.src === cachedDataUrl) return;

            if (img.bgWidth === undefined) {
                if (img.naturalHeight > settings.height || img.naturalWidth > settings.width) {
                    if (Math.abs(canvas.settings - img.naturalWidth) > 
                    Math.abs(settings.height - img.naturalHeight)) {
                        img.imWidth = settings.width;
                        var scalingRatio = canvas.width / img.naturalWidth;
                        img.imHeight = img.naturalHeight * scalingRatio;
                    } else {
                        img.imHeight = settings.height;
                        var scalingRatio = settings.height / img.naturalHeight;
                        img.imWidth = img.naturalWidth * scalingRatio;
                    }
                } else {
                    img.imWidth = img.naturalWidth;
                    img.imHeight = img.naturalHeight;
                }
                
                img.imWidth /= 3;// = 640;
                img.imHeight /= 3;// = 360;

                img.bgWidth = img.imWidth;
                img.bgHeight = img.imHeight;
                img.bgPosX = 0;
                img.bgPosY = 0;

                img.style.backgroundSize     = img.bgWidth+'px '+img.bgHeight+'px';
                img.style.backgroundPosition = img.bgPosX+' '+img.bgPosY;

                setSrcToBackground(img, false);

                //img.addEventListener('wheelzoom.reset', reset);
                img.addEventListener('wheel', onwheel);
                img.addEventListener('mousedown', draggable);
            } else {
                setSrcToBackground(img, true);
            }
        }

        var destroy = function (originalProperties) {
            img.removeEventListener('wheelzoom.destroy', destroy);
            img.removeEventListener('wheelzoom.reset', reset);
            img.removeEventListener('load', load);
            img.removeEventListener('mouseup', removeDrag);
            img.removeEventListener('mousemove', drag);
            img.removeEventListener('mousedown', draggable);
            img.removeEventListener('wheel', onwheel);

            img.style.backgroundImage = originalProperties.backgroundImage;
            img.style.backgroundRepeat = originalProperties.backgroundRepeat;
            img.src = originalProperties.src;
        }.bind(null, {
            backgroundImage: img.style.backgroundImage,
            backgroundRepeat: img.style.backgroundRepeat,
            src: img.src
        });

        img.addEventListener('wheelzoom.destroy', destroy);

        if (img.complete) {
            load();
        }

        img.addEventListener('load', load);
    };

    // Do nothing in IE8
    if (typeof window.getComputedStyle !== 'function') {
        return function(elements) {
            return elements;
        };
    } else {
        return function(elements, settings) {
            if (elements && elements.length) {
                Array.prototype.forEach.call(elements, main, settings);
            } else if (elements && elements.nodeName) {
                main(elements, settings);
            }
            return elements;
        };
    }
}());


var ImageBox = function(parent, config) {
    var self = this;

    var box = document.createElement('div');
    box.className = "image-box";

    var h1 = document.createElement('h1');
    h1.className = "title";
    h1.appendChild(document.createTextNode("Images"));
    box.appendChild(h1);

    var help = document.createElement('div');
    help.appendChild(document.createTextNode("Use mouse wheel to zoom in/out, click and drag to pan. Press keys [1], [2], ... to switch between individual LoDs, [E] to see the FLIP error and [S] to swap between the reference and our approach."));
    help.className = "help";
    box.appendChild(help);

    this.idx = 0;
    this.tree = [];
    this.selection = [];
    this.buildTreeNode(config, 0, this.tree, box,-1);

    for (var i = 0; i < this.selection.length; ++i) {
        this.selection[i] = 0;
    }
    this.showContent(0, 0,false);
    parent.appendChild(box);

    document.addEventListener("keypress", function(event) { self.keyPressHandler(event); });
}

ImageBox.prototype.buildTreeNode = function(config, level, nodeList, parent, scene_idx) {

    var self = this;

    var selectorGroup = document.createElement('div');
    selectorGroup.className = "selector-group level-" + level;

    parent.appendChild(selectorGroup);

    var insets = [];

    for (var i = 0; i < config.length; i++) {

        // Create tab
        var selector = document.createElement('div');
        selector.className = "selector selector-primary";
        // selector.className += (i == 0) ? " active" : "";

        selector.addEventListener("click", function(l, idx, event) {
            this.idx = idx;
            this.showContent(l, idx);
        }.bind(this, level, i));

        // Add to tabs
        selectorGroup.appendChild(selector);

        //if (i == 4 && level > 0) {
        //    let fakeSelector = document.createElement('div');
        //    fakeSelector.className = "selector selector-primary";
        //    selectorGroup.appendChild(document.createElement("br"));
        //    selectorGroup.appendChild(fakeSelector);
        //}

        // Create content
        var contentNode = {};
        contentNode.children = [];
        contentNode.selector = selector;

        var content;
        if (typeof(config[i].elements) !== 'undefined') {
            // Recurse, with an emphasis on "curse"
            content = document.createElement('div');
            content.style.margin = 'auto';
            this.buildTreeNode(config[i].elements, level+1, contentNode.children, content,i);
            selector.appendChild(document.createTextNode(config[i].title));
        } else {

            // Create image
            content = document.createElement('img');
            content.className = "image-display pixelated";
            content.src = config[i].image;
            wheelzoom(content, imageBoxSettings);
            var key = '';
            if (i < 9)
                key = i+1 + ": ";
            else if (i == 9)
                key = "0: ";

            selector.appendChild(document.createTextNode(key + config[i].title));
            this.selection.length = Math.max(this.selection.length, level+1);
            
            for (var j = 0; j < num_lods; j++) {

                // Create insets ref/lod/error
                for (var l = 0; l < 3; l++) {
                    var inset = document.createElement('img');
                    inset.className = "inset pixelated";
                    if (l == 0){
                        inset.style.backgroundImage = "url('" + config[i].image + "')";
                        inset.name = config[i].title + " LoD " + j + " scene " + scene_idx;
                    }else if (l==1){
                        inset.style.backgroundImage = "url('" + config[i].ref_image + "')";
                        inset.name = config[i].title + " Ref " + j + " scene " + scene_idx;
                    }else{
                        inset.style.backgroundImage = "url('" + config[i].error_image + "')";
                        inset.name = config[i].title + " Error " + j + " scene " + scene_idx;

                    }
                    
                    inset.style.backgroundRepeat = "no-repeat";
                    inset.style.border = "0px solid black";
                    inset.style.width  = (imageBoxSettings.width / 7)-2 + "px";

                    inset.style.height =
                        (imageBoxSettings.width / 7)
                        * (halfInset ? 0.496 : 1)
                    + "px";
                    
                    var canvas = document.createElement("canvas");
                    cachedDataUrl = canvas.toDataURL();
                    inset.src = cachedDataUrl;
                    insets.push(inset);
                }
            }

            content.addEventListener("mousemove", function(content, insets, event) {
                this.mouseMoveHandler(event, content, insets);
            }.bind(this, content, insets));
            content.addEventListener("wheel", function(content, insets, event) {
                this.mouseMoveHandler(event, content, insets);
            }.bind(this, content, insets));

        }
        content.style.display = 'none';
        content.style.width = imageBoxSettings.width + 'px';
        parent.appendChild(content);
        contentNode.content = content;
        nodeList.push(contentNode);
    }

    if (insets.length > 0) {
        var insetGroup = document.createElement('div');
        insetGroup.className = "insets-group" ;
        insetGroup.width = imageBoxSettings.width;
        
        for (var i = 0; i < insets.length; ++i) {
            var bottomInset = false;//i == 2 || i == 4;
            var halfInset = false;//i >= 1;//(i >= 1 && i <= 3) || bottomInset;
            var auxDiv = document.createElement('div');

            var parts = insets[i].name.split(' ');

            var scene_index = parts[5];
            var type = parts[2];
            var lod = parts[3];
            // console.log("scene_index",scene_index);
            // console.log("lod",lod);
            // console.log("type",type);
            if(parts[1] == parts[3]){
                auxDiv.className = "insets" + " scene-" + scene_index + "-lod-" + lod;
            }else{
                auxDiv.className = "insets";
            }
            auxDiv.style.width = (imageBoxSettings.width / 7) + "px";
            auxDiv.style.display = 'none';
            if (type == "Error"){
                insets[i].name = "Flip Error" + " Lod " + lod; 
            }else{
                insets[i].name = type + " Lod " + lod; 
            }
            auxDiv.appendChild(document.createTextNode(insets[i].name)); 
            // auxDiv.appendChild(document.createTextNode(insets[i].name));
            auxDiv.appendChild(insets[i]);
            insetGroup.appendChild(auxDiv);
        }
        parent.appendChild(insetGroup);
    }
}

function coord_3d_to_1d(x, y, z, max_x, max_y, max_z) {
    let index = x + y * max_x + z * max_x * max_y;
    console.assert(index < max_x * max_y * max_z, 'index out of range');
    console.assert(x < max_x, 'x out of range');
    console.assert(y < max_y, 'y out of range');
    console.assert(z < max_z, 'z out of range');
    return index;
}


function coord_2d_to_1d(x, y, max_x) {
    let index = x + y * max_x ;
    return index;
}


ImageBox.prototype.showContent = function(level, idx, change, ohgod) {

    if(change){
        // Display only the required lod data
        // setTimeout(() => {
            
            let main_images = document.getElementsByClassName("image-display pixelated");

            for( var j= 0; j < main_images.length; j++){
                // console.log(main_images[j].src)

                /*if(main_images[j].src.includes("data:image/png;base64")){
                    main_images[j].src = main_images[j].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                    // main_images[j].src = main_images[j].src.replace(')"%22','');
                }*/

                //const typeRotation = ["lod", "ref", "error"]

                const prevURL = main_images[j].style.backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                let parts = prevURL.split("_")
                const oldType = parts[parts.length - 2]
                const newType = ohgod ?
                    (oldType == "error" ? "lod" : "error") :
                    (oldType == "lod" ? "ref" : "lod")
                    //typeRotation[(typeRotation.indexOf(oldType) + 1) % typeRotation.length]
                parts[parts.length - 2] = newType
                //console.log(oldType, newType)

                // console.log(filename)

                //main_images[j].src = parts.join("_")
                main_images[j].style.backgroundImage = 'url("'+parts.join("_")+'")';

                //console.log(main_images[j].style.backgroundImage)
                //console.log(main_images[j].src)

                
                // content.className = "image-display pixelated";
                // main_images[j].src = config[i].image;
            }
        
        // }, 0);
    }

    if (change) return

    // Hide
    var bgWidth = 0;
    var bgHeight = 0;
    var bgPosX = 0;
    var bgPosY = 0;
    var bgOffset = 0;
    var l = 0;
    var node = {};
    node.children = this.tree;
    while (node.children.length > 0 && node.children.length > this.selection[l]) {
        node = node.children[this.selection[l]];
        node.selector.className = 'selector selector-primary';
        node.content.style.display = 'none';
        if (l == this.selection.length - 1) {
            bgWidth =   node.content.bgWidth;
            bgHeight =  node.content.bgHeight;
            bgPosX =    node.content.bgPosX;
            bgPosY =    node.content.bgPosY;
            bgOffset =  node.content.bgOffset;
            values = l;
        }
        l += 1;
    }

    this.selection[level] = Math.max(0, idx);

    // Show
    l = 0;
    node = {};
    node.children = this.tree;
    while (node.children.length > 0) {
        if (this.selection[l] >= node.children.length)
            this.selection[l] = node.children.length - 1;
        node = node.children[this.selection[l]];
        node.selector.className = 'selector selector-primary active';
        node.content.style.display = 'block';
        if (l == this.selection.length - 1) {
            node.content.bgWidth = bgWidth;
            node.content.bgHeight = bgHeight;
            node.content.bgPosX = bgPosX;
            node.content.bgPosY = bgPosY;
            node.content.bgOffset = bgOffset;
            node.content.style.backgroundSize = bgWidth+'px '+bgHeight+'px';
            node.content.style.backgroundPosition = bgOffset + bgPosX+'px '+bgPosY+'px';
        }
        l += 1;
    }

    // Display only the required lod data
    setTimeout(() => {
        for (var i = 0; i < num_lods; ++i) {
            let lod_inset_group = document.getElementsByClassName("insets" + " scene-" + this.selection[0] + "-lod-" + i);
            // console.log(lod_inset_group)
            for( var j= 0; j < lod_inset_group.length; j++){
                if (i == idx){
                    lod_inset_group[j].style.display = 'inline-block';
                }else { 
                    lod_inset_group[j].style.display = 'none';
                }
            }
        }
    }, 0);
}

ImageBox.prototype.keyPressHandler = function(event) {
    var name = event.key;
    var code = event.code;
    // Alert the key name and key code on keydown
    // alert(`Key pressed ${name} \r\n Key code value: ${code}`);

    var swap_ref = event.key == 's';
    if(parseInt(event.key) >= 0 && parseInt(event.key) < 10){
        this.idx = parseInt(event.key) - 1;
    }

    const whatamidoingwithmylife = event.key == 'e';
    
    const closeliness = whatamidoingwithmylife || swap_ref
    this.showContent(this.selection.length-1, this.idx, closeliness,whatamidoingwithmylife);
}

ImageBox.prototype.mouseMoveHandler = function(event, image, insets) {
    var rect = image.getBoundingClientRect();
    var xCoord = ((event.clientX - rect.left) - image.bgOffset - image.bgPosX)   / (image.bgWidth  / image.imWidth);
    var yCoord = ((event.clientY - rect.top)  - image.bgPosY)                    / (image.bgHeight / image.imHeight);

    var scale = 4;
    for (var i = 0; i < insets.length; ++i) {
        insets[i].style.backgroundSize = (image.imWidth * scale) + "px " + (image.imHeight*scale) + "px";
        insets[i].style.backgroundPosition = (insets[i].width/2  - xCoord*scale) + "px "
                                           + (insets[i].height/2 - yCoord*scale) + "px";
    }
}
