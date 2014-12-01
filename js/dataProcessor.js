/**
 * Created by kinneretzin on 11/26/14.
 */

var dataProcessor = {
    buildhierarchicalData: function (data) {
        var result =  {
            nodesTree: [
                {
                    name: "node1",
                    type: "vm",
                    nodes: [
                        {
                            name: "node1-1",
                            type: "server",
                            nodes: [
                                {
                                    name: "node1-1-0",
                                    type: "server",
                                    nodes: [
                                        {
                                            name: "node1-1-1-1",
                                            type: "app"
                                        }
                                    ]
                                },
                                {
                                    name: "node1-1-1",
                                    type: "app"
                                },
                                {
                                    name: "node1-1-2",
                                    type: "app"
                                }
                            ]

                        },
                        {
                            name: "node1-2",
                            type: "server",

                            nodes: [
                                {
                                    name: "node1-2-1",
                                    type: "app"
                                },
                                {
                                    name: "node1-2-2",
                                    type: "app"
                                },
                                {
                                    name: "node1-2-3",
                                    type: "app"
                                },
                                {
                                    name: "node1-2-4",
                                    type: "app"
                                }
                            ]

                        },
                    ]
                },
                {
                    name: "node2",
                    type: "vm",
                    nodes: [
                        {
                            name: "node2-1",
                            type: "server",
                            nodes: [
                                {
                                    name: "node2-1-1",
                                    type: "app"
                                },
                                {
                                    name: "node2-1-2",
                                    type: "app"
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "node3",
                    type: "vm"
                }
            ],
            links: [

            ],
            nodes: []
        }

        this._flatNodes(result.nodesTree,result.nodes);
        return result;
    },

    _flatNodes: function(tree,nodes) {
        var thi$ = this;
        _.each(tree, function(node){
            nodes.push(node);
            if (node.nodes) {
                thi$._flatNodes(node.nodes,nodes);
            }
        });
    },

    _processNode: function (node) {
        if (!node.nodes || node.nodes.length == 0) {
            node.depth = 1;
        } else {
            var thi$ = this;

            var maxDepth = 0;
            _.each(node.nodes, function (child) {
                thi$._processNode(child,node);
                if (child.depth > maxDepth) {
                    maxDepth = child.depth;
                }
            });
            node.depth = 1 + maxDepth;
        }
    },
    _processNode1: function (node,parent) {
        if (!node.nodes || node.nodes.length == 0) {
            node.depth = 1;
            node.width = topologyConfig[node.type].nodeWidth;
            node.height = topologyConfig[node.type].nodeHeight;
            var bufferTop = 0;
            var bufferLeft = 0;
            if (parent != null) {
                bufferTop = topologyConfig[parent.type].contentOffsetY || 0;
                bufferLeft = topologyConfig[parent.type].contentOffsetX || 0;
            }
            node.bufferTop = bufferTop;
            node.bufferLeft = bufferLeft;

        } else {
            var thi$ = this;

            var maxDepth = 0;
            var childsWidth = 0;
            var maxChildHeight = 0;
            _.each(node.nodes, function (child) {
                thi$._processNode(child,node);
                if (child.depth > maxDepth) {
                    maxDepth = child.depth;
                }

                var currClientTotalHeight = child.height + topologyConfig.gap + child.bufferTop;
                var currClientTotalWidth = child.width + topologyConfig.gap + child.bufferLeft;
                if (currClientTotalHeight > maxChildHeight) {
                    maxChildHeight = currClientTotalHeight;
                }
                childsWidth += currClientTotalWidth;
                //childsHeight += child.height + topologyConfig.gap;
            });
            var bufferTop = 0;
            var bufferLeft = 0;
            if (parent != null) {
                bufferTop = topologyConfig[parent.type].contentOffsetY || 0;
                bufferLeft = topologyConfig[parent.type].contentOffsetX || 0;
            }
            node.depth = 1 + maxDepth;
            node.width = topologyConfig[node.type].nodeWidth > childsWidth + topologyConfig.gap ? topologyConfig[node.type].nodeWidth : childsWidth + topologyConfig.gap ;
            node.height = topologyConfig[node.type].nodeHeight > maxChildHeight  + topologyConfig.gap ? topologyConfig[node.type].nodeHeight : maxChildHeight  + topologyConfig.gap ;
            node.bufferTop = bufferTop;
            node.bufferLeft = bufferLeft;

        }
    },

    process: function (data) {
        var nodes = data.nodesTree;
        var thi$ = this;
        _.each(nodes, function (node) {
            thi$._processNode(node);
        });

        _.sortBy(nodes,function(node) {
            return node.depth;
        });

    }
};