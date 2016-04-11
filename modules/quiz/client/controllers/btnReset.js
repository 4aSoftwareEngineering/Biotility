"use strict";

$(document).ready(function() {
    $('body').on('click', '#next.btn', function() {
        var hasError = angular.element("#quizError").scope().$parent.hasError;
        var isDone = angular.element("#quizError").scope().$parent.isDone;
        var isMC = angular.element("#quizError").scope().$parent.isMultipleChoice;

        //Clear radio btn.
        if (!hasError && !isDone && isMC) {
            setTimeout(function() {
                $('input[type="radio"]').prop('checked', false);
            }, 35);
        }
    });
});