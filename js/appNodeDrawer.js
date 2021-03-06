/**
 * Created by kinneretzin on 12/1/14.
 */

var appNodeDrawer = {
    minNodeWidth: 55,
    minNodeHeight: 70,
    "maxTextLength" : 55,
    "contentOffsetLeft" : 0,
    "contentOffsetTop" : 0,
    "contentOffsetRight" : 0,
    "contentOffsetBottom" : 0,

    draw: function (selection) {
        var thi$ = this;
        var circleRadius = (this.minNodeWidth - 20) / 2;
        selection
            .append("svg:circle")
            .attr('class','nodeRect nodeObject')
            .attr("r", function(d) { return circleRadius;})
            .style("fill", function(d) {return 'rgb(225, 232, 236)';})
            .attr('cx',function(d) { return circleRadius  + 7;})
            .attr('cy',function(d) { return circleRadius ;})

        selection.append("svg:text")
            .attr('class','title')
            .attr('x',0)
            .attr('y',function(d) { return circleRadius*2 + 15} )
            .text(function(d) { return d.name; })
            .text(function(d){
                return utils.limitTextLength(this,thi$.maxTextLength);
            });

    }
}