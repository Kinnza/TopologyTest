/**
 * Created by kinneretzin on 12/1/14.
 */

var regularNodeDrawer = {
    draw: function (selection) {

        var circleRadius = 15;

//        selection
//            .append("svg:rect")
//            .attr('class','')
//            .attr("width", function(d) { return d.width })
//            .attr("height",function(d) { return d.height})
//            .style("fill", function(d) {return 'rgb(225, 232, 236)';})
//            .style('stroke',"red");

        selection
            .append("svg:rect")
            .attr('class','nodeRect nodeObject')
            .attr("width", function(d) { return d.width - 10})
            .attr("height",function(d) { return d.height - 20})
            //.style("stroke-linejoin", "round")
            .style("fill", function(d) {return 'rgb(225, 232, 236)';})
            .attr('rx','5')
            .attr('ry','5')
            .attr('x',5)
            .attr('y',5)

        selection
            .append("svg:circle")
            .attr('class','icon')
            .attr("r", function(d) { return circleRadius;})
            .style("fill", function(d) {return 'rgb(225, 232, 236)';})
            .attr('cx',function(d) { return circleRadius ;})
            .attr('cy',function(d) { return circleRadius ;})

        selection.append("svg:text")
            .attr('class','title')
            //.attr('clip-path',"url(#nodeNameClip)")
            .attr('x', circleRadius + 20)
            .attr('y',circleRadius + 5)
            .text(function(d) { return d.name + "("+ d.type +" )"; })
            .text(function(d){
                return utils.limitTextLength(this,topologyConfig[d.type].maxTextLength);
            });
    }
}
