/**
 * Created by kinneretzin on 11/26/14.
 */

var drawers = {
    app: appNodeDrawer,
    server: regularNodeDrawer,
    vm : regularNodeDrawer
}

var gap = 10;

var topology = {
    init: function() {
        this.svgWidth = $('#topologyContainer').innerWidth()-5;
        this.svgHeight = $('#topologyContainer').innerHeight()-5;
        this.maxHeight = this.svgHeight;
        this.maxWidth = this.svgWidth;

        // Define a moveToFront behavior for d3 svg components
        d3.selection.prototype.moveToFront = function() {
            // Goes over every item in te selection and reappends it to its parent, making it the last one
            // to be added - hence the one on 'top'
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        // Fix dimentions of topology if window was resized.
        var thi$ = this;
        $(window).resize(function() {
            thi$.updateTopologyDimensions();
        });
    },

    updateTopologyDimensions: function() {
        if (this.svg) {
            this.svgWidth = $('#topologyContainer').innerWidth()-5,
            this.svgHeight = $('#topologyContainer').innerHeight()-5;

            this.svg.attr("width", this.svgWidth)
                .attr("height", this.svgHeight);

            this.fitToView();
        }
    },

    fitToView: function() {
        if (this.zoom) {
            this.zoom.translate([0,0]);
            this.zoom.scale(1);

            this.zoom.event(this.svg);

            this.svg.attr('viewBox','0 0 '+this.maxWidth+' '+this.maxHeight)
        }

    },

    zoomed: function(){
        this.container.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    },

    zoomIn : function(event) {
        event.preventDefault();

        var scaleExtent = this.zoom.scaleExtent();

        if (scaleExtent[1] > this.zoom.scale() + 0.15 ) {
            this.zoom.scale(this.zoom.scale() + 0.15);
        } else {
            this.zoom.scale(scaleExtent[1]);
        }
        this.zoom.event(this.svg);
    },

    zoomOut: function(event) {
        event.preventDefault();

        var scaleExtent = this.zoom.scaleExtent();

        if (scaleExtent[0] < this.zoom.scale() - 0.15 ) {
            this.zoom.scale(this.zoom.scale() - 0.15);
        } else {
            this.zoom.scale(scaleExtent[0]);
        }
        this.zoom.event(this.svg);
    },

    draw : function(data) {
        this.data =data;
//        this._calcNodeLocations();

        this._updateMaxDimentions();

        this._renderMainContainer();

        this._drawNodes();

    },

    _updateMaxDimentions: function() {
        // TODO
    },
    _renderMainContainer: function(){
        this.svg = d3.select("#topologySVG")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)
            .attr('viewBox','0 0 '+this.maxWidth+' '+this.maxHeight)
            .attr('preserveAspectRatio', 'xMidYMid meet');// meet') //xMidYMid meet


        // Create the zoom behavior and attach it to the svg
        this.zoom = d3.behavior.zoom()
            .scaleExtent([0.2, 3])
            .on("zoom", _.bind(this.zoomed, this));
        this.svg.call(this.zoom);

        // Create the main container
        //var container = svg.append("g");
        this.container = d3.select(".topologyContainer");
    },

    _drawNodes: function() {
        this.nodes = this.data.nodes;
        this.nodeContainer = this.container.selectAll(".nodeContainer")
            .data(this.nodes,function(d) {return d.name})
            .enter()
            .append("svg:g").attr('class',function(d) {
                return d.type + " nodeContainer";
            });

        this._calcNodeSizes()
        this._drawNodeData();

        this._placeNodes();
    },

    _drawNodeData: function() {
        appNodeDrawer.draw(this.container.selectAll(".app.nodeContainer"));
        regularNodeDrawer.draw(this.container.selectAll(".server.nodeContainer,  .vm.nodeContainer"));
    },

    _calcNodeSizes: function() {
        var nodes = this.data.nodesTree;
        var thi$ = this;
        _.each(nodes, function (node) {
            thi$._calcNodeSizes_inner(node,null);
        });
    },

    _calcNodeSizes_inner: function (node,parent) {
        // If its the last node in the leaf use the default width
        if (!node.nodes || node.nodes.length == 0) {
            node.width = drawers[node.type].minNodeWidth;
            node.height = drawers[node.type].minNodeHeight;

            this._setNodeBuffers(node,parent);

            node.totalWidth = node.width + node.bufferLeft + node.bufferRight;
            node.totalHeight = node.height + node.bufferTop + node.bufferBottom;

        } else {
            var thi$ = this;

            var childsWidth = 0;
            var maxChildHeight = 0;
            _.each(node.nodes, function (child) {
                thi$._calcNodeSizes_inner(child,node);

                var currClientTotalHeight = child.totalHeight;
                var currClientTotalWidth = child.totalWidth + gap;
                if (currClientTotalHeight > maxChildHeight) {
                    maxChildHeight = currClientTotalHeight;
                }
                childsWidth += currClientTotalWidth;
            });

            thi$._setNodeBuffers(node,parent);

            node.width = drawers[node.type].minNodeWidth > childsWidth ? drawers[node.type].minNodeWidth : childsWidth ;
            node.height = drawers[node.type].minNodeHeight> maxChildHeight ? drawers[node.type].minNodeHeight : maxChildHeight ;
            node.totalWidth = node.width + node.bufferLeft + node.bufferRight;
            node.totalHeight = node.height + node.bufferTop + node.bufferBottom;

        }
    },

    _setNodeBuffers: function(node, parent){
        // Calc the buffer according to the parent
        if (parent != null) {
            node.bufferTop =drawers[parent.type].contentOffsetTop || 0;
            node.bufferLeft = drawers[parent.type].contentOffsetLeft || 0;
            node.bufferBottom = drawers[parent.type].contentOffsetBottom || 0;
            node.bufferRight = drawers[parent.type].contentOffsetRight || 0;
        } else {
            node.bufferTop = 0;
            node.bufferLeft = 0
            node.bufferBottom = 0;
            node.bufferRight = 0
        }
    },
    _placeNodes : function() {
        var startX = 20;
        var startY = 20 ;

        var x = startX;
        var y = startY;

        this._placeNodesInner(this.data.nodesTree,x , y, startX, true);

        this.nodeContainer.attr("transform", function(d) {
            return "translate(" + d.xLoc + "," + d.yLoc + ")";
        });

    },
    _placeNodesInner: function(nodes,x, y,topLevel) {
        var thi$ = this;

        var maxRowHeight = 0;
        var initialX = x;
        _.each (nodes, function(node){
            if (topLevel && x> thi$.maxWidth) {
                x = initialX;
                y = y + maxRowHeight + gap;
            }

            node.xLoc = x + node.bufferLeft;
            node.yLoc = y + node.bufferTop;

            thi$._placeNodesInner(node.nodes,node.xLoc + gap, node.yLoc);

            if (maxRowHeight < (node.height + node.bufferTop)) {
                maxRowHeight = node.height + node.bufferTop;
            }
            x += node.width +node.bufferLeft + gap;
        });

    }
}