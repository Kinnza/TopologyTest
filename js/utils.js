/**
 * Created by kinneretzin on 12/1/14.
 */

var utils = {

    limitTextLength: function (textComponent, maxSize) {
        //console.log('text: '+ textComponent.textContent);

        var currTextLength = textComponent.getComputedTextLength();
        var currNumberOfChars = textComponent.getNumberOfChars();
        /*    		console.log('text length: '+currTextLength);
         console.log('max length: '+maxSize);
         console.log('half length: '+textComponent.getSubStringLength(0,currTextLength/2));
         */
        while (currTextLength > maxSize) {
            currNumberOfChars--;
            currTextLength = textComponent.getSubStringLength(0, currNumberOfChars);
            // console.log('half is: '+currTextLength);
        }

        // console.log('returning with text length: '+currTextLength + ' characters: '+currNumberOfChars);
        return (currNumberOfChars < textComponent.getNumberOfChars() ?
            textComponent.textContent.substring(0, currNumberOfChars - 3) + '...' :
            textComponent.textContent
            );
    }

}

