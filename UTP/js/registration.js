(function() {
    "use strict";

    var firebase = new Firebase("https://cu2016.firebaseio.com");
    var testingPrefix = "";
    var normalizedPath = window.location.pathname.replace(".html","").replace(testingPrefix, "");
    var searchPath = window.location.search.replace("?next=","").replace(testingPrefix, "");
    searchPath = (searchPath == "")?searchPath:searchPath + ".html";


    function UserRegistration(data) {
        firebase.createUser({
                email: data.email,
                password: data.password
            }, function(error, userData) {
                if (error) {
                    switch (error.code) {
                        case "EMAIL_TAKEN":
                          $("#idEmail").parent().prepend( '<span class="error">Este correo electrónico ya está siendo utilizado</span>' );
                          $("#idEmail").parent().addClass( 'inputError' );
                          break;
                        case "INVALID_EMAIL":
                          $("#idEmail").parent().prepend( '<span class="error">El correo electrónico especificano es inválido.</span>' );
                          $("#idEmail").parent().addClass( 'inputError' );
                          break;
                        default:
                          $("#idEmail").parent().prepend( '<span class="error">Algo salió mal durante su registro. Por favor, complete el formulario nuevamente. Disculpe las molestias.</span>' );
                          break;
                    }
                } else {
                    var dataRef = firebase.child("data");
                    dataRef.child(userData.uid).set(data);
                    $("#cuRegistration").prepend( '<span class="form-control">Tus datos han sido ingresados exitosamente. Desde el 09 de enero podrás iniciar sesión y acceder a nuestro material.</span>' );
                    window.location.href = "index.html";
                }
            }
        );
    };

    $('#cuRegistration').submit(function() {
        $(this).find('.error').remove();
        $('.inputError').removeClass('inputError');
        var hasError = false;

        $(this).find("input[required]").each(function() {
            if ($.trim($(this).val()) == '') {
                var labelText = $(this).data("content");
                $(this).parent().prepend('<span class="error">Por favor, ingrese su ' + labelText + '</span>');
                $(this).parent().addClass('inputError');
                hasError = true;
            } else if ($(this).data('content') == "e-mail") {
                var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                if (!emailReg.test($.trim($(this).val()))) {
                    var labelText = $(this).prev('label').text();
                    $(this).parent().prepend('<span class="error">Ha ingresado un ' + labelText + ' inválido</span>');
                    $(this).parent().addClass('inputError');
                    hasError = true;
                }
            }
        });

        if(!hasError) {
            var formularyData = {
                name: $("#idName").val(),
                lastname: $("#idLastname").val(),
                birthday: $("#idBirthday").val(),
                email: $("#idEmail").val(),
                password: $("#idPassword").val(),
                frontend: $("#idFrontend").is(":checked"),
                backend: $("#idBackend").is(":checked"),
                electronics: $("#idElectronica").is(":checked"),
                algorithms: $("#idAlgoritmos").is(":checked"),
                android: $("#idAndroid").is(":checked")
            };

            UserRegistration(formularyData);
        }
        return false;
    });

    $('#cuLogin').submit(function(event) {
        event.preventDefault();
        $(this).find('.error').remove();
        $('.inputError').removeClass('inputError');

        firebase.authWithPassword({
                email: $("#idEmail").val(),
                password: $("#idPassword").val()
            }, function(error, authData) {
                if (error) {
                    $("#cuLogin").prepend('<span class="error black"><strong>La combinación de correo eletrónico y contraseña es  inválida. Por favor, revise sus credenciales.</strong></span>');
                    return false;
                } else {
                    window.location.href = "http://" + window.location.hostname + testingPrefix + searchPath;
                }
            }, {
                remember: "sessionOnly"
            }
        );
        return false;
    });

    function CheckLogin(){
        var authData = firebase.getAuth();

        var freePaths = ["/", "/index", "/detalles", "/nosotros", "/provincias", "/login", "/registro"];

        if (authData) {
            document.getElementById("login").text = "Entrenamiento"
            document.getElementById("login").href = "http://" + window.location.hostname + testingPrefix + "/entrenamiento.html";
        } else {
            if ( freePaths.indexOf(normalizedPath) == -1 ) {
              window.location.href = "http://" + window.location.hostname + testingPrefix + "/login.html?next=" + testingPrefix + normalizedPath;
            }
        }
    }

    CheckLogin();
})();
