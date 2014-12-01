/**
 * Created by kinneretzin on 11/26/14.
 */

var topologyConfig = null;

$(function() {
    // Load config
    $.get('config/config.json', function(config) {
        topologyConfig = config;

        // Load data
        $.get( "data/data.json", function( result ) {
            console.log(result);

            // Build hierarchical data from
            var data = dataProcessor.buildhierarchicalData(result);

            // Calculate locations according to built data
            dataProcessor.process(data);

            // Draw
            topology.init();
            topology.draw(data);
        });

    });
});