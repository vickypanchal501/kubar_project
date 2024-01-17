/*global $, document, window, setTimeout, navigator, console, location*/
$(document).ready(function () {

    'use strict';

    var usernameError = true,
        emailError    = true,
        passwordError = true,
        passConfirm   = true;

    // Detect browser for css purpose
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.form form label').addClass('fontSwitch');
    }

    // Label effect
    $('input').focus(function () {

        $(this).siblings('label').addClass('active');
    });

    // Form validation
    $('input').blur(function () {

        // User Name
        if ($(this).hasClass('name')) {
            if ($(this).val().length === 0) {
                $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
                usernameError = true;
            } else if ($(this).val().length > 1 && $(this).val().length <= 3) {
                $(this).siblings('span.error').text('Please type at least 6 characters').fadeIn().parent('.form-group').addClass('hasError');
                usernameError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                usernameError = false;
            }
        }
        // Email
        if ($(this).hasClass('email')) {
            if ($(this).val().length == '') {
                $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
                emailError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                emailError = false;
            }
        }

        // PassWord
        if ($(this).hasClass('pass')) {
            if ($(this).val().length < 3) {
                $(this).siblings('span.error').text('Please type at least 8 charcters').fadeIn().parent('.form-group').addClass('hasError');
                passwordError = true;
            } else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                passwordError = false;
            }
        }

        // PassWord confirmation
        if ($('.pass').val() !== $('.passConfirm').val()) {
            $('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn().parent('.form-group').addClass('hasError');
            passConfirm = false;
        } else {
            $('.passConfirm').siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
            passConfirm = false;
        }

        // label effect
        if ($(this).val().length > 0) {
            $(this).siblings('label').addClass('active');
        } else {
            $(this).siblings('label').removeClass('active');
        }
    });
    $('a.switch1').click(function (e) {
        $(this).toggleClass('active');
        e.preventDefault();

        if ($('a.switch1').hasClass('active')) {
            $(this).parents('.reg-form').addClass('switched').siblings('.reg-form').removeClass('switched');
        } else {
            $(this).parents('.reg-form').removeClass('switched').siblings('.reg-form').addClass('switched');
        }
    });
    $('a.switch').click(function (e) {
        $(this).toggleClass('active');
        e.preventDefault();

        if ($('input.switch').hasClass('active'))  {
            $(this).parents('.signup-otp').addClass('switched').siblings('.signup-otp').removeClass('switched');
        } else {
            $(this).parents('.signup-otp').removeClass('switched').siblings('.signup-otp').addClass('switched');
        }
    });


    $('form.signup-form').submit(function (event) {
        event.preventDefault();
        if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
            $('.name, .email, .pass, .passConfirm').blur();
        } else {
            // $('.signup, .otp').addClass('switched');

            // setTimeout(function () { $('.signup, .otp').hide(); }, 700);
            // setTimeout(function () { $('.brand').addClass('active'); }, 300);
            // setTimeout(function () { $('.heading').addClass('active'); }, 600);
            // setTimeout(function () { $('.success-msg p').addClass('active'); }, 900);
            // setTimeout(function () { $('.success-msg a').addClass('active'); }, 1050);
            // setTimeout(function () { $('.form').hide(); }, 700);
            $('button.switch').click(function (e) {
                $(this).toggleClass('active');
                e.preventDefault();
        
                if ($('button.switch').hasClass('active'))  {
                    $(this).parents('.signup-otp').addClass('switched').siblings('.signup-otp').removeClass('switched');
                } else {
                    $(this).parents('.signup-otp').removeClass('switched').siblings('.signup-otp').addClass('switched');
                }
            });
        }
    });


    // Reload page
    $('a.profile').on('click', function () {
        location.reload(true);
    });

    $('form.otp-form').submit(function (event) {
        event.preventDefault();

        // Get the entered OTP value
        var enteredOTP = $('#otp').val();

        // Validate OTP format (numeric, 6 digits)
        var otpPattern = /^\d{6}$/;
        if (!otpPattern.test(enteredOTP)) {
            $('#otp').siblings('.error').text('Invalid OTP format').fadeIn().parent('.form-group').addClass('hasError');
            return;
        }

        // Add an AJAX call to the server to verify OTP
        $.ajax({
            url: '/api/verify-otp',
            method: 'POST',
            data: { otp: enteredOTP },
            success: function (response) {
                if (response.success) {
                    // OTP is verified, switch to Aadhar/PAN verification form
                    $('.otp').addClass('switched');
                    $('.verify').removeClass('switched');
                } else {
                    // OTP verification failed, display an error message
                    $('#otp').siblings('.error').text('Invalid OTP').fadeIn().parent('.form-group').addClass('hasError');
                }
            },
            error: function () {
                // Handle AJAX error
                console.error('Error verifying OTP');
            }
        });
    });

    // Handle Aadhar/PAN verification form submission
    $('form.verify-form').submit(function (event) {
        event.preventDefault();

        // Get the entered Aadhar and PAN details
        var adharNumber = $('#adharNumber').val();
        var panNumber = $('#panNumber').val();

        // Validate Aadhar format (numeric, 12 digits)
        var adharPattern = /^\d{12}$/;
        if (!adharPattern.test(adharNumber)) {
            $('#adharNumber').siblings('.error').text('Invalid Aadhar format').fadeIn().parent('.form-group').addClass('hasError');
            return;
        }

        // Validate PAN format (alphanumeric, 10 characters)
        var panPattern = /^[A-Za-z]{5}\d{4}[A-Za-z]$/;
        if (!panPattern.test(panNumber)) {
            $('#panNumber').siblings('.error').text('Invalid PAN format').fadeIn().parent('.form-group').addClass('hasError');
            return;
        }

        // Add an AJAX call to the server to verify Aadhar and PAN details
        $.ajax({
            url: '/api/verify-adhar-pan',
            method: 'POST',
            data: { adharNumber: adharNumber, panNumber: panNumber },
            success: function (response) {
                if (response.success) {
                    // Aadhar and PAN are verified, show success message
                    $('.verify').addClass('switched');
                    $('.success-msg').addClass('switched');
                } else {
                    // Aadhar/PAN verification failed, display an error message
                    $('#adharNumber, #panNumber').siblings('.error').text('Invalid Aadhar or PAN details').fadeIn().parent('.form-group').addClass('hasError');
                }
            },
            error: function () {
                // Handle AJAX error
                console.error('Error verifying Aadhar and PAN details');
            }
        });
    });


});

