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