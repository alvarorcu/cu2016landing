(function() {
    "use strict";
    var firebase = new Firebase("https://cu2016.firebaseio.com");

    function createUser(code, email, pass) {
        firebase.createUser({
                email: email,
                password: pass
            }, function(error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                            console.log("The new user account cannot be created because the email is already in use.");
                            $("#email").parent().append('<span class="error">Este correo electrónico ya está siendo utilizado</span>');
                            $("#email").parent().addClass('inputError');
                            break;
                        case "INVALID_EMAIL":
                            console.log("The specified email is not a valid email.");
                            break;
                        default:
                            console.log("Error creating user:", error);
                    }
                } else {
                    console.log("Successfully created user account with uid:", userData.uid);
                    coderef.set(false);
                    var email = $('#email').val();
                    var pass = $('#password').val();
                    var name = $('#name').val();
                    var alias = $('#alias').val();
                    var date = $('#date').val();
                    var dataRef = firebase.child("data");
                    dataRef.child(userData.uid).set({
                        full_name: name,
                        email: email,
                        born_date: date,
                        alias: alias
                    });
                    window.location.href = "login.html";
                }
            }

        );
    };

    $('#cuRegistration').submit(function() {
        console.log("summiting");
        $(this).find('.error').remove();
        $('.inputError').removeClass('inputError');
        var hasError = false;

        $(this).find("input[required]").each(function() {
            if ($.trim($(this).val()) == '') {
                var labelText = $(this).data("content");
                console.log(labelText);
                $(this).parent().append('<span class="error">Por favor, ingrese su ' + labelText + '</span>');
                $(this).parent().addClass('inputError');
                hasError = true;
            } else if ($(this).data('content') == "e-mail") {
                console.log('mail weona');
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!emailReg.test($.trim($(this).val()))) {
                    var labelText = $(this).prev('label').text();
                    $(this).parent().append('<span class="error">Ha ingresado un ' + labelText + ' inválido</span>');
                    $(this).parent().addClass('inputError');
                    hasError = true;
                }
            }
        });


        window.location.href = "index.html";
        return false;
    });
})();
