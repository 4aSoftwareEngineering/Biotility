$(document).ready(function() {
    $('body').on('click', '#next.btn', function() {
        var hasError = angular.element("#quizError").scope().$parent.hasError;
        var isDone = angular.element("#quizError").scope().$parent.isDone;

        //Clear radio btn.
        if (!hasError && !isDone) {
            setTimeout(function() {
                $('input[type="radio"]').prop('checked', false);
            }, 35);
        }
    });
});