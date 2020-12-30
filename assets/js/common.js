var banks, companyTypes, bizNatures, professions, offcTypes, respPropertyValueTemplate, respIncomeValueTemplateApp, respIncomeValueTemplateCoApp, respEmiValue, temp, inHouseBreSalaried, inHouseBreSep, inHouseBreSenp, inHouseSalaried, inHouseSep, inHouseSenp, inHouseRetiredPen, inHouseRetiredNonPen, inHouseWife, inHouseStudent, totalMainIncome, totalOtherIncome, totalObligation, dataToPost, applicantsData, applicant, companyList
minIncome = 1000,
maxIncome = 999999999,
doPostQueue = $({}),
// var incomeFrequency = {1:"Monthly",3:"Quarterly",12:"Yearly"};
incomeNotToAdd = [5];
var addressFields = ['currentAddress', 'currentCountry', 'currentState', 'currentCity', 'currentRegion', 'currentPincode', 'currentResType', 'currentResidingSince', 'permanentAddress', 'permanentCountry', 'permanentState', 'permanentCity', 'permanentPincode', 'permanentResType', 'permanentResidingSince', 'companyId', 'companyName', 'attorneyAddress', 'attorneyCity', 'currentResStatus', 'currentResType', 'currentLandline', 'officeAddress', 'officeCity', 'officeCountry', 'officePincode', 'officeLandline', 'businessAddress', 'businessCity', 'businessCountry', 'businessPincode', 'businessLandline', 'profAddress', 'profCity', 'profCountry', 'profPincode', 'profLandline'];
$(window).load(function() {
    $('input').attr('autocomplete', 'off').attr('autocorrect', 'off').attr('spellcheck', 'off');
    countryFill();
});

$(document).on('ready',function(){
    $(document).on('change','.country-fill',function(){
        // console.log($(this).parent());
        if($(this).data('serial')){
            var city = $('.city-fill[data-serial='+$(this).data('serial')+']');
            var val = (city.data('value')) ? city.data('value') : city.val();
            city.html(populateCitiesfromCountry(val, $(this).val())).trigger("chosen:updated");
        }
    });
});
$(document).on('keyup','input[type=tel]',function(){
    var yourInput = $(this).val();
    re = /[a-z`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
    var isSplChar = re.test(yourInput);
    if(isSplChar)
    {
        var no_spl_char = yourInput.replace(/[a-z`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        $(this).val(no_spl_char);
    }
});
if (PAGE_NAME == "home") {
    $(window).scroll(function() {
        var wH = $(window).height();
        var wS = $(this).scrollTop();
        var classes = {
            ourPartners: 'banks/',
            customersBox: 'images/user/'
        };
        var imgUrl = APP_BASE_PATH + 'public/assets/';
        if (!DEBUG) {
            imgUrl = S3_BASE_PATH;
        }
        $.each(classes, function(k, v) {
            var hT = $('.' + k).offset().top - 50;
            var oH = $('.' + k).outerHeight();
            if ($('.' + k).length > 0) {
                if ((wS > hT) && (wS < (hT + oH))) {
                    $('.' + k + ' img').each(function() {
                        if (typeof $(this).attr('src') === 'undefined') {
                            $(this).attr('src', imgUrl + v + $(this).attr('alt').replace(/ /g, '-').toLowerCase() + ".jpg");
                        }
                    });
                }
            }
        });
    });
}
$('[class^="chosen-"]').on('chosen:showing_dropdown', function(evt, params) {
    $("input:focus").blur();
});
$('body').on('focus', '.chosen-search-input', function() {
    if (!$(this).closest('.chosen-container').hasClass('chosen-container-active')) $(this).closest('.chosen-container').trigger('mousedown');
});

function countryFill(ele = '') {
    // console.log(ele);
    if(ele){
        ele = ele.find('.country-fill');
    }else{
        ele = $('.country-fill');
    }
    // console.log(ele);
    ele.each(function(){
        var country = ($(this).data('value')) ? $(this).data('value') : $(this).val();
        $(this).html(generateCountryOptions(country)).trigger("chosen:updated");
        if(country){
            var city = ($('.city-fill[data-serial='+$(this).data('serial')+']').data('value')) ? $('.city-fill[data-serial='+$(this).data('serial')+']').data('value') : $('.city-fill[data-serial='+$(this).data('serial')+']').val();
            $('.city-fill[data-serial='+$(this).data('serial')+']').html(populateCitiesfromCountry(city, country)).trigger("chosen:updated");
        }
    });
}

function getDateObject(date, month, year) {
    var newDate = new Date();
    if (typeof date == 'undefined') {
        date = newDate.getDate();
    }
    if (typeof month == 'undefined') {
        month = newDate.getMonth();
    }
    if (typeof year == 'undefined') {
        year = newDate.getYear();
    }
    if (date.length == 1) {
        date = '0' + date;
    }
    if (month.length == 1) {
        month = '0' + month;
    }
    return new Date(month + '-' + date + '-' + year);
}

function verifyPersonalDetails() {
    var aadhaar = $('#userAadhaar').val();
    var name = $.trim($('#userName').val());
    var location = $('#userLocation').val();
    var email = $.trim($('#userEmail').val());
    var countryCode = $('#userCountryCode').val();
    var mobile = $('#userMobile').val();
    var ERROR = false;
    if (aadhaar != '' && !validateName(name)) {
        ERROR = true;
        inputErrorShow($('#userAadhaar'), Error.userAadhaar.error);
    } else {
        inputErrorHide($('#userAadhaar'));
    }
    if (name == '' || !validateName(name)) {
        ERROR = true;
        inputErrorShow($('#userName'), Error.userName.error);
    } else {
        inputErrorHide($('#userName'));
    }
    if (isNaN(location) || location == '' || location <= 0) {
        ERROR = true;
        inputErrorShow($('#userLocation'), Error.userLocation.error);
    } else {
        inputErrorHide($('#userLocation'));
    }
    if (email == '' || !validateEmail(email)) {
        ERROR = true;
        inputErrorShow($('#userEmail'), Error.userEmail.error);
    } else {
        inputErrorHide($('#userEmail'));
    }
    if (isNaN(countryCode) || countryCode == '' || countryCode <= 0) {
        ERROR = true;
        inputErrorShow($('#userCountryCode'), Error.userCountryCode.error);
    } else {
        inputErrorHide($('#userCountryCode'));
    }
    if (isNaN(mobile) || mobile == '' || !validateMobile(mobile)) {
        ERROR = true;
        inputErrorShow($('#userMobile'), Error.userMobile.error);
    } else {
        inputErrorHide($('#userMobile'));
    }
    return (!ERROR);
}

function verifyLoginDetails() {
    var mobile = $('#mobile').val();
    ERROR = false;
    if (!validateMobile(mobile) && !ERROR) {
        ERROR = true;
        $("#mobile").parents(".mdl-textfield").addClass('is-invalid');
    }
    if (ERROR) {
        return false;
    }
    return (validateMobile(mobile))
}

function verifyAddressDetails() {
    var pan = $.trim($('#userPAN').val());
    var dob = parseInt($('#userDobMM').val()) + '/' + parseInt($('#userDobDD').val()) + '/' + parseInt($('#userDobYY').val());
    var userGender = $.trim($('#userGender').val());
    var userAlternateCountryCode = $('#userAlternateCountryCode').val();
    var userAlternateMobile = $('#userAlternateMobile').val();
    var userFather = $.trim($('#userFather').val());
    var userAddress = $.trim($('#userAddress').val());
    var userCurrentCountry = $('#userCurrentCountry').val();
    var userCurrentState = $('#userCurrentState').val();
    var userCurrentCity = $('#userCurrentCity').val();
    var userCurrentPincode = $.trim($('#userCurrentPincode').val());
    var userCurrentResType = $('#userCurrentResType').val();
    var userCurrentResidingMM = $('#userCurrentResidingMM').val();
    var userCurrentResidingYY = $('#userCurrentResidingYY').val();
    var ERROR = false;
    if (!($('#userAddressSame').parents('label').hasClass('is-checked'))) {
        var isAddressSame = true;
        var userPermanentAddress = $.trim($('#userPermanentAddress').val());
        var userPermanentCountry = $('#userPermanentCountry').val();
        var userPermanentState = $('#userPermanentState').val();
        var userPermanentCity = $('#userPermanentCity').val();
        var userPermanentPincode = $.trim($('#userPermanentPincode').val());
        var userPermanentResType = $('#userPermanentResType').val();
        var userPermanentResidingMM = $('#userPermanentResidingMM').val();
        var userPermanentResidingYY = $('#userPermanentResidingYY').val();
    } else {
        var isAddressSame = false;
    }
    if (pan == '' || !validatePan(pan)) {
        ERROR = true;
        inputErrorShow($('#userPAN'), Error.userPAN.error);
    } else {
        inputErrorHide($("#userPAN"));
    }
    if (isNaN($('#userDobMM').val()) || isNaN($('#userDobDD').val()) || isNaN($('#userDobYY').val()) || !validateDate(dob)) {
        ERROR = true;
        inputErrorShow($('#userDobDD'), Error.userDob.error);
    } else {
        inputErrorHide($("#userDobDD"));
    }
    if (userGender == '' || userGender.length <= 0) {
        ERROR = true;
        inputErrorShow($('#userGender'), Error.userGender.error);
    } else {
        inputErrorHide($("#userGender"));
    }
    if (userAlternateCountryCode != '' && isNaN(userAlternateCountryCode)) {
        ERROR = true;
        inputErrorShow($('#userAlternateCountryCode'), Error.userCountryCode.error);
    } else {
        inputErrorHide($("#userAlternateCountryCode"));
    }
    if (userAlternateMobile != '' && !validateMobile(userAlternateMobile)) {
        ERROR = true;
        inputErrorShow($('#userAlternateMobile'), Error.userMobile.error);
    } else {
        inputErrorHide($("#userAlternateMobile"));
    }
    if (userFather == '' || !validateName(userFather)) {
        ERROR = true;
        inputErrorShow($('#userFather'), Error.userFather.error);
    } else {
        inputErrorHide($("#userFather"));
    }
    if (userAddress == '' || !validateAddress(userAddress)) {
        ERROR = true;
        inputErrorShow($('#userAddress'), Error.userAddress.error);
    } else {
        inputErrorHide($("#userAddress"));
    }
    if (userCurrentCountry == '' || isNaN(userCurrentCountry) || userCurrentCountry <= 0) {
        ERROR = true;
        inputErrorShow($('#userCurrentCountry'), Error.userCountry.error);
    } else {
        inputErrorHide($("#userCurrentCountry"));
    }
    if (userCurrentState == '' || isNaN(userCurrentState) || userCurrentState <= 0) {
        ERROR = true;
        inputErrorShow($('#userCurrentState'), Error.userState.error);
    } else {
        inputErrorHide($("#userCurrentState"));
    }
    if (userCurrentCity == '' || isNaN(userCurrentCity) || userCurrentCity <= 0) {
        ERROR = true;
        inputErrorShow($('#userCurrentCity'), Error.userCity.error);
    } else {
        inputErrorHide($("#userCurrentCity"));
    }
    if (userCurrentPincode != '' && !validatePin(userCurrentPincode)) {
        ERROR = true;
        inputErrorShow($('#userCurrentPincode'), Error.userPincode.error);
    } else {
        inputErrorHide($("#userCurrentPincode"));
    }
    if (userCurrentResType == '' || isNaN(userCurrentResType) || userCurrentResType <= 0) {
        ERROR = true;
        inputErrorShow($('#userCurrentResType'), Error.userResType.error);
    } else {
        inputErrorHide($("#userCurrentResType"));
    }
    if (isNaN(userCurrentResidingMM) || isNaN(userCurrentResidingYY) || !validateDate(parseInt(userCurrentResidingMM) + '/01/' + parseInt(userCurrentResidingYY))) {
        ERROR = true;
        inputErrorShow($('#userCurrentResidingMM'), Error.userResidingSince.error);
    } else if (!compareDate((parseInt(userCurrentResidingMM) + '/' + parseInt($('#userDobDD').val()) + '/' + parseInt(userCurrentResidingYY)), dob)) {
        ERROR = true;
        inputErrorShow($('#userCurrentResidingMM'), Error.userResidingSince.residingSince);
    } else {
        inputErrorHide($("#userCurrentResidingMM"));
    }
    if (isAddressSame) {
        if (userPermanentAddress == '' || !validateAddress(userPermanentAddress)) {
            ERROR = true;
            inputErrorShow($('#userPermanentAddress'), Error.userAddress.error);
        } else {
            inputErrorHide($("#userPermanentAddress"));
        }
        if (userPermanentCountry == '' || isNaN(userPermanentCountry) || userPermanentCountry <= 0) {
            ERROR = true;
            inputErrorShow($('#userPermanentCountry'), Error.userCountry.error);
        } else {
            inputErrorHide($("#userPermanentCountry"));
        }
        if (userPermanentState == '' || isNaN(userPermanentState) || userPermanentState <= 0) {
            ERROR = true;
            inputErrorShow($('#userPermanentState'), Error.userState.error);
        } else {
            inputErrorHide($("#userPermanentState"));
        }
        if (userPermanentCity == '' || isNaN(userPermanentCity) || userPermanentCity <= 0) {
            ERROR = true;
            inputErrorShow($('#userPermanentCity'), Error.userCity.error);
        } else {
            inputErrorHide($("#userPermanentCity"));
        }
        if (userPermanentPincode != '' && !validatePin(userPermanentPincode)) {
            ERROR = true;
            inputErrorShow($('#userPermanentPincode'), Error.userPincode.error);
        } else {
            inputErrorHide($("#userPermanentPincode"));
        }
        if (userPermanentResType == '' || isNaN(userPermanentResType) || userPermanentResType <= 0) {
            ERROR = true;
            inputErrorShow($('#userPermanentResType'), Error.userResType.error);
        } else {
            inputErrorHide($("#userPermanentResType"));
        }
        if (isNaN(userPermanentResidingMM) || isNaN(userPermanentResidingYY) || !validateDate(userPermanentResidingMM + '/01/' + userPermanentResidingYY)) {
            ERROR = true;
            inputErrorShow($('#userPermanentResidingMM'), Error.userResidingSince.error);
        } else if (!compareDate((parseInt(userPermanentResidingMM) + '/' + parseInt($('#userDobDD').val()) + '/' + parseInt(userPermanentResidingYY)), dob)) {
            ERROR = true;
            inputErrorShow($('#userPermanentResidingMM'), Error.userResidingSince.residingSince);
        } else {
            inputErrorHide($("#userPermanentResidingMM"));
        }
    }
    return (!ERROR);
}

function verifyCoAppDetails() {
    var coAppRelation = $('#coApplicantRelation').val();
    var coApplicantName = $('#coApplicantName').val();
    var coApplicantMobile = $('#coApplicantMobile').val();
    var coApplicantEmail = $('#coApplicantEmail').val();
    var coApplicantPAN = $('#coApplicantPAN').val();
    var coApplicantAadhaar = $('#coApplicantAadhaar').val();
    ERROR = false;
    if (coAppRelation == '') {
        ERROR = true;
        btnErrorShow($('#coApplicantRelation'), Error.coAppRelation.error);
    } else {
        btnErrorHide($('#coApplicantRelation'));
    }
    if (coAppRelation != 8 && coApplicantName == '') {
        ERROR = true;
        inputErrorShow($('#coApplicantName'), Error.coAppName.error);
    } else {
        inputErrorHide($('coApplicantName'));
    }
    if ($('#coApplicantDetails').parent('label').hasClass('is-checked')) {
        if (coAppRelation != 8 && coApplicantName != '' && coApplicantMobile == '' || coApplicantEmail == '' || coApplicantPAN == '' || coApplicantAadhaar == '') {
            ERROR = true;
            btnErrorShow($(this), Error.btnCoApplicant.error);
        }
    } else {
        btnErrorHide($(this));
    }
    return (!ERROR);
}

function verifyIHLCoAppDetails() {
    var coApplicantName = $.trim($('#coApplicantName').val());
    var coAppRelation = parseInt($('#coApplicantRelation').val());
    var coApplicantFather = $.trim($('#coApplicantFather').val());
    var coApplicantMobile = $.trim($('#coApplicantMobile').val());
    var coApplicantEmail = $.trim($('#coApplicantEmail').val());
    var coApplicantDob = parseInt($('#coApplicantDobMM').val()) + '/' + parseInt($('#coApplicantDobDD').val()) + '/' + parseInt($('#coApplicantDobYY').val());
    var coApplicantPAN = $.trim($('#coApplicantPAN').val());
    var coApplicantAadhaar = $.trim($('#coApplicantAadhaar').val());
    ERROR = false;
    if ($('#coApplicantAddressSame').parents('label').hasClass('is-checked')) {
        var coApplicantAddressSame = true;
    } else {
        var coApplicantAddressSame = false;
    }
    if (!validateName(coApplicantName)) {
        ERROR = true;
        inputErrorShow($('#coApplicantName'), Error.userName.error);
    } else {
        inputErrorHide($('coApplicantName'));
    }
    if (isNaN(coAppRelation)) {
        ERROR = true;
        inputErrorShow($('#coApplicantRelation'), Error.userRelation.error);
    } else {
        inputErrorHide($('#coApplicantRelation'));
    }
    if (coApplicantFather != '' && !validateName(coApplicantFather)) {
        ERROR = true;
        inputErrorShow($('#coApplicantFather'), Error.userFather.error);
    } else {
        inputErrorHide($('#coApplicantFather'));
    }
    if (coApplicantMobile != '' && !validateMobile(coApplicantMobile)) {
        ERROR = true;
        inputErrorShow($('#coApplicantMobile'), Error.userMobile.error);
    } else {
        inputErrorHide($('#coApplicantMobile'));
    }
    if (coApplicantEmail != '' && !validateEmail(coApplicantEmail)) {
        ERROR = true;
        inputErrorShow($('#coApplicantEmail'), Error.userEmail.error);
    } else {
        inputErrorHide($('#coApplicantEmail'));
    }
    if (($('#coApplicantDobMM').val() != '' || $('#coApplicantDobDD').val() != '' || $('#coApplicantDobYY').val() != '') && !(validateDate(coApplicantDob))) {
        ERROR = true;
        inputErrorShow($('#coApplicantDobDD'), Error.userDob.error);
    } else {
        inputErrorHide($('#coApplicantDobDD'));
    }
    if (coApplicantPAN != '' && !(validatePan(coApplicantPAN))) {
        ERROR = true;
        inputErrorShow($('#coApplicantPAN'), Error.userPAN.error);
    } else {
        inputErrorHide($('#coApplicantPAN'));
    }
    if (coApplicantAadhaar != '' && !(validateAadhar(coApplicantAadhaar))) {
        ERROR = true;
        inputErrorShow($('#coApplicantAadhaar'), Error.userAadhaar.error);
    } else {
        inputErrorHide($('#coApplicantAadhaar'));
    }
    if (!coApplicantAddressSame) {
        var coApplicantAddress = $.trim($('#coApplicantAddress').val());
        var coApplicantCurrentCountry = parseInt($('#coApplicantCurrentCountry').val());
        var coApplicantCurrentState = parseInt($('#coApplicantCurrentState').val());
        var coApplicantCurrentCity = parseInt($('#coApplicantCurrentCity').val());
        // var coApplicantCurrentPincode = $.trim($('#coApplicantCurrentPincode').val());
        var coApplicantCurrentResType = parseInt($('#coApplicantCurrentResType').val());
        if (coApplicantAddress == '' || !(validateAddress(coApplicantAddress))) {
            ERROR = true;
            inputErrorShow($('#coApplicantAddress'), Error.userAddress.error);
        } else {
            inputErrorHide($('#coApplicantAddress'));
        }
        if (isNaN(coApplicantCurrentCountry)) {
            ERROR = true;
            inputErrorShow($('#coApplicantCurrentCountry'), Error.userCountry.error);
        } else {
            inputErrorHide($('#coApplicantCurrentCountry'));
        }
        if (isNaN(coApplicantCurrentState)) {
            ERROR = true;
            inputErrorShow($('#coApplicantCurrentState'), Error.userState.error);
        } else {
            inputErrorHide($('#coApplicantCurrentState'));
        }
        if (isNaN(coApplicantCurrentCity)) {
            ERROR = true;
            inputErrorShow($('#coApplicantCurrentCity'), Error.userCity.error);
        } else {
            inputErrorHide($('#coApplicantCurrentCity'));
        }
        if (isNaN(coApplicantCurrentResType)) {
            ERROR = true;
            inputErrorShow($('#coApplicantCurrentResType'), Error.userResType.error);
        } else {
            inputErrorHide($('#coApplicantCurrentResType'));
        }
    }
    return (!ERROR);
}

function VerifyPAN(userPAN) {
    var apiUrl = environment() + '/verify-pan';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'data': userPAN
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            $('#btnPanVerify').addClass('btn1 loading');
            $('#btnPanVerify').attr('disabled', 'disabled');
        },
        success: function(res) {
            $('#btnPanVerify').removeAttr('disabled');
            $('#btnPanVerify').removeClass('btn1 loading');
            $('#panLoader').hide();
            console.log(res);
            if (!res['ERROR']) {
                res2 = $.parseJSON(res['RESPONSE_DATA']['RESPONSE_CODE']);
                if (res2['RESPONSE_CODE'] == '102') {
                    $("#btnPanVerify").hide();
                    $("#imgPanVerified").show();
                    $("#PANChk").html('&#9679; PAN<em class="icon-check"></em><span>Verified</span>');
                    $('#userName').prop('readonly', true);
                    $('#userName').prop('disabled', true).addClass('disabled');
                    $('#userPAN').prop('readonly', true);
                    $('#userPAN').prop('disabled', true);
                }
            } else {
                inputErrorShow($('#userPAN'), res['RESPONSE_DATA']['MESSAGE']);
                $('#PANChk').html('&#9679;<a href="javascript:void(0)"> PAN</a><span class="failure">! failure</span>');
            }
        },
        error: function(d) {
            $('#btnPanVerify').removeClass('btn1 loading');
            $('#panLoader').hide();
            console.log(d);
        }
    });
}

function verifyWorkDetails(div, applicantTypeId) {
    applicantTypeId = parseInt(applicantTypeId);
    var ERROR = false;
    if (applicantTypeId == '' || applicantTypeId <= 0 || isNaN(applicantTypeId)) {
        btnErrorShow(div, Error.applicantTypeId.missing);
        return false;
    }
    if (applicantTypeId == 1) {
        var occupationTypeId = parseInt($('#userOccupationTypeId').val());
        var empDiv = 'userOccupationTypeId';
    } else if (applicantTypeId == 2) {
        var occupationTypeId = parseInt($('#coAppOccupationTypeId').val());
        var empDiv = 'coAppOccupationTypeId';
    } else {
        btnErrorShow(div, Error.applicantTypeId.missing);
        return false;
    }
    if (occupationTypeId <= 0 || occupationTypeId == '' || isNaN(occupationTypeId)) {
        inputErrorShow($('#' + empDiv), Error.occupationTypeId.error);
        ERROR = true;
    } else {
        inputErrorHide($('#' + empDiv));
    }
    if (occupationTypeId == '1') {
        var companyName = $.trim($('#companyName-' + applicantTypeId).val());
        var workingSinceMM = parseInt($('#workingSinceMM-' + applicantTypeId).val());
        var workingSinceYY = parseInt($('#workingSinceYY-' + applicantTypeId).val());
        var workExpMM = $('#workExpMM-' + applicantTypeId).val();
        var workExpYY = $('#workExpYY-' + applicantTypeId).val();
        var salaryCreditIn = parseInt($('#salaryCreditIn-' + applicantTypeId).val());
        var officeAddress = $.trim($('#officeAddress-' + applicantTypeId).val());
        var officeContactNo = $.trim($('#officeContactNo-' + applicantTypeId).val());
        if (companyName == '' || !validateOccupationName(companyName)) {
            inputErrorShow($('#companyName-' + applicantTypeId), Error.companyName.error);
            ERROR = true;
        } else {
            inputErrorHide($('#companyName-' + applicantTypeId));
        }
        if (isNaN(workingSinceMM) || isNaN(workingSinceYY) || !validateDate(workingSinceMM + '/01/' + workingSinceYY)) {
            inputErrorShow($('#workingSinceMM-' + applicantTypeId), Error.workingSince.error);
            ERROR = true;
        } else {
            inputErrorHide($('#workingSinceMM-' + applicantTypeId));
        }
        if (!$.isNumeric(workExpMM) || !$.isNumeric(workExpYY)) {
            inputErrorShow($('#workExpYY-' + applicantTypeId), Error.workExp.error);
            ERROR = true;
        } else {
            var d1 = new Date(workingSinceYY + '/' + workingSinceMM + '/01');
            var d2 = new Date();
            if ((workExpYY < 120) && (monthDiff(d1, d2) - (parseInt(workExpMM) + parseInt(workExpYY)) > 0)) {
                inputErrorShow($('#workExpYY-' + applicantTypeId), Error.workExp.more);
                ERROR = true;
            } else {
                inputErrorHide($('#workExpYY-' + applicantTypeId));
            }
        }
        if (salaryCreditIn == '' || salaryCreditIn <= 0 || isNaN(salaryCreditIn)) {
            inputErrorShow($('#salaryCreditIn-' + applicantTypeId), Error.salaryCreditIn.error);
            ERROR = true;
        } else {
            inputErrorHide($('#salaryCreditIn-' + applicantTypeId));
        }
        if (officeAddress != '' && !(validateAddress(officeAddress))) {
            inputErrorShow($('#officeAddress-' + applicantTypeId), Error.userAddress.error);
            ERROR = true;
        } else {
            inputErrorHide($('#officeAddress-' + applicantTypeId));
        }
        if (officeContactNo != '' && isNaN(officeContactNo)) {
            inputErrorShow($('#officeContactNo-' + applicantTypeId), Error.officeContactNo.error);
            ERROR = true;
        } else {
            inputErrorHide($('#officeContactNo-' + applicantTypeId));
        }
    } else if (occupationTypeId == '2') {
        var businessName = $.trim($('#businessName-' + applicantTypeId).val());
        var bizConstitution = parseInt($('#bizConstitution-' + applicantTypeId).val());
        var bizHolding = $('#bizHolding-' + applicantTypeId).val();
        var bizNature = parseInt($('#bizNature-' + applicantTypeId).val());
        //var bizIndustry = parseInt($('#bizIndustry-'+applicantTypeId).val());
        var bizVintage = $('#bizVintage-' + applicantTypeId).val();
        var businessAddress = $.trim($('#businessAddress-' + applicantTypeId).val());
        var businessContactNo = $.trim($('#businessContactNo-' + applicantTypeId).val());
        if (businessName == '' || !validateOccupationName(businessName)) {
            inputErrorShow($('#businessName-' + applicantTypeId), Error.businessName.error);
            ERROR = true;
        } else {
            inputErrorHide($('#businessName-' + applicantTypeId));
        }
        if (bizConstitution == '' || bizConstitution <= 0 || isNaN(bizConstitution)) {
            inputErrorShow($('#bizConstitution-' + applicantTypeId), Error.bizConstitution.error);
            ERROR = true;
        } else {
            inputErrorHide($('#bizConstitution-' + applicantTypeId));
        }
        if (!validatePercentage(bizHolding) || isNaN(bizHolding)) {
            inputErrorShow($('#bizHolding-' + applicantTypeId), Error.bizHolding.error);
            ERROR = true;
        } else {
            inputErrorHide($('#bizHolding-' + applicantTypeId));
        }
        if (bizNature == '' || bizNature <= 0 || isNaN(bizNature)) {
            inputErrorShow($('#bizNature-' + applicantTypeId), Error.bizNature.error);
            ERROR = true;
        } else {
            inputErrorHide($('#bizNature-' + applicantTypeId));
        }
        /*if(bizIndustry == '' || bizIndustry <= 0 || isNaN(bizIndustry)){
            inputErrorShow($('#bizIndustry-'+applicantTypeId), Error.bizIndustry.error);
            ERROR = true;
        }else{
            inputErrorHide($('#bizIndustry-'+applicantTypeId));
        }*/
        if (!$.isNumeric(bizVintage)) {
            inputErrorShow($('#bizVintage-' + applicantTypeId), Error.bizVintage.error);
            ERROR = true;
        } else {
            inputErrorHide($('#bizVintage-' + applicantTypeId));
        }
        if (businessAddress != '' && !(validateAddress(businessAddress))) {
            inputErrorShow($('#businessAddress-' + applicantTypeId), Error.userAddress.error);
            ERROR = true;
        } else {
            inputErrorHide($('#businessAddress-' + applicantTypeId));
        }
        if (businessContactNo != '' && isNaN(businessContactNo)) {
            inputErrorShow($('#businessContactNo-' + applicantTypeId), Error.officeContactNo.error);
            ERROR = true;
        } else {
            inputErrorHide($('#businessContactNo-' + applicantTypeId));
        }
    } else if (occupationTypeId == '3') {
        var profName = parseInt($('#profName-' + applicantTypeId).val());
        var profOffcType = parseInt($('#profOffcType-' + applicantTypeId).val());
        var profPractisingSince = parseInt($('#profPractisingSince-' + applicantTypeId).val());
        var profAddress = $.trim($('#profAddress-' + applicantTypeId).val());
        var profContactNo = $.trim($('#profContactNo-' + applicantTypeId).val());
        if (profName == '' || profName <= 0 || isNaN(profName)) {
            inputErrorShow($('#profName-' + applicantTypeId), Error.profName.error);
            ERROR = true;
        } else {
            inputErrorHide($('#profName-' + applicantTypeId));
        }
        if (profOffcType == '' || profOffcType <= 0 || isNaN(profOffcType)) {
            inputErrorShow($('#profOffcType-' + applicantTypeId), Error.profOffcType.error);
            ERROR = true;
        } else {
            inputErrorHide($('#profOffcType-' + applicantTypeId));
        }
        if (profPractisingSince == '' || profPractisingSince <= 0 || isNaN(profPractisingSince) || $('#profPractisingSince-' + applicantTypeId).val().length != 4) {
            inputErrorShow($('#profPractisingSince-' + applicantTypeId), Error.profPractisingSince.error);
            ERROR = true;
        } else {
            inputErrorHide($('#profPractisingSince-' + applicantTypeId));
        }
        if (profAddress != '' && !(validateAddress(profAddress))) {
            inputErrorShow($('#profAddress-' + applicantTypeId), Error.userAddress.error);
            ERROR = true;
        } else {
            inputErrorHide($('#profAddress-' + applicantTypeId));
        }
        if (profContactNo != '' && isNaN(profContactNo)) {
            inputErrorShow($('#profContactNo-' + applicantTypeId), Error.officeContactNo.error);
            ERROR = true;
        } else {
            inputErrorHide($('#profContactNo-' + applicantTypeId));
        }
    }
    return (!ERROR);
}

function verifyIncomeDetails() {
    var userIncome = $('#userIncome').val();
    var userBonus = $('#userBonus').val();
    var userIncentive = $('#userIncentive').val();
    var userRentalIncome = $('#userIncentive').val();
    var otherIncome = $('#otherIncome').val();
    if (userIncome == '' && !ERROR) {
        ERROR = true;
        $("#userIncome").parents(".mdl-textfield").addClass('is-invalid');
    }
    if (userBonus == '' && !ERROR) {
        ERROR = true;
        $("#userBonus").parents(".mdl-textfield").addClass('is-invalid');
    }
    if (userIncentive == '' && !ERROR) {
        ERROR = true;
        $("#userIncentive").parents(".mdl-textfield").addClass('is-invalid');
    }
    if (userRentalIncome == '' && !ERROR) {
        ERROR = true;
        $("#userRentalIncome").parents(".mdl-textfield").addClass('is-invalid');
    }
    if ($('#chkAdditionalIncome').is(':checked')) {
        if (otherIncome == '' && !ERROR) {
            ERROR = true;
            $("#otherIncome").parents(".mdl-textfield").addClass('is-invalid');
        }
    }
    return (!ERROR);
}

function validateNumber(val) {
    if (val != "" && $.isNumeric(val)) {
        return true;
    }
    return false;
}

function validateEmail(email) {
    // var re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,3}$/;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.length > 0 && email.length <= 92) {
        return re.test(email);
    } else {
        return false;
    }
}

function validateName(name) {
    var re = /^[a-zA-Z ]+$/;
    return re.test(name);
}

function validateUserName(name) {
    var re = /^[a-zA-Z0-9_]+$/;
    return re.test(name);
}

function validateMobile(mobile) {
    var re = /^[0-9]{8,}$/;
    return re.test(mobile);
}

function validateAadhar(aadhar) {
    var re = /^[0-9]{12}$/;
    return re.test(aadhar);
}

function validatePin(pin) {
    //var re = /^[0-9]{6}$/;
    //return re.test(pin);
    //
    pin = pin.replace(/[^a-zA-Z0-9 ]/g, "");
    return (pin.length >= 2);
}

function validatePan(pan) {
    //Earlier Regex
    //var re = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/
    //Regex to implement 4th character checks
    var re = /^[A-Za-z]{3}[a|A|b|B|c|C|f|F|g|G|h|H|l|L|j|J|p|P|t|T|k|K]{1}[A-Za-z]{1}[0-9]{4}[A-Za-z]$/
    return re.test(pan);
}

function validatePercentage(value) {
    var intVal = parseFloat(value);
    var re = /^\d{1,3}(.\d{1,2})?$/
    return ((intVal > 0) && (intVal <= 100) && (re.test(value)));
}

function validateAddress(address) {
    //var re = /^[A-Za-z0-9., \/\-\(\)]+$/
    //return re.test(value);
    address = address.replace(/[^a-zA-Z0-9 ]/g, "");
    if (address.length > 0 && address.length <= 200) {
        return true;
    } else {
        return false;
    }
}

function validateOccupationName(value) {
    ///var re = /^[A-Za-z0-9., -&\/]+$/
    //return re.test(value);
    return true;
}

function validateOccupationExperience(currentDate) {
    console.log(currentDate);
}

function validateVoterId(value) {
    var re = /^[A-Z]{3}[0-9]{7}$/
    return re.test(value);
}

function validatePassport(value) {
    var re = /^[A-Z]{1}[0-9]{7}$/
    return re.test(value);
}
/*function validateDate(date) {
    return Date.parse(date);
}*/
function validateDate(date) {
    var comp = date.split('/');
    var m = parseInt(comp[0]);
    var d = parseInt(comp[1]);
    var y = parseInt(comp[2]);
    var yearLength = comp[2].length;
    var date = new Date(y, m - 1, d);
    return (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d && yearLength == '4')
}

function digits(number) {
    return number.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
}

function numberCommaSeparated(event, element) {
    if (element.val() <= 0) {
        element.val('');
    }
    if (event.which >= 37 && event.which <= 40) {
        return;
    }
    element.val().replace(',', '');
    element.val(function(index, value) {
        return value.replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
    });
}

function inrCurrency(n) {
    var x = n;
    x = x.toString();
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') lastThree = ',' + lastThree;
    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return res;
}
Number.prototype.countDecimals = function() {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    // console.log(amount);
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}
/*function goToCurrentTile(id){   
    var tid = parseInt(id)+1;
    $('#boxxx'+tid).css('display', 'block');
    $('.mainContainer .box:nth-child(2)').animate({
        scrollTop: $("#boxxx"+tid)[0].offsetTop-65
    }, 100);
}*/
/*function checkApplicationStage() {
    var div = '';
    if($('#hdnLoanTypeId').val() != '' && $('#hdnLoanTypeId').val() != 0){
        LOAN_TYPE_CHECK = true;
        var div = $('#hdnLoanTypeId');
        $("#"+div.parents('.tile').attr("id")).css('display', 'block');
    }
    if($('input[name=sliders]').val() != '' && $('input[name=sliders]').val() != 0){
        LOAN_AMNT_CHECK = true;
        var inWords = convertNumberToWords($('input[name=sliders]').val()); 
        $('#amountInWords').html(inWords);
        
        var div = $('input[name=sliders]');
        $("#"+div.parents('.tile').attr("id")).css('display', 'block');

    }
    if($('#hdnOccupationTypeId').val() != '' && $('#hdnOccupationTypeId').val() != 0){
        OCCUPATION_CHECK = true;
        var div = $('#hdnOccupationTypeId');
        $("#"+div.parents('.tile').attr("id")).css('display', 'block');
    }

    if($('#hdnPurposeId').val() != '' && $('#hdnPurposeId').val() != 0){
        LOAN_PURPOSE_CHECK = true;
        var div = $('#hdnPurposeId');
        $("#"+div.parents('.tile').attr("id")).css('display', 'block');
    }

    if(div != ''){
        slideDiv = div.parents('.tile').attr("data-tile");
       if(slideDiv == 1){
            setLoanAmnt();
       }
        goToCurrentTile(slideDiv);
    }
}*/
/*function ajaxGetStates(countryId, targetDiv){
    var apiUrl = environment() + '/state-list';
                    
    $.ajax({
        url         : apiUrl,
        type        : 'GET',
        data        : {'CountryCode' : countryId},
        beforeSend  : function(){
            $('#popupLoaderBox').show();
        },
        success: function(res){
            res = $.parseJSON(res);
            res = res.RESPONSE_DATA;
            var dataListing = '<option value="" class="chosenHide"></option>';
            
            $.each(res, function (idx, item) {
                dataListing += '<option value="'+ item.id +'">'+ item.name +'</option>';
            });
            
            $('#'+targetDiv).html(dataListing);
            $('#'+targetDiv).trigger("chosen:updated");
            $('#popupLoaderBox').hide();
        },
        error: function(d){
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}*/
/*function ajaxGetCity(stateId, targetDiv){
    var apiUrl = environment() + '/city-list';
                    
    $.ajax({
        url         : apiUrl,
        type        : 'GET',
        data        : {'stateId' : stateId},
        beforeSend  : function(){
            $('#popupLoaderBox').show();
        },
        success: function(res){
            res = $.parseJSON(res);
            res = res.RESPONSE_DATA;
            var dataListing = '<option value="" class="chosenHide"></option>';
            
            $.each(res, function (idx, item) {
                dataListing += '<option value="'+ item.id +'">'+ item.name +'</option>';
            });
            
            $('#'+targetDiv).html(dataListing);
            $('#'+targetDiv).trigger("chosen:updated");
            $('#popupLoaderBox').hide();
        },
        error: function(d){
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}*/
function verifyOtp(otp, parentEle) {
    var apiUrl = environment() + '/verify-otp';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'otp': otp
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            parentEle.addClass('loading');
        },
        success: function(res) {
            parentEle.removeClass('loading');
            if (res == 'valid') {
                $('#imgMobileVerified, #btnMobileNext').show();
                $('#otpOptions, #btnOtpNxt, #btnResendOtp, #otpSuccessMsg').hide();
                btnErrorHide(parentEle);
                $('#userMobile').prop('readonly', 'readonly');
                $('#userCountryCode').prop('disabled', 'disabled');
                // $('#userMobile').prop('readonly', true);
                sendToLMS(parentEle);
            } else {
                btnErrorShow(parentEle, Error['btnPersonalDetails']['wrongOtp']);
            }
        },
        error: function(d) {
            console.log(d);
        }
    });
}
/*function pushData(ele, data, target){
    if (typeof target === 'undefined') {
        target = 'push';
    }

    if ($.trim(data) != '') {
        var apiUrl = environment() + '/'+target+ '?' + ele +'='+ data;          
        return $.ajax({
            url         : apiUrl,
            type        : 'GET',
            beforeSend  : function(){
            },
            success     : function(resp){
            },
            error :function(d){
            }
        });
    }
}
*/
function loanAmount(maxLoanAmount) {
    $('#txtslide1').prop('min', MIN_LOAN_AMOUNT_LIMIT);
    $('#txtslide1').prop('max', maxLoanAmount);
    MinAmount = digits(MIN_LOAN_AMOUNT_LIMIT.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
    MaxAmount = digits(maxLoanAmount.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
    $('#loanAmount').append('<span class="leftSide">Min ' + MinAmount + '</span> <span class="rightSide">Max ' + MaxAmount + '</span>').show();
}

function projectsName(ele, data, target) {
    if (typeof target === 'undefined') {
        target = 'projects';
    }
    if ($.trim(data) != '') {
        var apiUrl = environment() + '/' + target + '?' + ele + '=' + data;
        $.ajax({
            url: apiUrl,
            type: 'GET',
            beforeSend: function() {
                $('#popupLoaderBox').show();
            },
            success: function(resp) {
                if (typeof(resp) != 'object') {
                    resp = $.parseJSON(resp);
                }
                handleProjectName(resp);
                $('#popupLoaderBox').hide();
            },
            error: function(d) {
                $('#popupLoaderBox').hide();
                console.log(d);
            }
        });
    }
}

function projectDetail(ele, data, target) {
    var ajaxResponse = '';
    if (typeof target === 'undefined') {
        target = 'project';
    }
    if ($.trim(data) != '') {
        var apiUrl = environment() + '/' + target + '?' + ele + '=' + data;
        $.ajax({
            url: apiUrl,
            type: 'GET',
            beforeSend: function() {
                $('#popupLoaderBox').show();
            },
            success: function(resp) {
                if (typeof(resp) != 'object') {
                    resp = $.parseJSON(resp);
                }
                handleProjectDetails(resp);
                $('#popupLoaderBox').hide();
            },
            error: function(d) {
                $('#popupLoaderBox').hide();
                console.log(d);
            }
        });
    }
}

function sendToLMS(parentEle) {
    var apiUrl = environment() + '/send-to-lms';
    var loanTypeId = $('#hdnLoanTypeId').val();
    var countryCode = $('#userCountryCode option:selected').text().replace('+', '');
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'userName': $('#userName').val(),
            'userMobile': $('#userMobile').val(),
            'userEmail': $('#userEmail').val(),
            'userCountryCode': countryCode,
            'userLocation': $('#userLocation option:selected').text(),
            'loanAmount': $('#txtslide1').val()
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            $('#popHeaderText').text('Please wait ... We are creating your profile');
            $('#popupBox, #popUpLoaderGif').show();
            $('#popUpBox .arrow, #popUpBox .popBodyBtnA').hide();
        },
        success: function(res) {
            if (typeof(res) != 'object') {
                res = $.parseJSON(res);
            }
            if (!res.ERROR) {
                // console.log(res.RESPONSE_DATA, res.RESPONSE_DATA.appExists);
                if (res.RESPONSE_DATA.appExists) {
                    $('#popUpLoaderGif').hide();
                    if (res.RESPONSE_DATA.appComplete) {
                        $('#popHeaderText').text('Please Wait...');
                        $('#popBodyText').text('You have already submited your application for loan');
                        setTimeout(function() {
                            window.location = APP_BASE_PATH + 'login';
                        }, 2000);
                    } else {
                        $('#popHeaderText').text('Please Wait...');
                        $('#popBodyText').text('We already have partially filled application. Loading the data.');
                        //App Progress
                        //var ProgressPercent = updateAppProgress(parentEle);
                        //var currentVisitPage = activeSlideElement(parentEle, TILE_DEPENDENCY.personal_detail, true);
                        // Data Push
                        /*var jsonData = {
                            "application": {
                                "applicationProgress": ProgressPercent,
                                'currentVisitPage': getCurrentVisitPage(parentEle)
                            }
                        };
                        pushBulkData(jsonData);*/
                        setTimeout(function() {
                            window.location = environment() + '?q=' + res.RESPONSE_DATA.appId;
                        }, 100);
                    }
                } else {
                    $('#popHeaderText').text('Your Profile is Created Successfully');
                    $('#popUpLoaderGif').hide();
                    $('#needAssistanceBox, #popBodyBtn,#popupBox .arrow').show();
                    $('#appId').val(res.RESPONSE_DATA.appId);
                    $('#applicantId').val(res.RESPONSE_DATA.applicantId).trigger('change');
                    $('#hdnUserMobile').val($('#userMobile').val());
                    //App Progress
                    var ProgressPercent = updateAppProgress(parentEle);
                    //var currentVisitPage = activeSlideElement(parentEle, TILE_DEPENDENCY.personal_detail, true);
                    // Data Push
                    var jsonData = {
                        "application": {
                            "applicationProgress": ProgressPercent,
                            'currentVisitPage': getCurrentVisitPage(parentEle)
                        }
                    };
                    pushBulkData(jsonData);
                    setTimeout(function() {
                        $('#popupBox').hide();
                    }, 3000);
                    // goToByScroll(parentEle.parent('.btnArea').attr("id"));
                    goToByScroll(parentEle.parents('.tile').nextAll('.tile').not('.skipScroll').attr('id') + 'link');
                }
            } else {
                $('#popHeaderText').text('Error Occurred.');
                console.log(res);
            }
        },
        error: function(d) {
            console.log(d);
            $('#popBodyBtn').show();
        }
    });
}

function setLoanAmnt() {
    var div = $("#slider0")
    var loanAmnt = div.val();
    if (loanAmnt < MIN_LOAN_AMOUNT_LIMIT) {
        div.val(MIN_LOAN_AMOUNT_LIMIT);
    } else if (loanAmnt > MAX_LOAN_AMOUNT_LIMIT) {
        $("#slider0").val(MAX_LOAN_AMOUNT_LIMIT);
    }
    if (div.val() > 0) {
        div.parents('.priceRangeSlider').children('mdl-textfield').removeClass('is-invalid');
    }
}

function setDidYouKnow(id) {
    if (DID_YOU_KNOW.hasOwnProperty(id)) {
        var item = '<li><strong>' + DID_YOU_KNOW[id]['title'] + '</stong><p>' + DID_YOU_KNOW[id]['content'] + '</p></li>';
        $("#dyknow").fadeOut(250, function() {
            $(this).html(item).fadeIn(250);
        });
    }
}

function errorText(text) {
    return '<span class="errorText">' + text + '</span>';
}

function btnErrorShow(div, msg) {
    div.closest('.btnArea').children('.errorText').text(msg).show();
}

function btnErrorHide(div) {
    div.closest('.btnArea').children('.errorText').text('').hide();
}

// function inputErrorShow(div, msg) {
//     div.siblings('span.custom-error').attr('title',msg).text(msg).show();
// }

function inputErrorShow(div, msg, levelUp) {
    if (typeof levelUp != 'undefined' && levelUp != 0 && levelUp != '') {
        for (var i = 1; i <= levelUp; i++) {
            div = div.parent();
        }
    }
    // console.log(div,msg);
    div.siblings('span.custom-error').attr('title', msg).text(msg).show();
}

function inputErrorHide(div) {
    div.siblings('span.custom-error').attr('title', '').text('').hide();
}

function btnGroupErrorShow(div, msg) {
    div.find('span.custom-error').text(msg).show();
}

function btnGroupErrorHide(div) {
    div.find('span.custom-error').text('').hide();
}

function sendOtp(userMobile, countryCode, parentEle, target) {
    if (typeof target === 'undefined') {
        target = '';
    }
    if (target == 'verifyUserEligibility') {
        var apiUrl = ELIGIBILITY_API_BASE_PATH + 'send-otp';
    } else {
        var apiUrl = environment() + '/send-otp';
    }
    if ($.trim(userMobile) != '' && validateMobile(userMobile)) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'userMobile': userMobile,
                'countryCode': countryCode
            },
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            beforeSend: function() {
                parentEle.addClass('loading');
            },
            success: function(response) {
                if (typeof(response) != 'object') {
                    response = $.parseJSON(response);
                }
                if (target == 'login') {
                    handleLoginOtpResponse(parentEle, response);
                } else if (target == 'verifyUserEligibility') {
                    handleUserEligibilityOtpResponse(parentEle, response);
                } else {
                    parentEle.removeClass('loading');
                    if (!response.ERROR) {
                        $('#first,#second,#third,#fourth').val('');
                        $('#otpOptions, #btnResendOtp, #otpSuccessMsg').show();
                        // $('#userMobile').prop('readonly', 'readonly');
                        // $('#userCountryCode').prop('disabled', 'disabled');
                        parentEle.text('Verify OTP');
                        parentEle.attr('data-value', 'sent');
                        setTimeout(function() {
                            $('#otpSuccessMsg').hide();
                        }, 2000);
                    } else {
                        parentEle.parent('.btnArea').prepend(errorText(response.RESPONSE_MSG));
                    }
                }
            },
            error: function(d) {
                console.log(d);
            }
        });
    } else {
        var response = {
            ERROR: true,
            RESPONSE_MSG: "Mobile number not in correct format."
        };
        console.log(response.RESPONSE_MSG);
        if (target == 'login') {
            handleLoginOtpResponse(parentEle, response);
        } else if (target == 'verifyUserEligibility') {
            handleUserEligibilityOtpResponse(parentEle, response);
        } else {
            parentEle.parent('.btnArea').prepend(errorText(response.RESPONSE_MSG));
        }
    }
}

function forgotPasswordEmail(userName, parentEle, target) {
    var apiUrl = APP_BASE_PATH + 'builder/forgot-password-email';
    if ($.trim(userName) != '' && validateUserName(userName)) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'userName': userName
            },
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            beforeSend: function() {
                $('#popupLoaderBox').show();
            },
            success: function(response) {
                if (typeof(response) != 'object') {
                    response = $.parseJSON(response);
                }
                $('#forgotPassword').closest('.form-group').find('.errorText').text(response.RESPONSE_MSG).show();
                $('#popupLoaderBox').hide();
            },
            error: function(d) {
                console.log(d);
                $('#popupLoaderBox').hide();
                $('#forgotPassword').closest('.form-group').find('.errorText').text(response.RESPONSE_MSG).show();
            }
        });
    } else {
        var response = {
            ERROR: true,
            RESPONSE_MSG: "User Name not in correct format."
        };
        console.log(response.RESPONSE_MSG);
        $('#forgotPassword').closest('.form-group').find('.errorText').text(response.RESPONSE_MSG).show();
    }
}

function resetPasswordForForgot(newPassword, confirmPassword, token, parentEle, target) {
    var apiUrl = APP_BASE_PATH + 'builder/forgot-password';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'newPassword': newPassword,
            'confirmPassword': confirmPassword,
            'token': token
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            $('#popupLoaderBox').show();
        },
        success: function(response) {
            if (typeof(response) != 'object') {
                response = $.parseJSON(response);
            }
            $('#popupLoaderBox').hide();
            if (!response.ERROR) {
                window.location.href = APP_BASE_PATH + 'builder/page/reset-password';
                // $('#builderResetPasswordDiv').hide();
                // $('#passwordRegeneratedDiv').show();
            } else {
                $('#resetPassword').closest('.form-group').find('.errorText').text(response.RESPONSE_MSG).show();
            }
        },
        error: function(d) {
            console.log(d);
            $('#popupLoaderBox').hide();
        }
    });
}

function resetPassword(oldPassword, newPassword, confirmPassword, parentEle, target) {
    var apiUrl = APP_BASE_PATH + 'builder/reset-password';
    var formId = $('#builderResetPasswordDiv');
    if (formValidate(formId)) {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: {
                'newPassword': newPassword,
                'confirmPassword': confirmPassword,
                'oldPassword': oldPassword
            },
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            beforeSend: function() {
                $('#popupLoaderBox').show();
            },
            success: function(response) {
                if (typeof(response) != 'object') {
                    response = $.parseJSON(response);
                }
                if (!response.ERROR) {
                    // $('#builderResetPasswordDiv').hide();
                    // $('#passwordRegeneratedDiv').show();
                    // $('#passwordRegeneratedDiv').modal('hide');
                    window.location.href = APP_BASE_PATH + 'builder/page/reset-password';
                    //setTimeout(function(){ window.location.href = APP_BASE_PATH + 'builder/login'; }, 3000);
                } else {
                    $('#popupLoaderBox').hide();
                    $('#resetPassword').parents('.formGroupBox').find('.errorText').text(response.RESPONSE_MSG).show();
                }
            },
            error: function(d) {
                console.log(d);
                $('#popupLoaderBox').hide();
            }
        });
    }
}

function pushTempBulkData(bulkData) {
    var apiUrl = environment() + '/push-temp-bulk-data';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: bulkData,
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {},
        success: function(res) {
            /* res = $.parseJSON(res);
            var obj = {'categoryVal': '2', 'categoryType': "Identity Proof", 'docuTypeVal': '17', 'docuType': 'Photograph', 'docuNum': ''}
             thumbnailAppear(res['RESPONSE_DATA']['fileArray'], obj); */
        },
        error: function(d) {
            console.log(d);
        }
    });
}

function leftVerificationBox(objVBox) {
    if (objVBox.hasOwnProperty('aadhaar_check')) {
        if (objVBox.aadhaar_check == 1) {
            $('#aadhaarChk').html('&#9679; Aadhar EKYC<em class="icon-check"></em><span>Verified</span>');
        } else if (objVBox.aadhaar_check == 2) {
            $('#aadhaarChk').html('&#9679;<a href="javascript:void(0)"> Aadhar EKYC</a><span class="failure">! failure</span>');
        } else {
            $('#aadhaarChk').html('&#9679;<a href="javascript:void(0)"> Aadhar EKYC</a><span class="pending">! pending</span>');
        }
    }
    if (objVBox.hasOwnProperty('pan_check')) {
        if (objVBox.pan_check == 1) {
            $('#PANChk').html('&#9679; PAN<em class="icon-check"></em><span>Verified</span>');
        } else if (objVBox.pan_check == 2) {
            $('#PANChk').html('&#9679;<a href="javascript:void(0)"> PAN</a><span class="failure">! failure</span>');
        } else {
            $('#PANChk').html('&#9679;<a href="javascript:void(0)"> PAN</a><span class="pending">! pending</span>');
        }
    }
    if (objVBox.hasOwnProperty('credit_score_check')) {
        if (objVBox.credit_score_check == 1) {
            $('#CredScChk').html('&#9679; Credit Score<em class="icon-check"></em><span>Verified</span>');
        } else if (objVBox.credit_score_check == 2) {
            $('#CredScChk').html('&#9679;<a href="javascript:void(0)"> Credit Score</a><span class="failure">! failure</span>');
            if ($('#btnAddressDetailsAccept')) {
                $('#btnAddressDetailsAccept').hide();
            }
            if ($('#btnAddressDetailsSkip')) {
                $('#btnAddressDetailsSkip').hide();
            }
        } else {
            $('#CredScChk').html('&#9679;<a href="javascript:void(0)"> Credit Score</a><span class="pending">! pending</span>');
        }
    }
    /*if (objVBox.hasOwnProperty('bank_statement_check')) {
        if (objVBox.bank_statement_check == 1) {
            $('#BankStChk').html('&#9679; Bank Statement<em class="icon-check"></em><span>Verified</span>');
        }else if (objVBox.bank_statement_check == 2) {
            $('#BankStChk').html('&#9679;<a href="javascript:void(0)"> Bank Statement</a><span class="failure">! failure</span>');   
        }else {
            $('#BankStChk').html('&#9679;<a href="javascript:void(0)"> Bank Statement</a><span class="pending">! pending</span>');
        }
    }*/
}

function pushBulkData(data, target) {
    if (typeof target === 'undefined') {
        target = 'push-data';
    }
    var apiUrl = environment() + '/' + target;
    doPostQueue.queue(function() {
        data['application'] = data['application'] ? data['application'] : {};
        data['application']['appId'] = $('#appId').val();
        if (data['applicant']) {
            data['applicant'][0]['applicantId'] = $('#applicantId').val();
        }
        if (data['coApplicant']) {
            data['coApplicant'][0]['applicantId'] = $('#coApplicantId').val();
        }
        // console.log(data);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            data: data,
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            success: function(response, textStatus, jqXHR) {
                console.log(jqXHR);
                console.log(textStatus);
                handlePushBulkDataResponse(response);
                doPostQueue.dequeue();
            },
            error: function(d) {
                doPostQueue.dequeue();
                console.log(d);
            },
        })
    });
}

function handlePushBulkDataResponse(res) {
    if (res.ERROR) {
        $.each(res.RESPONSE_DATA.application, function(k, v) {
            var element = $('[data-error-key=' + k + ']');
            if ($.inArray(element.prop('localName'), ["input", "select"]) >= 0) {
                inputErrorShow(element, v[0]);
            } else {
                element.children('.errorText').text(v[0]).show();
            }
        });
        $.each(res.RESPONSE_DATA.applicant, function(k, v) {
            var element = $('[data-error-key=' + k + '][data-applicant="1"]');
            if ($.inArray(element.prop('localName'), ["input", "select"]) >= 0) {
                inputErrorShow(element, v[0]);
            } else {
                element.children('.errorText').text(v[0]).show();
            }
        });
        $.each(res.RESPONSE_DATA.coApplicant, function(k, v) {
            var element = $('[data-error-key=' + k + '][data-applicant="2"]');
            if ($.inArray(element.prop('localName'), ["input", "select"]) >= 0) {
                inputErrorShow(element, v[0]);
            } else {
                element.children('.errorText').text(v[0]).show();
            }
        });
    } else {
        // $('.errorText').html('').hide();
        if (res.hasOwnProperty('RESPONSE_DATA') && res.RESPONSE_DATA.hasOwnProperty('application') && res.RESPONSE_DATA.application.hasOwnProperty('records') && res.RESPONSE_DATA.application.records && !$('#appId').val()) {
            $('#appId').val(res.RESPONSE_DATA.application.records);
        }
        if (res.hasOwnProperty('RESPONSE_DATA') && res.RESPONSE_DATA.hasOwnProperty('applicant')) {
            $.each(res.RESPONSE_DATA.applicant, function(i, item) {
                if (item.id && !$('#applicantId').val()) {
                    $('#applicantId').val(item.id).trigger('change');
                }
            });
        }
        if (res.hasOwnProperty('RESPONSE_DATA') && res.RESPONSE_DATA.hasOwnProperty('coApplicant') && res.RESPONSE_DATA.coApplicant[0]['id'] && !$('#coApplicantId').val()) {
            $.each(res.RESPONSE_DATA.coApplicant, function(i, item) {
                if (item.id && !$('#coApplicantId').val()) {
                    $('#coApplicantId').val(item.id).trigger('change');
                    $('#hasCoApplicant').val(1).trigger('change');
                    hasCoapplicant = 1;
                }
            });
        }
    }
}

function getEmpHtml(empId, applicantTypeId, appId, applicantId, targetDiv, dataToPost) {
    var params = {
        'empTypeId': empId,
        'applicantTypeId': applicantTypeId,
        'appId': appId,
        'applicantId': applicantId
    };
    var str = jQuery.param(params);
    var apiUrl = environment() + '/get-employment-html?' + str;
    var response = '';
    $.ajax({
        url: apiUrl,
        type: 'GET',
        dataType: 'html',
        beforeSend: function() {
            $('#popupLoaderBox').show();
        },
        success: function(res) {
            $('#' + targetDiv).html(res);
            $('select.chosen-select').chosen();
            triggerInput();
            $('#popupLoaderBox').hide();
            pushBulkData(dataToPost);
        },
        error: function(d) {
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}

function scrollCustomOperation(id) {
    switch (id) {
        case 'boxxx17':
            initHomeLoanQuotes();
            break;
        case 'boxxx14':
            initIncome();
            break;
        case 'boxxx10':
            var propertyIdentifiedId = $('#hdnPropertyIdentified').val();
            var rangeArr = ['A', 'B', 'C', 'D', 'E'];
            var idx = 0;
            $('[data-type="personal-details"]').not('.skipScroll').each(function() {
                $(this).find('span.index').text(rangeArr[idx] + '.');
                idx++;
            });
            break;
        case 'boxxx7':
            var inputVal = $('#hdnPropertyBudgetAmount').val();
            $('#loanAmount .leftSide, #loanAmount .rightSide').remove();
            sliderValue = parseInt(inputVal * MIN_LOAN_AMOUNT_PERCENT);
            var selfFundedValue = inputVal - sliderValue;
            $('#selfFundedAmount').empty().html(digits(selfFundedValue).replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
            inputVal = parseInt(inputVal * MAX_LOAN_AMOUNT_PERCENT);
            loanAmount(inputVal);
            $('#maxLoanAmountLabel').empty().html('( ' + digits(inputVal) + ' )');
            $('#txtslide1').val(digits(MIN_LOAN_AMOUNT_LIMIT));
            $('#selfFundedAmount').empty().html(digits(selfFundedValue).replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
            $('#slider1').slider("option", "max", inputVal);
            $("#slider1").slider('value', sliderValue);
            break;
    }
}

function leftNav(id, disable) {
    console.log('leftNav: ' + id);
    if (typeof disable === 'undefined') {
        disable = true;
    }
    var obj = $('[data-id="' + id + '"]')
    if (disable) {
        obj.parents('.leftgoMainToOuter').addClass('active').prevAll().addClass('active');
        obj.parents('.leftgoMainToOuter').nextAll().removeClass('active');
        obj.parents('.leftgoMainToOuter').find('.panel-heading a').removeClass('disableCollapse');
        obj.parents('.leftgoMainToOuter').prevAll().find('.panel-heading a').removeClass('disableCollapse');
        obj.parents('.leftgoMainToOuter').nextAll().find('.panel-heading a').addClass('disableCollapse');
        var collapseTarget = $(".leftgoToOuter[data-id='" + id + "']").parents('.panel-collapse').attr('id');
        $('.leftgoMainToOuter').find('.panel-collapse').not($('#' + collapseTarget)).collapse('hide');
        $('#' + collapseTarget).collapse('show');
        obj.nextAll().addClass('disable');
        obj.parents('.leftgoMainToOuter').nextAll().find('.leftgoToOuter').addClass('disable');
        obj.parents('.leftgoMainToOuter').prevAll().find('[data-id*="boxxx"]').removeClass('disable highlightLink');
        obj.parents('.leftgoMainToOuter').prevAll().find('.slideValid').show();
        obj.parents('.leftgoMainToOuter').nextAll().find('.slideValid').hide();
        obj.parents('.leftgoMainToOuter').find('.slideValid').hide();
        id = $.trim(id);
        var tid = id.replace("link", "");
        leftNavCustomOperation(tid);
    }
    $('.leftgoToOuter').removeClass('highlightLink');
    obj.addClass('highlightLink').removeClass('disable');
    obj.prevAll().removeClass('disable');
}

function leftNavCustomOperation(id) {
    switch (id) {
        case 'boxxx1':
            $('.piQuestion, .pniQuestion, .commonQuestion').hide();
            break;
            // case 'boxxx2':
        case 'boxxx3':
            $('.piQuestion').addClass('disable skip skipScroll').hide();
            $('.pniQuestion').removeClass('skip skipScroll').show();
            $('#boxxx5, #boxxx6').hide();
            $('#boxxx6').addClass('skipScroll');
            $('.commonQuestion').show();
            break;
            // case 'boxxx4':
        case 'boxxx5':
        case 'boxxx6':
            $('.pniQuestion').addClass('disable skip skipScroll').hide();
            $('.piQuestion, #boxxx6').removeClass('skip skipScroll').show();
            $('#boxxx3').hide();
            $('.commonQuestion').show();
            break;
        case 'boxxx7':
            var propertyIdentifiedId = $('#hdnPropertyIdentified').val();
            if (propertyIdentifiedId == 1) {
                $('.pniQuestion').addClass('disable skip skipScroll').hide();
                $('.piQuestion').removeClass('skip skipScroll').show();
                $('#boxxx2, #boxxx3').hide();
            } else if (propertyIdentifiedId == 0) {
                $('.piQuestion').addClass('disable skip skipScroll').hide();
                $('.pniQuestion').removeClass('skip skipScroll').show();
                $('#boxxx4, #boxxx5, #boxxx6').hide();
            }
            $('.commonQuestion').show();
            break;
        case 'boxxx10':
            var propertyIdentifiedId = $('#hdnPropertyIdentified').val();
            var rangeArr = ['A', 'B', 'C', 'D'];
            var idx = 1;
            if (propertyIdentifiedId == 1) {
                $('[data-type="personal_detail"]').not('.skipScroll').each(function() {
                    console.log($(this).find('span.index').html());
                    $(this).find('span.index').text(rangeArr[idx] + '.');
                });
            } else if (propertyIdentifiedId == 0) {
                $('[data-type="personal_detail"]').not('.skipScroll').each(function() {
                    console.log($(this).find('span.index').html());
                    $(this).find('span.index').text(rangeArr[idx] + '.');
                });
            }
            break;
    }
}

function ManageEdit(id) {
    // body...
    var obj = $('#' + id);
    obj.removeClass('editTiles');
    obj.find('.overlyDiv').hide();
    obj.prevAll().addClass('editTiles');
    obj.nextAll().removeClass('editTiles').hide();
}

function getCurrentVisitPage(obj) {
    var id = obj.parents('.tile').attr('id');
    var result;
    switch (id) {
        case 'boxxx1':
            if ($('#hdnPropertyIdentified').val() == 1) {
                result = obj.parents('.tile').nextAll('.tile.piQuestion[data-tile!=""]:first').attr('data-tile');
            } else {
                result = obj.parents('.tile').nextAll('.tile.pniQuestion[data-tile!=""]:first').attr('data-tile');
            }
            break;
        case 'boxxx3':
        case 'boxxx6':
            result = obj.parents('.tile').nextAll('.tile.commonQuestion[data-tile!=""]:first').attr('data-tile');
            break;
        default:
            result = obj.parents('.tile').nextAll('.tile[data-tile!=""]:not(.skip):not(.skipScroll):first').attr('data-tile');
            break;
    }
    return result;
}

function addSkipLeftNav(obj) {
    $(".leftgoToOuter[data-id='" + obj.parents('.tile').attr("id") + "link']").addClass('skip');
}

function removeSkipLeftNav(obj) {
    $(".leftgoToOuter[data-id='" + obj.parent('.btnArea').attr('id') + "']").removeClass('skip');
}

function getBizIndustry(bizNature, targetDiv) {
    if (bizNature != '' && bizNature > 0) {
        var apiUrl = environment() + '/../Api/get-business-nature-list?parent_id=' + bizNature;
        var response = '';
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'html',
            beforeSend: function() {},
            success: function(res) {
                if (typeof(res) != 'object') {
                    res = $.parseJSON(res);
                }
                $('#' + targetDiv).html('<option value="" class="chosenHide"></option>');
                $.each(res.RESPONSE_DATA, function(i, item) {
                    $('#' + targetDiv).append($('<option>', {
                        value: item.id,
                        text: item.name
                    }));
                });
                $('#' + targetDiv).trigger("chosen:updated");
            },
            error: function(d) {
                console.log(d);
            }
        });
    }
}

function updateAppProgress($this) {
    var id = $this.parents('.tile').attr("id") + 'link';
    if ($('.leftgoToOuter[data-id="' + id + '"]').hasClass('skip')) {
        id = $this.parents('.tile').prev('.tile').attr("id") + 'link';
    }
    var index = $('.leftgoToOuter').not('.skip').index($('.leftgoToOuter[data-id="' + id + '"]')) + 1;
    // var index = $("[name='is_valid'][value='1']").length; 
    if (index >= 0) {
        var slidePercent = parseFloat($.trim($('#slidePercentage').val()) * (index)).toFixed(2);
        var appPercent = $('#applicationPercentage').val();
        var percent = slidePercent; //(slidePercent > appPercent) ? slidePercent : appPercent
        percent = (percent > 100) ? 100 : percent;
        $('#applicationPercentage').val(percent);
        // pushData('applicationProgress', percent);
        $('#appProgressBar').show().animate({
            'height': percent + '%'
        }, "slow", "linear");
        //display progress %
        /*var previous = ($('#appProgressBar span').text()).replace('%','');
        $('#appProgressBar').show().animate( {'height':percent+'%'}, "slow", "linear", function(){ $(this).children('span').text(percent+'%'); });
        $({ Counter: previous }).animate({ Counter: percent }, {duration:"slow", easing:'linear', 
            step: function () {
            $('#appProgressBar span').text( Math.ceil(this.Counter)+'%');
          }
        });*/
        return percent;
    }
}
//Just Few Seconds
function verifyStatusDetails() {
    var usernationalityid = $.trim($('#hdnuserNationalityId').val());
    var userqualificationid = $.trim($('#hdnuserQualificationlId').val());
    var usermaritalid = $.trim($('#hdnuserMaritalId').val());
    var castetype = $.trim($('#hdnuserCasteId').val());
    var ERROR = false;
    if (usernationalityid == '' || usernationalityid <= 0) {
        ERROR = true;
        btnGroupErrorShow($('#userNationalityId'), Error.userNationalityId.error);
    } else {
        btnGroupErrorHide($('#userNationalityId'));
    }
    if (userqualificationid == '' || userqualificationid <= 0) {
        ERROR = true;
        inputErrorShow($('#userQualificationId'), Error.userQualificationId.error);
    } else {
        inputErrorHide($('#userQualificationId'));
    }
    if (usermaritalid == '' || usermaritalid <= 0) {
        ERROR = true;
        btnGroupErrorShow($('#userMaritalId'), Error.userMaritalId.error);
    } else {
        btnGroupErrorHide($('#userMaritalId'));
    }
    if (castetype == '' || castetype <= 0) {
        ERROR = true;
        btnGroupErrorShow($('#userCaste'), Error.userCaste.error);
    } else {
        btnGroupErrorHide($('#userCaste'));
    }
    return (!ERROR);
}

function setApplicationFormHtml() {
    $(".bankBox").remove();
    $.get(APP_BASE_PATH + 'public/assets/templates/review-forms.ejs?v=' + APP_VERSION).success(function(resp) {
        $.each(OBJ_APPLICATION, function(key, item) {
            item.DIGIO_ENABLE = DIGIO_ENABLE;
            var html = ejs.render(resp, item);
            $("#appFormHeading").after(html);
        });
    });
}

function setDocumentsHtml() {
    var i = 1;
    var APPLICANT_DOCS = [];
    var COAPP_DOCS = [];
    var j = 0,
        k = 0;
    if (UPLOADED_DOCUMENTS != '') {
        $.each(UPLOADED_DOCUMENTS, function(key, item) {
            var path = (item.path).split('.');
            var n = path.length;
            (path[n - 1] == 'pdf') ? (item.isPDF = '1') : (item.isPDF = '0')
            if (item.applicantId == $("#applicantId").val()) {
                APPLICANT_DOCS[k] = item;
                k++;
            } else if (item.applicantId == $("#coApplicantId").val()) {
                COAPP_DOCS[j] = item;
                j++;
            }
        });
    }
    console.log(APPLICANT_DOCS);
    $.get(APP_BASE_PATH + 'public/assets/templates/prepopulate-documents.ejs?v=' + APP_VERSION).success(function(resp) {
        $.each(DOC_TYPE.labels, function(key, item) {
            if (item.parent_id == '0' || item.parent_id == '-1') {
                var categoryDiv = '<div class="panel-heading"><h4 class="panel-title"><span>' + i + '. ' + item.name + '</span> <a data-toggle="collapse" id="appcoll' + i + '" data-parent="#applicantAccordionBox" href="#appcollapse' + i + '" class="collapsed"></a></h4></div><div id="appcollapse' + i + '" class="panel-collapse collapse"><div class="panel-body"><div class="checkBoxSection"><ul id ="' + item.id + 'appcategory"></ul> </div></div></div>';
                $("#docAppendApplicant").append(categoryDiv);
                var categoryDiv2 = '<div class="panel-heading"><h4 class="panel-title"><span>' + i + '. ' + item.name + '</span> <a data-toggle="collapse" id="coappcoll' + i + '" data-parent="#coApplicantAccordionBox" href="#coappcollapse' + i + '" class="collapsed"></a></h4></div><div id="coappcollapse' + i + '" class="panel-collapse collapse"><div class="panel-body"><div class="checkBoxSection"><ul id ="' + item.id + 'coappcategory"></ul> </div></div></div>';
                $("#docAppendCoApplicant").append(categoryDiv2);
                var parentId = item.id;
                $.each(DOC_TYPE.labels, function(key, item) {
                    if (item.parent_id == parentId) {
                        item.PREP = APPLICANT_DOCS;
                        item.appcoappval = 'app';
                        item.DIGIO_ENABLE = DIGIO_ENABLE;
                        var html = ejs.render(resp, item);
                        $("#" + parentId + "appcategory").append(html);
                        componentHandler.upgradeDom();
                        //componentHandler.upgradeAllRegistered();
                        item.appcoappval = 'coapp';
                        item.PREP = COAPP_DOCS;
                        item.DIGIO_ENABLE = DIGIO_ENABLE;
                        var html2 = ejs.render(resp, item);
                        $("#" + parentId + "coappcategory").append(html2);
                        componentHandler.upgradeDom();
                        //componentHandler.upgradeAllRegistered();
                        //$("#thyDocumentsBox .uploadSection").hide();
                    }
                });
                i++;
            }
        });
        $("#appcoll1").trigger('click');
        $("#coappcoll1").trigger('click');
    });
}

function submitApplication(targetDiv) {
    var apiUrl = environment() + '/submit-application';
    var ProgressPercent = updateAppProgress(targetDiv);
    $.ajax({
        url: apiUrl,
        type: 'POST',
        dataType: 'json',
        data: {
            'application': {
                'appId': $('#appId').val(),
                'applicantId': $('#applicantId').val(),
                "applicationProgress": ProgressPercent
            }
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            $('.popupBox').hide();
            $('#popupLoaderBox').show();
        },
        success: function(response) {
            $('#popupLoaderBox').hide();
            if (typeof(response) != 'object') {
                response = $.parseJSON(response);
            }
            var urlParams = new URLSearchParams(window.location.search);
            if ((typeof response.RESPONSE_DATA.intended !== 'undefined') && (!urlParams.has('employee'))) {
                window.location = response.RESPONSE_DATA.intended;
            } else {
                $('#applicationSubmitted').show();
            }
        },
        error: function(d) {
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}

function submitApplicationInhouse(targetDiv) {
    var jsonData = {
        'appId': $('#appId').val(),
        'isSubmit': true
    };
    $('#popupLoaderBox').show();
    ajaxCall('POST', environment() + '/save-application', jsonData).success(function (resp) {
        resp = $.parseJSON(resp)
        console.log(resp);
        if (resp.ERROR) {
            targetDiv.closest('.btnArea').find('.errorText').html(resp.RESPONSE_MSG).show();
            // window.location = resp.RESPONSE_DATA.intended;
        } else {
            targetDiv.closest('.btnArea').find('.errorText').html('').hide();
            if(resp.RESPONSE_DATA.redirectUrl){
                window.location.href = resp.RESPONSE_DATA.redirectUrl;
            }else {
                var bank = resp.RESPONSE_DATA.bank_resp;
                if(bank && !bank.ERROR){
                    $('#applicationSubmitted p#popContentText').html("APS ID: "+bank.RESPONSE_DATA.aps_id+"<br>APPLICATION NO. : "+bank.RESPONSE_DATA.bank_application_number);
                }
                $('#applicationSubmitted').show();
            }
        }
        $('#popupLoaderBox').hide();
    });
}

function validateFlags(){
    var flag = false;
    var propertyOwnership = $('input[name=ownership]:checked').val();
    var bookingAmountPaidBy = $('input[name=paidby]:checked').val();
    var modeOfPayment = $('input[name=payment]:checked').val();
    var userOccupationTypeId = $('input[name=applicantEmp]:not(.skip):checked').val();
    var applicantId = $('#applicantId').val();


    if ($('.panel-heading').hasClass("active")
     && $('label.panel-subHeading').hasClass("active")
     && $('div.panel-subHeading').hasClass('active')
     && propertyOwnership
     && bookingAmountPaidBy
     && modeOfPayment) {
        var key = '';
        var value = '';
        var jsonObj = [];
        $("div.panel-subHeading.active .formGroupBox").each(function(index, element) {
            var flags = {};
            key = $(element).find('input, textarea').attr('id');
            value = $(element).find('input, select, textarea').val();
            if(!value){
              flag = true;
            }
            if (!key) {
              key = value;
              value = 1;
            }
            flags.fid = key;
            flags.fv = value;
            jsonObj.push(flags);
        });
        var jsonData = {
            "application": {
                "flags": jsonObj,
                "modeOfPayment": modeOfPayment,
                "propertyOwnership": propertyOwnership,
                "bookingAmountPaidBy": bookingAmountPaidBy
            }
        };
        if(userOccupationTypeId){
            jsonData.application.applicants = [
                {"applicantId": applicantId, "applicantTypeId": 1, "userOccupationTypeId": userOccupationTypeId}
            ];
        }
    } else {
        flag = true;
        jsonData = '';
        $(this).siblings('.errorText').show().html('Please fill all the required information');
    }

    return {'flag': flag, 'jsonData': jsonData};
}

function setFlagsNonEditable(){
    var loanReq = $('.panel-heading.active').find('label').text(); 
    loanReq = (loanReq != '') ? loanReq : 'Not Available';
    $('#loanReqNonEdit').text(loanReq);
    var loanDetail = $('label.panel-subHeading.active').text();
    $('#loanDetailNonEdit').text(loanDetail);
        
    if(loanDetail.toLowerCase() == 'self funding'){
        $('#loanDetailNonEdit').closest('ul').addClass('funding');
        var loanDetailText  = $('div.panel-subHeading.active textarea').val();
        $('#loanDetailText').text(loanDetailText);
    }else if(loanDetail.toLowerCase() == 'deferred loan') {
        var elements = $('div.panel-subHeading.active input.has-content');
        $.each(elements, function(k, v){
            if(k == 0){
                $('#loanDetailText').text('Self Payment: ');
                var span = '<span>'+v.value+'%</span>'
                $('#loanDetailText').append(span);
            }else if(k == 1){
                var li = '<li>Payment after full brokerage: <span>'+v.value+'%</span></li>';
                $('#loanDetailText').after(li);
            }
        });
    }else {
        var loanDetailSpan  = $('div.panel-subHeading.active span').text();
        $('#loanDetailText').text(loanDetailSpan);
    }

    var propertyOwnership = $.trim($('input[name=ownership]:checked').closest('label').text());
    var bookingAmountPaidBy = $.trim($('input[name=paidby]:checked').closest('label').text());
    var modeOfPayment = $.trim($('input[name=payment]:checked').closest('label').text());
    var applicantOccupation = $.trim($('input[name=applicantEmp]:not(.skip):checked').closest('label').text());
    propertyOwnership = (propertyOwnership != '') ? propertyOwnership : 'Not Available';
    bookingAmountPaidBy = (bookingAmountPaidBy != '') ? bookingAmountPaidBy : 'Not Available';
    modeOfPayment = (modeOfPayment != '') ? modeOfPayment : 'Not Available';
    applicantOccupation = (applicantOccupation != '') ? applicantOccupation : 'Not Available';
    $('#propertyOwnershipNonEdit').text(propertyOwnership);
    $('#bookingAmountNonEdit').text(bookingAmountPaidBy);
    $('#paymentNonEdit').text(modeOfPayment);  
    $('#applicantEmpNonEdit').text(applicantOccupation);  

    $('.paymentDetailsBox.editable').hide();
    $('.paymentDetailsBox.noneditableBox').show(); 
    $('.editLink.loan-detail').show();

    var appEmpDisplay = false;
    if(flagsData.length && (flagsData[0].fid == 10 || flagsData[0].fid == 5 || flagsData[0].fid == 11 )){
        appEmpDisplay = true;
    }
    if(!appEmpDisplay){
        $('.applicantProfileDiv').find('input').addClass('skip');
        $('.applicantProfileDiv').hide();
    }
    // if ($('#boxxx34.pageSection').nextAll('.pageSection').not('.skip').first().length) {
    //     inhouseScroll($('#boxxx34.pageSection').nextAll('.pageSection').not('.skip').first(), false);
    // } else {
    //     inhouseScroll($('#boxxx34'), false);
    // }
}

function appFlagsToSubmit(data) {
    var jumpToSubmit = false;
    $(data).each(function(k, v) {
        //As required for direct submission corresponding to app flags
        if (restrictedFlags.indexOf(parseInt(v.fid)) != -1) {
            jumpToSubmit = true;
            $('#btnLoanDetails').html('Submit <em class="icon-right-arrow"></em>');
        }
        //As required in removal of mandatory checks for documents
        if ([9, 12, 13].indexOf(parseInt(v.fid)) != -1) {
            skipMandatory = true;
        } else {
            skipMandatory = false;
        }
    });
    return jumpToSubmit;
}

function initHandleBanks(salaryCreditIn, targetDiv) {
    if (typeof(banks) === 'undefined') {
        $.getScript((APP_BASE_PATH + 'public/datafiles/bankList.js?v=' + APP_VERSION), function(response) {
            banks = typeof response != 'object' ? $.parseJSON(response) : response;
            handlebanks(banks, targetDiv, salaryCreditIn);
        });
    } else {
        handlebanks(banks, targetDiv, salaryCreditIn);
    }
}

function handlebanks(banks, targetDiv, salaryCreditIn) {
    var bankList = '<option value="" class="chosenHide"></option>';
    $.each(banks, function(index, bank) {
        if (bank.Type.toLowerCase() == 'bank') {
            if (bank.BankId == salaryCreditIn) {
                bankList += '<option value="' + bank.BankId + '" selected="selected">' + bank.BankName + '</option>';
            } else {
                bankList += '<option value="' + bank.BankId + '">' + bank.BankName + '</option>';
            }
        }
    });
    $(targetDiv).html(bankList).chosen().trigger("chosen:updated");
}

function initHandleCompanyType(bizConstitution, targetDiv) {
    if (typeof(companyTypes) === 'undefined') {
        $.getScript((APP_BASE_PATH + 'public/datafiles/companyTypeList.js?v=' + APP_VERSION), function(response) {
            companyTypes = $.parseJSON(response);
            handleCompanyType(companyTypes, targetDiv, bizConstitution);
        });
    } else {
        handleCompanyType(companyTypes, targetDiv, bizConstitution);
    }
}

function handleCompanyType(companyTypes, targetDiv, bizConstitution) {
    var companyTypeList = '<option value="" class="chosenHide"></option>';
    $.each(companyTypes, function(index, company) {
        if (company.id == bizConstitution) {
            companyTypeList += '<option value="' + company.id + '" selected="selected">' + company.name + '</option>';
        } else {
            companyTypeList += '<option value="' + company.id + '">' + company.name + '</option>';
        }
    });
    $(targetDiv).html(companyTypeList).chosen().trigger("chosen:updated");
}

function initHandleBizNature(bizNature, targetDiv) {
    if (typeof(bizNatures) === 'undefined') {
        $.getScript((APP_BASE_PATH + 'public/datafiles/businessNatureList.js?v=' + APP_VERSION), function(response) {
            bizNatures = $.parseJSON(response);
            handleBizNature(bizNatures, targetDiv, bizNature);
        });
    } else {
        handleBizNature(bizNatures, targetDiv, bizNature);
    }
}

function handleBizNature(bizNatures, targetDiv, bizNature) {
    var bizNaturesList = '<option value="" class="chosenHide"></option>';
    $.each(bizNatures, function(index, nature) {
        if (nature.id == bizNature) {
            bizNaturesList += '<option value="' + nature.id + '" selected="selected">' + nature.name + '</option>';
        } else {
            bizNaturesList += '<option value="' + nature.id + '">' + nature.name + '</option>';
        }
    });
    $(targetDiv).html(bizNaturesList).chosen().trigger("chosen:updated");
}

function initHandlePropfessionType(profName, targetDiv) {
    if (typeof(professions) === 'undefined') {
        $.getScript((APP_BASE_PATH + 'public/datafiles/professionalList.js?v=' + APP_VERSION), function(response) {
            professions = $.parseJSON(response);
            handlePropfessionType(professions, targetDiv, profName);
        });
    } else {
        handlePropfessionType(professions, targetDiv, profName);
    }
}

function handlePropfessionType(professions, targetDiv, profName) {
    var professionList = '<option value="" class="chosenHide"></option>';
    $.each(professions, function(index, profession) {
        if (profession.id == profName) {
            professionList += '<option value="' + profession.id + '" selected="selected">' + profession.name + '</option>';
        } else {
            professionList += '<option value="' + profession.id + '">' + profession.name + '</option>';
        }
    });
    $(targetDiv).html(professionList).chosen().trigger("chosen:updated");
}

function initHandleOfficeType(profOffcType, targetDiv) {
    if (typeof(offcTypes) === 'undefined') {
        $.getScript((APP_BASE_PATH + 'public/datafiles/residenceStatusList.js?v=' + APP_VERSION), function(response) {
            offcTypes = $.parseJSON(response);
            handlePropfessionType(offcTypes, targetDiv, profOffcType);
        });
    } else {
        handlePropfessionType(offcTypes, targetDiv, profOffcType);
    }
}

function handleOfficeType(offcTypes, targetDiv, profOffcType) {
    var offcTypeList = '<option value="" class="chosenHide"></option>';
    $.each(offcTypes, function(index, offcType) {
        if (offcType.id == profOffcType) {
            offcTypeList += '<option value="' + offcType.id + '" selected="selected">' + offcType.name + '</option>';
        } else {
            offcTypeList += '<option value="' + offcType.id + '">' + offcType.name + '</option>';
        }
    });
    $(targetDiv).html(offcTypeList).chosen().trigger("chosen:updated");
}

function getHomeLoanQuotes(popUpBox, refresh) {
    if (typeof popUpBox === 'undefined') {
        popUpBox = true;
    }
    if (typeof refresh === 'undefined') {
        refresh = false;
    }
    var apiUrl = environment() + '/quotes';
    var data = {
        "application": {
            "appId": $('#appId').val()
        }
    };
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            if (popUpBox) {
                $('#popupLoaderBox').show();
            }
            $('#quotesTable').html('');
            $('#planSliderMain').html("<div id='planSlider'></div>");
            $('#planSliderMain').parents(".tile").find('.errorText').text('').hide();
            OBJ_APPLICATION = [];
        },
        success: function(resp) {
            if (!resp.ERROR && resp.RESPONSE_DATA.offers.length) {
                // console.log(resp);
                var parentEle = $('#planSliderMain').parents('.tile');
                parentEle.find('.btnArea').show();
                parentEle.find('.errorText').text('').hide();
                var selectedOffers = resp.RESPONSE_DATA.selectedOffers;
                var offers = resp.RESPONSE_DATA.offers;
                var objToTiles = {
                    'offers': []
                };
                var objApplication = [];
                $.each(offers, function(index, offer) {
                    var tempObj = {};
                    var tempSelected = {};
                    tempObj.bankId = parseInt(offer.bankId);
                    tempObj.bankImage = offer.bankImage;
                    tempObj.bankName = offer.bankName;
                    tempObj.chequeInFavour = offer.chequeInFavour;
                    tempObj.emi = parseInt(offer.emi);
                    tempObj.emiPerLac = offer.hasOwnProperty('emiPerLac') ? parseInt(offer.emiPerLac) : null;
                    tempObj.interestRate = parseFloat(offer.interestRate);
                    tempObj.interestRateTypeID = parseInt(offer.interestRateTypeID);
                    tempObj.interestRateTypeString = offer.interestRateTypeString.toUpperCase();
                    tempObj.loanAmount = parseInt(offer.loanAmount);
                    tempObj.loanTenure = parseInt(offer.loanTenure);
                    // tempObj.loanDescription = offer.loanDescription;
                    tempObj.processingFeesAmount = offer.hasOwnProperty('processingFeesAmount') ? offer.processingFeesAmount : null;
                    tempObj.selected = false;
                    tempObj.commanSeparated = {
                        'emi': offer.emi.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        'emiPerLac': offer.hasOwnProperty('emiPerLac') ? offer.emiPerLac.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : null,
                        // 'processingFeesAmount' : offer.hasOwnProperty('processingFeesAmount') ? offer.processingFeesAmount.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : null,
                        'loanAmount': offer.loanAmount.toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")
                    };
                    $.each(selectedOffers, function(selectedIndex, selectedOffer) {
                        if ((selectedOffer.interestType == offer.interestRateTypeID) && (selectedOffer.bank == offer.bankId)) {
                            tempObj.selected = true;
                            objApplication.push(tempObj);
                        } else {}
                    });
                    objToTiles['offers'].push(tempObj);
                });
                // console.log(OBJ_APPLICATION);
                console.log(objToTiles);
                // $.get('public/assets/templates/quotes.ejs?v=' + APP_VERSION).success(function(template) {
                $.get(APP_BASE_PATH + 'public/assets/templates/quotes.ejs?v=' + APP_VERSION).success(function(template) {
                    $('#boxxx17').show();
                    var html = ejs.render(template, objToTiles);
                    var vm = new Vue({
                        el: '#planSlider',
                        components: {
                            'carousel-3d': Carousel3d.Carousel3d,
                            'slide': Carousel3d.Slide
                        },
                        template: '<carousel-3d :controls-visible="true" :clickable="true" :perspective="0" :display="3" :width="362" :height="272">' + html + '</carousel-3d>',
                    });
                    $.each(objApplication, function(index, offer) {
                        generatedSelectedOfferCard(offer);
                    });
                    if (!popUpBox) {
                        setTimeout(function() {
                            $('#boxxx17').hide();
                        }, 200);
                    }
                });
            } else {
                $('#planSlider').html('Thanks for showing your Interest. Our team member will contact you soon.');
                var parentEle = $('#planSliderMain').parents('.tile');
                parentEle.find('.btnArea').hide();
                parentEle.find('.errorText').text('').hide();
            }
            $('#popupLoaderBox').hide();
        },
        error: function(d) {
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}

function initHomeLoanQuotes() {
    //if($('#planSlider').length>0 && !$('#planSliderMain #planSlider').html().length){
    getHomeLoanQuotes();
    //}
}

function initIncome() {
    var applicantEmpID = $('#userOccupationTypeId').val();
    var coAppEmpID = ($('#coApplicantRelation').length > 0 && ($('#coApplicantRelation').val() != 8)) ? $('#coAppOccupationTypeId').val() : '';
    itemsApp = '';
    itemsCoApp = '';
    var items = '<option value="" class="chosenHide"></option>';
    $.each(dropDownType[0], function(k, v) {
        items += "<option value='" + v.id + "'>" + v.income + "</option>";
    });
    //$('#incomeTypeCoApp').val('').trigger("chosen:updated");
    if (coAppEmpID == 1) {
        $.each(dropDownType[1], function(k, v) {
            itemsCoApp += "<option value='" + v.id + "'>" + v.income + "</option>";
        });
    }
    $('#incomeTypeCoApp').html(items + itemsCoApp).trigger("chosen:updated");
    //$('#incomeTypeApp').val('').trigger("chosen:updated");
    if (applicantEmpID == 1) {
        $.each(dropDownType[1], function(k, v) {
            itemsApp += "<option value='" + v.id + "'>" + v.income + "</option>";
        });
    }
    $('#incomeTypeApp').html(items + itemsApp).trigger("chosen:updated");
    
    $('.coApplicantIncome').parents('#incomeValueCoAppDiv').siblings('.newTileBox[id="incomeValueRowCoApp"]').prevAll('.newTileBox:not(#incomeValueCoAppDiv)').remove();
    $('.coApplicantIncome').remove();

    $('.incomeValueRowCoApp').remove();
    $.each(incomeType, function(k,data) {
        var items = '';
        $.each(data, function(k,v) {
            if (coAppEmpID == v.occupation_type) {
                items += "<div class='form-group coApplicantIncome'><div class='inputBox inputMargin input-effect inputField'>";
                items += "<input class='effect incomeCoApp' type='text' data-error='btnMonthlyIncomeEdit' placeholder='' id='"+ v.id +"' data-frequency='"+ v.income_frequency +"' data-include='"+ v.is_included +"'> <label class='incomeCoAppLabel'>"+ v.income +"</label>";
                items += "<span class='focus-border'></span><span class='custom-error'></span></div><span class='helpText1'>As reflected in ITR of the past 2 years</span></div>";
            }
        });
        $("#incomeValueCoAppRow").after(items);
    });
    
    $('.applicantIncome').parents('#incomeValueAppDiv').siblings('.newTileBox[id="incomeValueRowApp"]').prevAll('.newTileBox:not(#incomeValueAppDiv)').remove();
    $('.applicantIncome').remove();

    $.each(incomeType, function(k,data) {
        var items = '';
        $.each(data, function(k,v) {
            if (applicantEmpID == v.occupation_type) {
                items += "<div class='form-group applicantIncome'><div class='inputBox inputMargin input-effect inputField'>";
                items += "<input class='effect incomeApp' type='text' data-error='btnMonthlyIncomeEdit' placeholder='' id='"+ v.id +"' data-frequency='"+ v.income_frequency +"' data-include='"+ v.is_included +"'> <label class='incomeAppLabel'>"+ v.income +"</label>";
                items += "<span class='focus-border'></span><span class='custom-error'></span></div><span class='helpText1'>As reflected in ITR of the past 2 years</span></div>";
                }
        });
        $("#incomeValueAppRow").after(items);
    });	
}

function updateApplicantLabel(name) {
    //console.log(name);
    $('.applicantName').text(name);
    $('#borrowerType').find('option:eq(1)').text('Applicant (' + name + ')').trigger("chosen:updated");
    //$('.borrowerTypeName').find('option[value="'+ $("#applicantId").val() +'"]').text('Applicant (' + name + ')');
}

function validateAge(dob, min, max) {
    if (typeof min === 'undefined') {
        min = 18;
    }
    if (typeof max === 'undefined') {
        max = 75;
    }
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    if (age >= min && age <= max) {
        return true;
    }
    return false;
}

function casteStatus() {
    if (($('#hdnuserCasteId').val() == 'SC')) {
        $('.casteId1').addClass('active');
    }
    if (($('#hdnuserCasteId').val() == 'ST')) {
        $('.casteId2').addClass('active');
    }
    if (($('#hdnuserCasteId').val() == 'OBC')) {
        $('.casteId3').addClass('active');
    }
    if (($('#hdnuserCasteId').val() == 'General')) {
        $('.casteId4').addClass('active');
    }
    if (($('#hdnuserCasteId').val() == 'others')) {
        $('.casteId5').addClass('active');
    }
}

function initJqRadialGaugeRadial() {
    var gradient1 = {
        type: 'linearGradient',
        x0: 0,
        y0: 0.5,
        x1: 1,
        y1: 0.5,
        colorStops: [{
            offset: 0,
            color: '#C5F80B'
        }, {
            offset: 1,
            color: '#6B8901'
        }]
    };
    var gradient2 = {
        type: 'linearGradient',
        x0: 0.5,
        y0: 0,
        x1: 0.5,
        y1: 1,
        colorStops: [{
            offset: 0,
            color: '#FF3366'
        }, {
            offset: 1,
            color: '#B2183E'
        }]
    };
    var anchorGradient = {
        type: 'radialGradient',
        x0: 0.35,
        y0: 0.35,
        r0: 0.0,
        x1: 0.35,
        y1: 0.35,
        r1: 1,
        colorStops: [{
            offset: 0,
            color: '#fc3c7f'
        }, {
            offset: 1,
            color: '#e81d64'
        }]
    };
    $('#jqRadialGauge').jqRadialGauge({
        background: '#F7F7F7',
        border: {
            lineWidth: 8,
            strokeStyle: '#5250a3',
            padding: 16,
        },
        shadows: {
            enabled: false
        },
        anchor: {
            visible: true,
            fillStyle: anchorGradient,
            radius: 0.10
        },
        tooltips: {
            disabled: false,
            highlighting: true
        },
        animation: {
            duration: 1
        },
        scales: [{
            minimum: 300,
            maximum: 900,
            startAngle: 180,
            endAngle: 360,
            majorTickMarks: {
                length: 12,
                lineWidth: 2,
                interval: 10,
                offset: 0.84,
                visible: false,
            },
            minorTickMarks: {
                visible: false,
                length: 8,
                lineWidth: 2,
                interval: 2,
                offset: 0.84
            },
            labels: {
                orientation: 'horizontal',
                interval: 150,
                offset: 1.00
            },
            needles: [{
                value: 300,
                type: 'pointer',
                outerOffset: 0.8,
                mediumOffset: 0.7,
                width: 8,
                fillStyle: '#333'
            }],
            ranges: [{
                outerOffset: 0.82,
                innerStartOffset: 0.76,
                innerEndOffset: 0.68,
                startValue: 40,
                endValue: 80,
                fillStyle: gradient1
            }, {
                outerOffset: 0.82,
                innerStartOffset: 0.68,
                innerEndOffset: 0.60,
                startValue: 80,
                endValue: 100,
                fillStyle: gradient2
            }]
        }]
    });
}

function priorityCitySort(a, b) {
    if (b.priority > a.priority) return 1;
    else if (b.priority < a.priority) return -1;
    else if (b.name < a.name) return 1;
    else if (b.name > a.name) return -1;
    else return 0;
}

function nameCitySort(a, b) {
    if (b.name < a.name) return 1;
    else if (b.name > a.name) return -1;
    else return 0;
}

function prePopulateLocations() {
    //set userLocation
    var userLocation = $('#hdnUserLocation').val();
    var userLocationList = locationList.cities.slice().sort(priorityCitySort);
    var items = '<option value="" class="chosenHide"></option>';
    $.each(userLocationList, function(k, v) {
        if (userLocation == v.serial) {
            items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
        } else {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    $('#userLocation').html(items).trigger("chosen:updated");
    //set userCurrentCountry
    var userCurrentCountry = $('#hdnUserCurrentCountry').val();
    var items = '<option value="" class="chosenHide"></option>';
    $.each(locationList.countries, function(k, v) {
        if (userCurrentCountry == v.serial) {
            items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
        } else {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    $('#userCurrentCountry').html(items).trigger("chosen:updated");
    if (userCurrentCountry != '') {
        //set userCurrentState
        var userCurrentState = $('#hdnUserCurrentState').val();
        var items = '<option value="" class="chosenHide"></option>';
        $.each(locationList.states, function(k, v) {
            if (userCurrentCountry == v.parent) {
                if (userCurrentState == v.serial) {
                    items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                } else {
                    items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                }
            }
        });
        $('#userCurrentState').html(items).trigger("chosen:updated");
        if (userCurrentState != '') {
            //set userCurrentCity
            var userCurrentCity = $('#hdnUserCurrentCity').val();
            var items = '<option value="" class="chosenHide"></option>';
            $.each(locationList.cities, function(k, v) {
                if (userCurrentState == v.parent) {
                    if (userCurrentCity == v.serial) {
                        items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                    } else {
                        items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                    }
                }
            });
            $('#userCurrentCity').html(items).trigger("chosen:updated");
        }
    }
    //set userPermanentCountry
    var userPermanentCountry = $('#hdnUserPermanentCountry').val();
    var items = '<option value="" class="chosenHide"></option>';
    $.each(locationList.countries, function(k, v) {
        if (userPermanentCountry == v.serial) {
            items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
        } else {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    $('#userPermanentCountry').html(items).trigger("chosen:updated");
    if (userPermanentCountry != '') {
        //set userPermanentState
        var userPermanentState = $('#hdnUserPermanentState').val();
        var items = '<option value="" class="chosenHide"></option>';
        $.each(locationList.states, function(k, v) {
            if (userPermanentCountry == v.parent) {
                if (userPermanentState == v.serial) {
                    items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                } else {
                    items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                }
            }
        });
        $('#userPermanentState').html(items).trigger("chosen:updated");
        if (userPermanentState != '') {
            //set userPermanentCity
            var userPermanentCity = $('#hdnUserPermanentCity').val();
            var items = '<option value="" class="chosenHide"></option>';
            $.each(locationList.cities, function(k, v) {
                if (userPermanentState == v.parent) {
                    if (userPermanentCity == v.serial) {
                        items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                    } else {
                        items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                    }
                }
            });
            $('#userPermanentCity').html(items).trigger("chosen:updated");
        }
    }
    //set coApplicant Country
    var coApplicantCurrentCountry = $('#hdnCoApplicantCurrentCountry').val();
    var items = '<option value="" class="chosenHide"></option>';
    $.each(locationList.countries, function(k, v) {
        if (coApplicantCurrentCountry == v.serial) {
            items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
        } else {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    $('#coApplicantCurrentCountry').html(items).trigger("chosen:updated");
    if (coApplicantCurrentCountry != '') {
        //set coApplicantCurrentCountry 
        var coApplicantCurrentState = $('#hdnCoApplicantCurrentState').val();
        var items = '<option value="" class="chosenHide"></option>';
        $.each(locationList.states, function(k, v) {
            if (coApplicantCurrentCountry == v.parent) {
                if (coApplicantCurrentState == v.serial) {
                    items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                } else {
                    items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                }
            }
        });
        $('#coApplicantCurrentState').html(items).trigger("chosen:updated");
        if (coApplicantCurrentState != '') {
            //set coApplicantCurrentCity
            var coApplicantCurrentCity = $('#hdnCoApplicantCurrentCity').val();
            var items = '<option value="" class="chosenHide"></option>';
            $.each(locationList.cities, function(k, v) {
                if (coApplicantCurrentState == v.parent) {
                    if (coApplicantCurrentCity == v.serial) {
                        items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
                    } else {
                        items += "<option value='" + v.serial + "'>" + v.name + "</option>";
                    }
                }
            });
            $('#coApplicantCurrentCity').html(items).trigger("chosen:updated");
        }
    }
}

function sort_by(field, reverse, primer) {
    function key(x) {
        return primer ? primer(x[field]) : x[field]
    };
    return function(a, b) {
        var A = key(a),
            B = key(b);
        return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [-1, 1][+!!reverse];
    }
}

function meter(score) {
    initJqRadialGaugeRadial();
    var scales = $('#jqRadialGauge').jqRadialGauge('option', 'scales');
    scales[0].needles[0].value = score;
    $('#jqRadialGauge').jqRadialGauge('update');
    countAnimation(score);
}

function verifyHlApplication() {
    var ERROR = false;
    return (!ERROR);
}

function countAnimation(txt) {
    $('.count').each(function() {
        $(this).prop('Counter', 0).animate({
            Counter: txt
        }, {
            duration: 1200,
            easing: 'swing',
            step: function(now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
}
$.fn.autoTab = function() {
    autoTabOn = true;
    // yes, it's global. If you turn off auto tabbing on one input, you turn it off for all
    var autoTabbedInputs = this.find('input');
    var almostTabbedInputs = autoTabbedInputs.parents('.otpOuter').not(':last-child'); // note we don't attach tabbing event to the last of an input group. If you tab out of there, you have a reason to
    var justAutoTabbed = false;
    var tabKeyDetected = false;
    var revTabKeyDetected = false;
    var inputField = false;
    var autoKeyDetected = false;
    // init
    function init() {
        detectKeyDown();
    }
    // keydown detection, hijack it if it's in the fields we're looking for
    function detectKeyDown() {
        autoTabbedInputs.on('keydown', function(ev) {
            inputField = this;
            // detect keystroke in the fields 
            ev = ev || event;
            var charCode = null;
            if ("which" in ev) charCode = ev.which;
            else if ("keyCode" in e) charCode = ev.keyCode;
            else if ("keyCode" in window.event) charCode = window.event.keyCode;
            else if ("which" in window.event) charCode = window.event.which;
            if (charCode === 9 && ev.shiftKey) {
                revTabKeyDetected = true;
                // backspace key fakes reverse tab
            } else if (charCode === 8 && this.value.length == 0) {
                revTabKeyDetected = true;
                $(this).parents('.otpOuter').prev('div').find('input').focus();
                // fake tab keystrokes
            } else if (((charCode === 48) || (charCode === 49) || (charCode === 50) || (charCode === 51) || (charCode === 52) || (charCode === 53) || (charCode === 54) || (charCode === 55) || (charCode === 56) || (charCode === 57)) && this.value.length >= $(this).attr('maxlength')) {
                autoKeyDetected = true;
                $(this).parents('.otpOuter').next('div').find('input').focus();
                // fake tab keystrokes
            } else if (charCode === 32) {
                ev.preventDefault();
                // if we've not yet hit the max chars for this field, and haven't already just auto-tabbed, fake a tab key
                if (hasHitMaxChars(this.input) && justAutoTabbed) {
                    $(this).parents('.otpOuter').next('div').find('input').focus();
                }
            }
            // removed any flag to say we've just auto-tabbed
            justAutoTabbed = false;
        });
    }
    // detect if a field has hit max chars
    function hasHitMaxChars(el) {
        var elObj = $(el);
        var maxFieldLength = elObj.attr('maxlength');
        var valueLength = el.value.length;
        if (valueLength >= maxFieldLength) {
            return true;
        }
        return false;
    }
    // init function!
    init();
}
$.fn.autoTabQuick = function() {
    autoTabOn = true;
    // yes, it's global. If you turn off auto tabbing on one input, you turn it off for all
    var autoTabbedInputs = this.find('input');
    var almostTabbedInputs = autoTabbedInputs.parents('.otpOuter').not(':last-child'); // note we don't attach tabbing event to the last of an input group. If you tab out of there, you have a reason to
    var justAutoTabbed = false;
    var tabKeyDetected = false;
    var revTabKeyDetected = false;
    var inputField = false;
    var autoKeyDetected = false;
    // init
    function init() {
        detectKeyDown();
    }
    // keydown detection, hijack it if it's in the fields we're looking for
    function detectKeyDown() {
        autoTabbedInputs.on('keydown', function(ev) {
            inputField = this;
            // detect keystroke in the fields 
            ev = ev || event;
            var charCode = null;
            if ("which" in ev) charCode = ev.which;
            else if ("keyCode" in e) charCode = ev.keyCode;
            else if ("keyCode" in window.event) charCode = window.event.keyCode;
            else if ("which" in window.event) charCode = window.event.which;
            if (charCode === 9 && ev.shiftKey) {
                revTabKeyDetected = true;
                // backspace key fakes reverse tab
            } else if (charCode === 8 && this.value.length == 0) {
                revTabKeyDetected = true;
                $(this).parents('.otpOuter').prev('div').find('input').focus();
                // fake tab keystrokes
            } else if (((charCode === 48) || (charCode === 49) || (charCode === 50) || (charCode === 51) || (charCode === 52) || (charCode === 53) || (charCode === 54) || (charCode === 55) || (charCode === 56) || (charCode === 57)) && this.value.length >= $(this).attr('maxlength')) {
                autoKeyDetected = true;
                $(this).parents('.otpOuter').next('div').find('input').focus();
                // fake tab keystrokes
            } else if (charCode === 32) {
                ev.preventDefault();
                // if we've not yet hit the max chars for this field, and haven't already just auto-tabbed, fake a tab key
                if (hasHitMaxChars(this.input) && justAutoTabbed) {
                    $(this).parents('.otpOuter').next('div').find('input').focus();
                }
            }
            // removed any flag to say we've just auto-tabbed
            justAutoTabbed = false;
        });
    }
    // detect if a field has hit max chars
    function hasHitMaxChars(el) {
        var elObj = $(el);
        var maxFieldLength = elObj.attr('maxlength');
        var valueLength = el.value.length;
        if (valueLength >= maxFieldLength) {
            return true;
        }
        return false;
    }
    // init function!
    init();
}

$('#example1').autoTab();
$('#example2').autoTab();
$('#example3').autoTab();
$('#eligibility').autoTab();
$('#inhouseAppDob').autoTab();
$('#inhouseCoAppDob').autoTab();
$('#eligibilityQuick').autoTabQuick();



function compareDate(date1, date2) {
    if ((typeof date1 === 'undefined') || (typeof date2 === 'undefined')) {
        return false;
    }
    var date1 = new Date(date1);
    var date2 = new Date(date2);
    return (date1 >= date2);
}

function saveApiResponse(obj) {
    //console.log(obj);
    if (typeof(obj) === 'object') {
        var apiUrl = environment() + '/save-api-response';
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: obj,
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            beforeSend: function() {},
            success: function(response) {
                console.log('save-api-response' + response);
            },
            error: function(d) {
                console.log(d);
            }
        });
    }
}

function clickToCall($this) {
    var apiUrl = ($('#BASE_URL').val()) + '/clicktocall';
    var appId = $('#appId').val();
    var obj = {
        'id': appId
    };
    if (appId != '') {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: obj,
            headers: {
                'X-CSRF-TOKEN': $('input[name="_token"]').val(),
            },
            beforeSend: function() {
                $this.attr('disabled', true);
                $('#clickToCallNotify').text('').hide();
            },
            success: function(response) {
                if (response.ERROR == false) {
                    $this.text('Call In Progress...');
                    $('#clickToCallNotify').text(response.RESPONSE_MSG).show();
                } else {
                    $this.attr('disabled', false);
                    $('#clickToCallNotify').text(response.RESPONSE_MSG).show();
                    //$('#clickToCallNotify').text('All agents are busy right now. Please try after some time.').show();
                }
            },
            error: function(d) {
                $this.attr('disabled', false);
                $('#clickToCallNotify').text('Something went wrong.').show();
                console.log(d);
            }
        });
    } else {
        $('#clickToCallNotify').text('Something went wrong.').show();
    }
}
$(document).ready(function() {
    $(document).on("keypress", 'form input', function(e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            e.preventDefault();
            return false;
        }
    });
    $('#clickToCall').on('click', function() {
        if ($(this).attr('disabled') == 'disabled') {
            return false;
        }
        clickToCall($(this));
    });
});

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function generateStateOptions(states, currentCountry) {
    var items = '<option value="" class="chosenHide"></option>';
    $.each(states.slice().sort(nameCitySort), function(k, v) {
        if (currentCountry == v.parent) {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    return items
}

function generateCityOptions(cities, currentState) {
    var items = '<option value="" class="chosenHide"></option>';
    $.each(cities.slice().sort(nameCitySort), function(k, v) {
        if (currentState == v.parent) {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    return items
}

function generatedSelectedOfferCard(offer) {
    // console.log(offer);
    // console.log('#planSliderMain .offerTile[data-bank="'+offer.bankId+'"][data-interest-type="'+offer.interestRateTypeID+'"]');
    var div = $('#planSliderMain .offerTile[data-bank="' + offer.bankId + '"][data-interest-type="' + offer.interestRateTypeID + '"]');
    // console.log(div);
    if (div != 'undefined') {
        var emiParam = {};
        emiParam.principal = div.find('span.amount').data('amount');
        emiParam.roi = div.find('span.interest').data('interest');
        emiParam.tenure = div.find('span.tenure').data('tenure') * 12;
        var objToRender = {};
        objToRender.bankId = parseInt(offer.bankId);
        objToRender.interestRateTypeID = parseInt(offer.interestRateTypeID);
        objToRender.chequeInFavour = $.trim(div.find('input.chequeInFavour').val());
        objToRender.bankName = $.trim(div.find('div.bankLogo p').data('name'));
        objToRender.bankImage = div.find('div.bankLogo figure img').attr('src');
        objToRender.loanAmount = parseInt(div.find('span.amount').data('amount'));
        objToRender.loanTenure = parseInt(div.find('span.tenure').data('tenure'));
        objToRender.interestRate = parseFloat(div.find('span.interest').data('interest'));
        objToRender.interestRateType = $.trim(div.find('span.interest').data('type'));
        objToRender.emi = parseInt(div.find('span.emi').data('emi'));
        objToRender.emiPerLac = parseInt(div.find('input.emiPerLac').val());
        objToRender.processingFeesAmount = (div.find('span.processing') != 'undefined') ? div.find('span.processing').data('processing') : null;
        objToRender.emiUrl = TOOLS_PATH + 'emi-chart?' + $.param(emiParam);
        objToRender.commanSeparated = {
            'loanAmount': div.find('span.amount').data('amount').toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            'emi': div.find('span.emi').data('emi').toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            'emiPerLac': div.find('input.emiPerLac').val().toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
            //'processingFeesAmount' : div.find('span.processing').data('processing').toString().replace(/\D/g, "").replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
        };
        //delete offer if already exists
        var index = OBJ_APPLICATION.findIndex(function(offer) {
            if (offer.bankId == objToRender.bankId) {
                return offer.interestRateTypeID == objToRender.interestRateTypeID;
            }
        });
        if (index != -1) {
            OBJ_APPLICATION.splice(index, 1);
        }
        OBJ_APPLICATION.push(objToRender);
        generatedSelectedOfferCardTile(objToRender)
    }
}

function generatedSelectedOfferCardTile(objToRender) {
    // $.get('public/assets/templates/loan-quotes.ejs?v=' + APP_VERSION).success(function(resp){
     $.get(APP_BASE_PATH + 'public/assets/templates/loan-quotes.ejs?v=' + APP_VERSION).success(function(resp) {
        var html = ejs.render(objToRender,resp);
        $('#quotesTable').append(html).show();
    });
}

function deleteSelectedOffer(bank, interest, div) {
    var index = OBJ_APPLICATION.findIndex(function(offer) {
        if (offer.bankId == bank) {
            return offer.interestRateTypeID == interest;
        }
    });
    if (index != -1) {
        OBJ_APPLICATION.splice(index, 1);
    }
    $('#quotesTable').find('.offerTileBox[data-bank="' + bank + '"][data-interest-type="' + interest + '"]').remove();
}

function resetOtp() {
    $('#first, #second, #third, #fourth').val('');
    $('#otpOptions, #btnResendOtp, #imgMobileVerified, #btnMobileNext').hide();
    $('#btnOtpNxt').show();
    $('#btnOtpNxt').text('Send OTP');
    $('#btnOtpNxt').attr('data-value', 'send');
}

function updateCoApplicantLabel(name) {
    //console.log(name);
    $('.coAppName').text(name);
    $('#borrowerType').find('option:eq(2)').text('Co- Applicant (' + name + ')').trigger("chosen:updated");
}

function setInhouseDocs(nationality, occupationId, applicantTypeId) {
    var appcoapp = (applicantTypeId == 1) ? 'app' : 'coapp';
    var applicantSpecificId = (applicantTypeId == 1) ? $("#applicantId").val() : $("#coApplicantId").val();
    var pivotDiv = (applicantTypeId == 1) ? $("#applicantAccordionBox") : $("#coapplicantAccordionBox");
    var loader = (applicantTypeId == 1) ? $("#appDocLoader") : $("#coAppDocLoader");
    pivotDiv.empty();
    var nonEditable = (APP_STATUS == 4) ? true : false;
    var i = 1;
    var APPLICANT_DOCS = [];
    var APPLICANT_COLLECTED_DOCS = [];
    var j = 0,
        k = 0;
    url = environment() + '/get-updated-documents';
    data = {
        'appId': $('#appId').val(),
        'nationality': nationality,
        'occupationId': occupationId,
        'applicantId': applicantSpecificId,
        'applicantTypeId': applicantTypeId
    };
    UPLOADED_DOCUMENTS = [];
    COLLECTED_DOCUMENTS = [];
    return $.ajax({
        type: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name=csrf]').attr("value"),
        },
        url: url,
        data: data,
        beforeSend: function() {
            //loader.show();
        },
        success: function(data) {
            loader.hide();
            UPLOADED_DOCUMENTS = data.uploadedDocs;
            COLLECTED_DOCUMENTS = data.collectedDocs;
            $.each(UPLOADED_DOCUMENTS, function(key, item) {
                var path = (item.path).split('.');
                var n = path.length;
                (path[n - 1] == 'pdf') ? (item.isPDF = '1') : (item.isPDF = '0')
                if (item.applicantId == applicantSpecificId) {
                    APPLICANT_DOCS[k] = item;
                    k++;
                }
            });
            $.each(COLLECTED_DOCUMENTS, function(key, item) {
                if (item.applicantId == applicantSpecificId) {
                    APPLICANT_COLLECTED_DOCS[j] = item;
                    j++;
                }
            });
            var REQD_DOC_TYPE = getReqdDocTypes(occupationId, nationality, applicantTypeId);
            var mandatory = getMandatory(nationality, occupationId, applicantTypeId, origin);
            $.get(APP_BASE_PATH + 'public/assets/templates/inhouse-prepopulate-documents.ejs?v=' + APP_VERSION).success(function(resp) {
                $.each(REQD_DOC_TYPE, function(key, item) {
                    if (item.parent_id == '0' || item.parent_id == '-1') {
                        //var categoryDiv = '<div class="panel panel-default"><div class="panel-heading" role="tab" id="headingTwo"><h4 class="panel-title"><a class="collapsed" role="button" data-toggle="collapse" id="'+appcoapp +'coll' + i + '" data-parent="#'+appcoapp+'licantAccordionBox" href="#'+appcoapp+'collapse' + i + '" aria-expanded="false" aria-controls="collapseTwo"> <i class="more-less icon-plus-circle"></i>' + i + '. ' + item.name + '</a></h4></div><div id="'+appcoapp+'collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo"><div class="panel-body" id ="' + item.id + appcoapp+'category"><div class="checkboxRow"><div class="checkDocument">Check on Collected documents</div></div></div></div></div>';
                        var categoryDiv = '<div class="panel panel-default"><div class="panel-heading" role="tab" id="headingFour"><h4 class="panel-title"> <a role="button" data-toggle="collapse" id="' + appcoapp + 'coll' + i + '" data-parent="#' + appcoapp + 'licantAccordionBox" href="#' + appcoapp + 'collapse' + i + '" aria-expanded="false" aria-controls="collapseFour"> <i class="more-less icon-plus-circle"></i>' + i + '. ' + item.name + '</a></h4><div class="documentMissingBox" style="display: none">Mandatory documents must be collected</div></div><div id="' + appcoapp + 'collapse' + i + '" class="panel-collapse collapse docAccordion" role="tabpanel" aria-labelledby="headingFour"><div class="panel-body" id ="' + item.id + appcoapp + 'category">';
                        pivotDiv.append(categoryDiv);
                        var parentId = item.id;
                        $.each(REQD_DOC_TYPE, function(key, item) {
                            if (item.parent_id == parentId) {
                                item.PREP = APPLICANT_DOCS;
                                item.nonEditable = nonEditable;
                                item.COLLECTED = APPLICANT_COLLECTED_DOCS;
                                item.appcoappval = appcoapp;
                                item.DIGIO_ENABLE = DIGIO_ENABLE;
                                item.mandatory = mandatory;
                                var html = ejs.render(resp, item);
                                $("#" + parentId + appcoapp + "category").append(html);
                            }
                        });
                        i++;
                    }
                });
                $("#" + appcoapp + "coll1").trigger('click');
            });
        },
        error: function(jqXHR, textStatus, errorMsg) {
            $('#popupLoaderBox').hide();
        }
    });
}

function getReqdDocTypes(occupationId, nationality, isCoapp) {
    var REQD_DOC_TYPE = [];
    $.map(DOC_TYPE.labels, function(a) {
        if ($.inArray(a['id'], DOCUMENT_TYPES.CommonDoc) >= 0) {
            REQD_DOC_TYPE.push(a);
        }
        if (occupationId == 1) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.SalariedDoc) >= 0) {
                REQD_DOC_TYPE.push(a);
            }
        } else if (occupationId == 2 || occupationId == 3) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.SelfEmployedDoc) >= 0) {
                REQD_DOC_TYPE.push(a);
            }
        }
        if (nationality != 2) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.NRIDoc) >= 0) {
                REQD_DOC_TYPE.push(a);
            }
        }
        if (isCoapp == 2) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.RelationshipDoc) >= 0) {
                REQD_DOC_TYPE.push(a);
            }
        }
    });
    return REQD_DOC_TYPE;
}

function generateCountryOptions(countryId = '') {
    var items = '<option value="" class="chosenHide"></option>';
    $.each(locationList.countries, function(k, v) {
        if (countryId == v.serial) {
            items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
        } else {
            items += "<option value='" + v.serial + "'>" + v.name + "</option>";
        }
    });
    return items;
}

function editableDetails(data, applicantTypeId) {
    data = {
        incomeCurrency: 3,
        salaryCreditIn: 2,
        companyName: "fvyeduegu"
    };
    //data = JSON.stringify(data);
    var targetDiv = $(".empOccDetails[data-applicant=" + applicantTypeId + "]");
    $("[data-applicant=" + applicantTypeId + "].empOccDetails").each(function(k, v) {
        $.each(data, function(key, value) {
            $(".empOccDetails[data-applicant=" + applicantTypeId + "]").find("[data-field=" + key + "]").text(value);
        });
    });
}

function setAttoryneyFields(div) {
    if (div.is(':checked') == true) {
        $('.personalDetails [data-applicant=1][data-field=gpa]').each(function() {
            $('[data-applicant=2][data-field=gpa][name=' + $(this).attr('name') + ']').val($(this).val());
            inputErrorHide($('[data-applicant=2][name=' + $(this).attr('name') + ']'));
        });
        $('[data-applicant=2][data-field=gpa]').prop('disabled', true).addClass('disabled').addClass('skip');
    } else {
        $('[data-applicant=2][data-field=gpa]').prop('disabled', false).removeClass('disabled').removeClass('skip');
    }
    $('.chosen-select[data-applicant=2][data-field=gpa]').trigger('chosen:updated');
    triggerInput();
}

async function setOtherIncome(targetDiv, occupationId, origin) {
    if (typeof(origin) === 'undefined') {
        origin = '';
    }
    var tempOption = '';
    var dropDown = targetDiv.find('.otherIncome select');
    dropDown.html('');
    dropDown.append($("<option></option>").attr("value", '').attr("class", 'chosenHide').text(''));
    console.log(dropDownType)
    $.each(dropDownType, function(id, obj) {
        if (id == 0 || id == occupationId) {
            $.each(obj, function(idx, option) {
                if (option.is_included == 1) {
                    if (origin == 'yesBank' && option.income.toLowerCase() == 'bonus/incentive') {
                        tempOption = 'Avg. Monthly Bonus/Incentive';
                    } else if(origin != 'iciciBre' && option.income.toLowerCase() == 'cc or od interest' && (occupationId != 2 && occupationId != 3)){
                        delete option[idx]
                    }
                     else {
                        tempOption = option.income;
                    }
                    dropDown.append($("<option ></option>").attr("value", option.id)
                        // .attr("data-incomeTypeId",option.id)
                        // .attr("data-incomeTypeName",option.income)
                        .attr("data-incomeTypeName", tempOption).attr("data-occupation", option.occupation_type).attr("data-incomeType", option.type).attr("data-frequency", option.income_frequency).attr("data-included", option.is_included).text(tempOption));
                }
            })
        }
    });
    dropDown.trigger('chosen:updated');
    targetDiv.find('.otherIncome input').val('');
}

function vaidateDob(userDobDD, userDobMM, userDobYY) {
    if ($.isNumeric(userDobDD) && $.isNumeric(userDobMM) && $.isNumeric(userDobYY)) {
        var tempDob = userDobMM + '/' + userDobDD + '/' + userDobYY;
        if (validateDate(tempDob)) {
            if (!validateAge(tempDob)) {
                inputErrorShow($('#userDobDD'), Error[$('#userDobDD').attr('data-error')]['age']);
                return false;
            }
            inputErrorHide($('#userDobDD'));
            var pushDob = userDobYY + '-' + userDobMM + '-' + userDobDD;
            var jsonData = {
                "applicant": [{
                    "applicantId": $("#applicantId").val(),
                    "userDob": pushDob
                }]
            };
            pushBulkData(jsonData);
            tempDob = userDobDD + '-' + userDobMM + '-' + userDobYY;
        } else {
            inputErrorShow($('#userDobDD'), Error[$('#userDobDD').attr('data-error')]['error']);
        }
    } else {
        inputErrorShow($('#userDobDD'), Error[$('#userDobDD').attr('data-error')]['error']);
    }
}

function populateCitiesfromCountry(cityId, userCountry) {
    // console.log('cityId: '+cityId, 'userCountry: '+userCountry);
    var userLocationList = locationList.cities.slice().sort(priorityCitySort);
    var userStateList = locationList.states.slice();
    var items = '<option value="" class="chosenHide"></option>';
    $.each(userLocationList, function(k, v) {
        var state = userStateList.filter(function(stateItem) {
            if (stateItem.serial == v.parent) {
                return stateItem;
            }
        });
        if (state[0].parent == userCountry) {
            if (cityId == v.serial) {
                items += "<option value='" + v.serial + "' selected>" + v.name + " (" + state[0].name + ")</option>";
            } else {
                items += "<option value='" + v.serial + "'>" + v.name + " (" + state[0].name + ")</option>";
            }
        }
    });
    return items;
}

// function populateRegionsfromCities(cityId, userCountry){
function populateRegionsfromCities(regionId, cityId){
    var userSublocationList = locationList.subLocations.slice();
    var items = '<option value="0" class="chosenHide"></option>';
    var numItems = 0;
    $.each(userSublocationList, function(k, v) {
        if (v.parent == cityId) {
            if (regionId == v.serial) {
                items += "<option value='" + v.serial + "' selected>" + v.name + "</option>";
            } else {
                items += "<option value='" + v.serial + "'>" + v.name + "</option>";
            }
            numItems++;
        }
    });

    if(numItems > 0){
        return items;
    }else {
        return '';
    }
}

function stateFromCity(cityId) {
    var userLocationList = locationList.cities.slice().sort(priorityCitySort);
    var userStateList = locationList.states.slice();
    var city = userLocationList.filter(function(cityItem) {
        if (cityItem.serial == cityId) {
            return cityItem;
        }
    });
    if (city.length > 0) {
        var state = userStateList.filter(function(stateItem) {
            if (city[0].parent == stateItem.serial) {
                return stateItem;
            }
        });
    }
    return state;
}

function showApplicationErrors(response) {
    if (response.RESPONSE_MSG == 'validation fails') {
        $.each(response.RESPONSE_DATA, function(key, value) {
            applicantTypeId = (key == 'applicant') ? 1 : 2;
            $.each(value, function(k, v) {
                var ele = $('[data-applicant="' + applicantTypeId + '"][name="' + k + '"]');
                var errorUpLevel = 0;
                if (ele.data('errorUpLevel')) {
                    errorUpLevel = ele.data('errorUpLevel');
                }
                inputErrorShow(ele, v, errorUpLevel);
            });
        });
    }
}

// function validateUser(userData, applicantTypeId) {
//     var applicant = 1,
//         coApplicant = 2,
//         ERROR = false;
//     var errorsArr = new Array;
//     if (!userData.hasOwnProperty('userName') || !validateName(userData.userName)) {
//         ERROR = true;
//         errorsArr.push(Error.userName.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userName"]'), Error.userName.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userName"]'));
//     }
//     if (!userData.hasOwnProperty('userEmail') || !validateEmail(userData.userEmail)) {
//         ERROR = true;
//         errorsArr.push(Error.userEmail.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userEmail"]'), Error.userEmail.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userEmail"]'));
//     }
//     if ((applicantTypeId == coApplicant) && (!userData.hasOwnProperty('userCountryCode') || isNaN(userData.userCountryCode))) {
//         ERROR = true;
//         errorsArr.push(Error.userCountryCode.err);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userMobile"]'), Error.userCountryCode.err);
//     }
//     if ((applicantTypeId == coApplicant) && (!userData.hasOwnProperty('userMobile') || !validateMobile(userData.userMobile))) {
//         ERROR = true;
//         errorsArr.push(Error.userMobile.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userMobile"]'), Error.userMobile.error);
//     } else {
//         var mobile = $('[data-applicant="' + applicantTypeId + '"][name="userMobile"]');
//         var regex = new RegExp(mobile.attr('regex'));
//         if (!regex.test(mobile.val())) {
//             ERROR = true;
//             errorsArr.push('Enter valid mobile number');
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userMobile"]'), 'Enter valid mobile number');
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userMobile"]'));
//         }
//     }
//     if (!userData.hasOwnProperty('userDobDD') || !userData.hasOwnProperty('userDobMM') || !userData.hasOwnProperty('userDobYY') || !validateDate(userData.userDobMM + "/" + userData.userDobDD + "/" + userData.userDobYY) || !validateAge(userData.userDobMM + "/" + userData.userDobDD + "/" + userData.userDobYY)) {
//         ERROR = true;
//         errorsArr.push(Error.userDob.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userDobDD"]'), Error.userDob.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userDobDD"]'));
//     }
//     if ($.inArray(userData.userGender, ['male', 'female']) == -1) {
//         ERROR = true;
//         errorsArr.push(Error.userGender.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userGender"]'), Error.userGender.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userGender"]'));
//     }
//     if (!userData.hasOwnProperty('userPAN') || !validatePan(userData.userPAN)) {
//         ERROR = true;
//         errorsArr.push(Error.userPAN.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userPAN"]'), Error.userPAN.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userPAN"]'));
//     }
//     if (!userData.hasOwnProperty('userAadhaar') || ((userData.userAadhaar != '') && !validateAadhar(userData.userAadhaar))) {
//         ERROR = true;
//         errorsArr.push(Error.userAadhaar.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userAadhaar"]'), Error.userAadhaar.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userAadhaar"]'));
//     }
//     if ((applicantTypeId == applicant) || ((userData.hasOwnProperty('userIsAddressSame')) && (userData['userIsAddressSame'])) == 0) {
//         if (!userData.hasOwnProperty('currentAddress') || !validateAddress(userData.currentAddress)) {
//             ERROR = true;
//             errorsArr.push(Error.userAddress.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="currentAddress"]'), Error.userAddress.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="currentAddress"]'));
//         }
//         if (!userData.hasOwnProperty('currentCountry') || !$.isNumeric(userData.currentCountry)) {
//             ERROR = true;
//             errorsArr.push(Error.userCountry.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="currentCountry"]'), Error.userCountry.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="currentCountry"]'));
//         }
//         if (!userData.hasOwnProperty('currentCity') || !$.isNumeric(userData.currentCity)) {
//             ERROR = true;
//             errorsArr.push(Error.userCity.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="currentCity"]'), Error.userCity.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="currentCity"]'));
//         }
//         // if (applicantTypeId == 1 && !$.isNumeric(userData.currentRegion)) {
//         //     console.log(userData.currentRegion);
//         //     ERROR = true;
//         //     errorsArr.push(Error.currentRegion.error);
//         //     inputErrorShow($('[data-applicant=1][name="currentRegion"]'), Error.currentRegion.error);
//         // } else {
//         //     inputErrorHide($('[data-applicant=1][name="currentRegion"]'));
//         // }
//         if (!userData.hasOwnProperty('currentPincode') || !validatePin(userData.currentPincode)) {
//             ERROR = true;
//             errorsArr.push(Error.userPincode.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="currentPincode"]'), Error.userPincode.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="currentPincode"]'));
//         }
//     }
//     if ((applicantTypeId == applicant) && ((userData.hasOwnProperty('userIsAddressSame')) && (userData['userIsAddressSame'])) == 0) {
//         if (!userData.hasOwnProperty('permanentAddress') || !validateAddress(userData.permanentAddress)) {
//             ERROR = true;
//             errorsArr.push(Error.userAddress.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="permanentAddress"]'), Error.userAddress.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="permanentAddress"]'));
//         }
//         if (!userData.hasOwnProperty('permanentCountry') || !$.isNumeric(userData.permanentCountry)) {
//             ERROR = true;
//             errorsArr.push(Error.userCountry.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="permanentCountry"]'), Error.userCountry.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="permanentCountry"]'));
//         }
//         if (!userData.hasOwnProperty('permanentCity') || !$.isNumeric(userData.permanentCity)) {
//             ERROR = true;
//             errorsArr.push(Error.userCity.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="permanentCity"]'), Error.userCity.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="permanentCity"]'));
//         }
//         if (!userData.hasOwnProperty('permanentPincode') || !validatePin(userData.permanentPincode)) {
//             ERROR = true;
//             errorsArr.push(Error.userPincode.error);
//             inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="permanentPincode"]'), Error.userPincode.error);
//         } else {
//             inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="permanentPincode"]'));
//         }
//     }
//     if (!userData.hasOwnProperty('userNationalityId') || (!$.isNumeric(userData.userNationalityId))) {
//         ERROR = true;
//         errorsArr.push(Error.userNationalityId.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userNationalityId"]'), Error.userNationalityId.error);
//     } else {
//         if (userData.userNationalityId != 2) {
//             if (applicantTypeId == applicant || (userData.hasOwnProperty('userIsAttorneySame') && userData.userIsAttorneySame == 0)) {
//                 if (!userData.hasOwnProperty('attorneyAddress') || !validateAddress(userData.attorneyAddress)) {
//                     ERROR = true;
//                     errorsArr.push(Error.userAddress.error);
//                     inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="attorneyAddress"]'), Error.userAddress.error);
//                 } else {
//                     inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="attorneyAddress"]'));
//                 }
//                 if (!userData.hasOwnProperty('attorneyCity') || !$.isNumeric(userData.attorneyCity)) {
//                     ERROR = true;
//                     errorsArr.push(Error.userCity.error);
//                     inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="attorneyCity"]'), Error.userCity.error);
//                 } else {
//                     inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="attorneyCity"]'));
//                 }
//             }
//         }
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userNationalityId"]'));
//     }
//     if (applicantTypeId == coApplicant && (!userData.hasOwnProperty('coApplicantRelation') || !$.isNumeric(userData.coApplicantRelation))) {
//         ERROR = true;
//         errorsArr.push(Error.coAppRelation.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="coApplicantRelation"]'), Error.coAppRelation.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="coApplicantRelation"]'));
//     }
//     if (!userData.hasOwnProperty('userQualificationId') || !$.isNumeric(userData.userQualificationId)) {
//         ERROR = true;
//         errorsArr.push(Error.userQualificationId.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userQualificationId"]'), Error.userQualificationId.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userQualificationId"]'));
//     }
//     if (!userData.hasOwnProperty('userDependents') || !$.isNumeric(userData.userDependents)) {
//         ERROR = true;
//         errorsArr.push(Error.userDependents.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userDependents"]'), Error.userDependents.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userDependents"]'));
//     }
//     if (!userData.hasOwnProperty('userMaritalId') || !$.isNumeric(userData.userMaritalId)) {
//         ERROR = true;
//         errorsArr.push(Error.userMaritalId.error);
//         inputErrorShow($('[data-applicant="' + applicantTypeId + '"][name="userMaritalId"]'), Error.userMaritalId.error);
//     } else {
//         inputErrorHide($('[data-applicant="' + applicantTypeId + '"][name="userMaritalId"]'));
//     }
//     return (!ERROR);
//     // Sample for optional Field for coApplicant
//     /*if(
//         (applicantTypeId == applicant && 
//             (!userData.hasOwnProperty('userName') || !validateName(userData.userName))
//         )
//          || 
//         ((applicantTypeId == coApplicant && 
//             (userData.hasOwnProperty('userName') && userData.userName != '' && !validateName(userData.userName)))
//         )
//     )
//     {
//         inputErrorShow();
//     }else{
//         inputErrorHide();
//     }*/
// }

function validateReference(userData, refTypeId) {
    var ERROR = false;
    var errorsArr = new Array;
    if (!userData.hasOwnProperty('refName') || !validateName(userData.refName)) {
        ERROR = true;
        errorsArr.push(Error.userName.error);
        // console.log(errorsArr);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refName"]'), Error.userName.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refName"]'));
    }
    if (!userData.hasOwnProperty('refEmail') || (userData.refEmail != '' && !validateEmail(userData.refEmail))) {
        ERROR = true;
        errorsArr.push(Error.userEmail.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refEmail"]'), Error.userEmail.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refEmail"]'));
    }
    if ((!userData.hasOwnProperty('refContact') || !validateMobile(userData.refContact))) {
        ERROR = true;
        errorsArr.push(Error.userMobile.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refContact"]'), Error.userMobile.error);
    } else {
        // var mobile = $('[data-refnum="'+refTypeId+'"][name="refContact"]'); 
        // var regex = new RegExp(mobile.attr('regex'));
        // if(!regex.test(mobile.val())){
        //     ERROR = true;
        //     errorsArr.push('Enter valid mobile number');
        //     inputErrorShow($('[data-refnum="'+refTypeId+'"][name="refContact"]'), 'Enter valid mobile number');
        // }else{    
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refContact"]'));
        // }
    }
    if (!userData.hasOwnProperty('refAddress') || !validateAddress(userData.refAddress)) {
        ERROR = true;
        errorsArr.push(Error.userAddress.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refAddress"]'), Error.userAddress.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refAddress"]'));
    }
    if (!userData.hasOwnProperty('refCountry') || !$.isNumeric(userData.refCountry)) {
        ERROR = true;
        errorsArr.push(Error.userCountry.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refCountry"]'), Error.userCountry.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refCountry"]'));
    }
    if (!userData.hasOwnProperty('refCity') || !$.isNumeric(userData.refCity)) {
        ERROR = true;
        errorsArr.push(Error.userCity.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refCity"]'), Error.userCity.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refCity"]'));
    }
    if (!userData.hasOwnProperty('refPin') || !validatePin(userData.refPin)) {
        ERROR = true;
        errorsArr.push(Error.userPincode.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refPin"]'), Error.userPincode.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refPin"]'));
    }
    if ((!userData.hasOwnProperty('refRelation') || (userData.refRelation == ''))) {
        ERROR = true;
        errorsArr.push(Error.coAppRelation.error);
        inputErrorShow($('[data-refnum="' + refTypeId + '"][name="refRelation"]'), Error.coAppRelation.error);
    } else {
        inputErrorHide($('[data-refnum="' + refTypeId + '"][name="refRelation"]'));
    }
    return (!ERROR);
}

function rupeeFormat(amount) {
    result = '';
    amount = unformatMoney(amount);
    if (amount > 0) {
        amount = amount.toString();
        var afterPoint = '';
        if (amount.indexOf('.') > 0) {
            afterPoint = amount.substring(amount.indexOf('.'), amount.length);
        }
        amount = Math.floor(amount);
        amount = amount.toString();
        var lastThree = amount.substring(amount.length - 3);
        var otherNumbers = amount.substring(0, amount.length - 3);
        if (otherNumbers != '') {
            lastThree = ',' + lastThree;
        }
        var result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    }
    return result;
}

function unformatMoney(str) {
    if (str != undefined && str != "" && str.toString().indexOf(",") != "-1") {
        str = ("" + str).replace(/\,/g, '');
    }
    return (str);
}

function setIncomeCurrency(targetDiv) {
    var section = targetDiv.parents('.empSection');
    section.find('.incomeInput').attr('placeholder', targetDiv.find('option:selected').text());
    section.find('.obligationInput').attr('placeholder', targetDiv.find('option:selected').text());
}

function validateWorkDetails(parent) {
    var optionalIncomeValidation = {
        'AnnualGrossSalary':{
            // min:minIncome,
            max:maxIncome,
        },
        'MonthlyTaxdeduction':{
            min:0,
        }
    };
    var incomeCanBeZero = []
    totalMainIncome = 0;
    var formData = [];
    var workDetails = parent.find('div.employmentFieldBox').find('form.empForm').serializeArray();
            // console.log(applicantsData);
    // console.log(formData, applicantsData);
    $.map(workDetails, function(k) {
        var minimumIncome = minIncome;
        var maximumIncome = maxIncome;
        formData[k.name] = k.value;
            if($.inArray(k.name, Object.keys(optionalIncomeValidation))>=0){
                if(!isEmpty(optionalIncomeValidation[k.name].min)){
                    minimumIncome = optionalIncomeValidation[k.name].min;
                }else{
                    if(parent.find('div.employmentFieldBox').find('form.empForm [name=incomeCurrency]').val() != 1){
                        minimumIncome = 1;
                    }
                }
                if(!isEmpty(optionalIncomeValidation[k.name].max)){
                    maximumIncome = optionalIncomeValidation[k.name].max;
                }
            }else{
                if(parent.find('div.employmentFieldBox').find('form.empForm [name=incomeCurrency]').val() != 1){
                    minimumIncome = 1;
                }
            }
            if (parent.find('form.empForm [name=' + k.name + ']').data('type') == 'currency') {
                if (!parent.find('form.empForm [name=' + k.name + ']').hasClass('skip')) {
                    var incomeInput = parent.find('form.empForm [name=' + k.name + ']');
                    var obj = {
                        "incomeTypeId": incomeInput.data('incometypeid'),
                        "incomeAmount": parseInt(unformatMoney(incomeInput.val())),
                        "occupationId": incomeInput.data('occupation'),
                        "applicantId": applicantId,
                        "incomeType": incomeInput.data('frequency') == 1 ? "Monthly" : (incomeInput.data('frequency') == 3 ? "Quarterly" : (incomeInput.data('frequency') == 12) ? "Yearly" : "")
                    };
                    applicantsData.incomes.push(obj);
                }
            } else {
                applicantsData[k.name] = k.value;
            }
            if ((parent.find('[name=' + k.name + ']').data('field') == 'income') && !(parent.find('[name=' + k.name + ']').hasClass('skip'))) {
                var ele = parent.find('[name=' + k.name + ']');
                if (!ele.val() || isNaN(unformatMoney(ele.val()))) {
                    ERROR = true;
                    ERRORMSG.push("Please enter your " + ele.data('incometypename'));
                    inputErrorShow(ele, "Please enter your " + ele.data('incometypename'));
                } else if (unformatMoney(ele.val()) < minimumIncome) {
                    ERROR = true;
                    ERRORMSG.push(ele.data('incometypename') + " must be "+minimumIncome+" or greater");
                    inputErrorShow(ele, ele.data('incometypename') + " must be "+minimumIncome+" or greater");
                } else if (unformatMoney(ele.val()) > maximumIncome) {
                    ERROR = true;
                    ERRORMSG.push(ele.data('incometypename') + " must not be greater than "+maximumIncome);
                    inputErrorShow(ele, ele.data('incometypename') + " must not be greater than "+maximumIncome);
                }
                if ($.inArray(ele.data('incometypeid'), incomeNotToAdd) < 0) {
                    totalMainIncome += parseInt(unformatMoney(ele.val()));
                }
            }
    });
    var userStandardFinancialStatus = parent.find('div.employmentFieldBox').find('form.empForm').find('[name=userStandardFinancialStatus]');
    var documentaryEvidence = parent.find('div.employmentFieldBox').find('form.empForm').find('[name=documentaryEvidence]');
    if (userStandardFinancialStatus.length) {
        if (userStandardFinancialStatus.is(":checked")) {
            applicantsData['userStandardFinancialStatus'] = 1;
        } else {
            applicantsData['userStandardFinancialStatus'] = 0;
        }
    }
    if (documentaryEvidence.length) {
        if (documentaryEvidence.is(":checked")) {
            applicantsData['documentaryEvidence'] = 1;
        } else {
            applicantsData['documentaryEvidence'] = 0;
        }
    }
    if (!formData.userOccupationTypeId || isNaN(formData.userOccupationTypeId)) {
        ERROR = true;
        ERRORMSG.push(Error.occupationTypeId.error);
        inputErrorShow(parent.find('[name=userOccupationTypeId]'), Error.occupationTypeId.error);
    } else {
        inputErrorHide(parent.find('[name=userOccupationTypeId]'));
    }
    if (formData.userOccupationTypeId == '1') {
        applicantsData['userDateOfJoining'] = +parseInt(applicantsData['workingSinceYY']) + '-' + parseInt(applicantsData['workingSinceMM']) + '-01';
        if ((!formData.workingSinceMM || isNaN(formData.workingSinceMM)) || (!formData.workingSinceYY || isNaN(formData.workingSinceYY))) {
            ERROR = true;
            ERRORMSG.push(Error.workExp.error);
            parent.find('[name=workingSinceMM]').parent().parent().siblings('.custom-error').attr('title', Error.workExp.error);
            parent.find('[name=workingSinceMM]').parent().parent().siblings('.custom-error').text(Error.workExp.error).show();
            // parent.find('[name=workingSinceMM]').parents('.selectGroupBox').append($('<span/>',{
            //     text : Error.workExp.error,
            //     class : 'custom-error'
            // }));
        } else {
            parent.find('[name=workingSinceMM]').parent().parent().siblings('.custom-error').attr('title', '');
            parent.find('[name=workingSinceMM]').parent().parent().siblings('.custom-error').text('').hide();
            // parent.find('[name=workingSinceMM]').parents('.selectGroupBox').find('span.custom-error').remove();
        }
        if (!formData.companyName) {
            ERROR = true;
            ERRORMSG.push(Error.companyName.error);
            inputErrorShow(parent.find('[name=companyName]'), Error.companyName.error);
        } else {
            inputErrorHide(parent.find('[name=companyName]'));
        }
        applicantsData['userWorkEx'] = (isNaN(parseInt(applicantsData['workExpYY'])) ? 0 : parseInt(applicantsData['workExpYY'])) + (isNaN(parseInt(applicantsData['workExpMM'])) ? 0 : parseInt(applicantsData['workExpMM']));
        if (applicantsData['userWorkEx']<=0) {
            ERROR = true;
            ERRORMSG.push(Error.workExp.error);
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').attr('title', Error.workExp.error);
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').text(Error.workExp.error).show();
            // parent.find('[name=workExpMM]').parents('.selectGroupBox').append($('<span/>',{
            //     text : Error.workExp.error,
            //     class : 'custom-error'
            // }));
        } else {
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').attr('title', '');
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').text('').hide();
            // parent.find('[name=workExpMM]').parents('.selectGroupBox').find('span.custom-error').remove();
        }
        /* total exp should not be greater than working since*/
        var current = new Date();
        var newDate = new Date();
        var WorkingSince = getDateObject(1, formData.workingSinceMM, formData.workingSinceYY);
        var timeDiff = Math.abs(current.getTime() - WorkingSince.getTime());
        var diffDays1 = Math.ceil(timeDiff / (1000 * 3600 * 24));
        newDate.setFullYear(newDate.getFullYear() - (formData.workExpYY / 12));
        newDate.setMonth(newDate.getMonth() - formData.workExpMM);
        timeDiff = Math.abs(current.getTime() - newDate.getTime());
        diffDays2 = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (diffDays1 > diffDays2 && formData.workExpYY<120) {
            ERROR = true;
            ERRORMSG.push(Error.workExp.more);
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').attr('title', Error.workExp.more);
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').text(Error.workExp.more).show();
            // parent.find('[name=workExpMM]').parents('.selectGroupBox').append($('<span/>',{
            //     text : Error.workExp.more,
            //     class : 'custom-error'
            // }));
        } else {
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').attr('title', '');
            parent.find('[name=workExpMM]').parent().parent().siblings('.custom-error').text('').hide();
            // parent.find('[name=workExpMM]').parents('.selectGroupBox').find('span.custom-error').remove();
        }
        /* total exp should not be greater than working since*/
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        if (!formData.salaryMode || isNaN(formData.salaryMode)) {
            ERROR = true;
            ERRORMSG.push(Error.salaryMode.error);
            inputErrorShow(parent.find('[name=salaryMode]'), Error.salaryMode.error);
        } else {
            inputErrorHide(parent.find('[name=salaryMode]'));
        }
        if (formData.salaryMode == 1 && (!formData.salaryCreditIn || isNaN(formData.salaryCreditIn))) {
            ERROR = true;
            ERRORMSG.push(Error.salaryCreditIn.error);
            inputErrorShow(parent.find('[name=salaryCreditIn]'), Error.salaryCreditIn.error);
        } else {
            inputErrorHide(parent.find('[name=salaryCreditIn]'));
        }
        if (!formData.incomeCurrency || isNaN(formData.incomeCurrency)) {
            ERROR = true;
            ERRORMSG.push(Error.incomeCurrency.error);
            inputErrorShow(parent.find('[name=incomeCurrency]'), Error.incomeCurrency.error);
        } else {
            inputErrorHide(parent.find('[name=incomeCurrency]'));
        }
        if (!isEmpty(formData.AnnualGrossSalary) && parseInt(unformatMoney(formData.AnnualGrossSalary)) < (parseInt(unformatMoney(formData.MonthlyTakeHome)) * 12)) {
            ERROR = true;
            ERRORMSG.push(Error.AnnualGrossSalary.compare);
            inputErrorShow(parent.find('[name=AnnualGrossSalary]'), Error.AnnualGrossSalary.compare);
        }
        // if( !formData.MonthlyTakeHome || isNaN(formData.MonthlyTakeHome.replace(/\,/g,""))){
        //     ERROR = true;
        //     inputErrorShow(parent.find('[name=MonthlyTakeHome]'), Error.monthlyTakeHome.error);
        // }else{
        //     inputErrorHide(parent.find('[name=MonthlyTakeHome]'));
        // }
    } else if (formData.userOccupationTypeId == '2') {
        var userIsOwner = [0, 1];
        if (!formData.bizNature || isNaN(formData.bizNature)) {
            ERROR = true;
            ERRORMSG.push(Error.bizNature.error);
            inputErrorShow(parent.find('[name=bizNature]'), Error.bizNature.error);
        } else {
            inputErrorHide(parent.find('[name=bizNature]'));
        }
        if ($.inArray(parseInt(formData.userIsOwner),[0,1])<0) {
            ERROR = true;
            ERRORMSG.push(Error.userIsOwner.error);
            inputErrorShow(parent.find('[name=userIsOwner]'), Error.userIsOwner.error);
        } else {
            inputErrorHide(parent.find('[name=userIsOwner]'));
        }
        if(formData.userIsOwner == 1 && (!formData.bizHolding || isNaN(formData.bizHolding))){
            ERROR = true;
            ERRORMSG.push(Error.bizHolding.error);
            inputErrorShow(parent.find('[name=bizHolding]'), Error.bizHolding.error);
        }else{
            inputErrorHide(parent.find('[name=bizHolding]'));
        }
        if (!formData.bizVintage || isNaN(formData.bizVintage)) {
            ERROR = true;
            ERRORMSG.push(Error.bizVintage.error);
            inputErrorShow(parent.find('[name=bizVintage]'), Error.bizVintage.error);
        } else {
            inputErrorHide(parent.find('[name=bizVintage]'));
        }
        /*if( !formData.salaryMode || isNaN(formData.salaryMode) ){
            ERROR = true;
            ERRORMSG.push(Error.salaryMode.error);
            inputErrorShow(parent.find('[name=salaryMode]'), Error.salaryMode.error);
        }else{
            inputErrorHide(parent.find('[name=salaryMode]'));
        }*/
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.userStandardFinancialStatus || isNaN(formData.userStandardFinancialStatus)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.userStandardFinancialStatus.error);
        //     parent.find('[name=userStandardFinancialStatus]').parent('label').siblings('span.custom-error').text(Error.userStandardFinancialStatus.error).attr('title', Error.userStandardFinancialStatus.error).show();
        // } else {
        //     parent.find('[name=userStandardFinancialStatus]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        if (!formData.incomeCurrency || isNaN(formData.incomeCurrency)) {
            ERROR = true;
            ERRORMSG.push(Error.incomeCurrency.error);
            inputErrorShow(parent.find('[name=incomeCurrency]'), Error.incomeCurrency.error);
        } else {
            inputErrorHide(parent.find('[name=incomeCurrency]'));
        }
        if (!formData.salaryCreditIn || isNaN(formData.salaryCreditIn)) {
            ERROR = true;
            ERRORMSG.push(Error.salaryCreditIn.error);
            inputErrorShow(parent.find('[name=salaryCreditIn]'), Error.salaryCreditIn.error);
        } else {
            inputErrorHide(parent.find('[name=salaryCreditIn]'));
        }
        if (parseInt(unformatMoney(formData.AnnualProfitAfterTax)) >= parseInt(unformatMoney(formData.AnnualTurnOver))) {
            ERROR = true;
            ERRORMSG.push(Error.annualTurnover.compare);
            inputErrorShow(parent.find('[name=AnnualTurnOver]'), Error.annualTurnover.compare);
        }
        // if( !formData.AnnualProfitAfterTax || isNaN(formData.AnnualProfitAfterTax.replace(/\,/g,""))){
        //     ERROR = true;
        //     inputErrorShow(parent.find('[name=AnnualProfitAfterTax]'), Error.annualProfitAfterTax.error);
        // }else{
        //     inputErrorHide(parent.find('[name=AnnualProfitAfterTax]'));
        // }
        // if( !formData.AnnualTurnover || isNaN(formData.AnnualTurnover.replace(/\,/g,""))){
        //     ERROR = true;
        //     inputErrorShow(parent.find('[name=AnnualTurnover]'), Error.annualTurnover.error);
        // }else{
        //     inputErrorHide(parent.find('[name=AnnualTurnover]'));
        // }
    } else if (formData.userOccupationTypeId == '3') {
        if (!formData.profName || isNaN(formData.profName)) {
            ERROR = true;
            ERRORMSG.push(Error.profName.error);
            inputErrorShow(parent.find('[name=profName]'), Error.profName.error);
        } else {
            inputErrorHide(parent.find('[name=profName]'));
        }
        if (!formData.profPractisingSince || isNaN(formData.profPractisingSince)) {
            ERROR = true;
            ERRORMSG.push(Error.profPractisingSince.error);
            inputErrorShow(parent.find('[name=profPractisingSince]'), Error.profPractisingSince.error);
        } else {
            inputErrorHide(parent.find('[name=profPractisingSince]'));
        }
        /*if( !formData.salaryMode || isNaN(formData.salaryMode) ){
            ERROR = true;
            ERRORMSG.push(Error.salaryMode.error);
            inputErrorShow(parent.find('[name=salaryMode]'), Error.salaryMode.error);
        }else{
            inputErrorHide(parent.find('[name=salaryMode]'));
        }*/
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.userStandardFinancialStatus || isNaN(formData.userStandardFinancialStatus)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.userStandardFinancialStatus.error);
        //     parent.find('[name=userStandardFinancialStatus]').parent('label').siblings('span.custom-error').text(Error.userStandardFinancialStatus.error).attr('title', Error.userStandardFinancialStatus.error).show();
        // } else {
        //     parent.find('[name=userStandardFinancialStatus]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        if (!formData.incomeCurrency || isNaN(formData.incomeCurrency)) {
            ERROR = true;
            ERRORMSG.push(Error.incomeCurrency.error);
            inputErrorShow(parent.find('[name=incomeCurrency]'), Error.incomeCurrency.error);
        } else {
            inputErrorHide(parent.find('[name=incomeCurrency]'));
        }
        if (!formData.salaryCreditIn || isNaN(formData.salaryCreditIn)) {
            ERROR = true;
            ERRORMSG.push(Error.salaryCreditIn.error);
            inputErrorShow(parent.find('[name=salaryCreditIn]'), Error.salaryCreditIn.error);
        } else {
            inputErrorHide(parent.find('[name=salaryCreditIn]'));
        }
        if (parseInt(unformatMoney(formData.AnnualProfitAfterTax)) >= parseInt(unformatMoney(formData.AnnualGrossReceipts))) {
            ERROR = true;
            ERRORMSG.push(Error.AnnualGrossReceipts.compare);
            inputErrorShow(parent.find('[name=AnnualTurnOver]'), Error.AnnualGrossReceipts.compare);
        }
        // if( !formData.AnnualGrossReceipts || isNaN(formData.AnnualGrossReceipts.replace(/\,/g,""))){
        //     ERROR = true;
        //     inputErrorShow(parent.find('[name=AnnualGrossReceipts]'), Error.annualGrossReceipts.error);
        // }else{
        //     inputErrorHide(parent.find('[name=AnnualGrossReceipts]'));
        // }
    } else if (formData.userOccupationTypeId == '4') {
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
        if (!formData.MonthlyPension || isNaN(formData.MonthlyPension.replace(/\,/g, ""))) {
            ERROR = true;
            ERRORMSG.push(Error.monthlyPension.error);
            inputErrorShow(parent.find('[name=MonthlyPension]'), Error.monthlyPension.error);
        } else {
            inputErrorHide(parent.find('[name=MonthlyPension]'));
        }
        if (!formData.incomeCurrency || isNaN(formData.incomeCurrency)) {
            ERROR = true;
            ERRORMSG.push(Error.incomeCurrency.error);
            inputErrorShow(parent.find('[name=incomeCurrency]'), Error.incomeCurrency.error);
        } else {
            inputErrorHide(parent.find('[name=incomeCurrency]'));
        }
        if (!formData.salaryCreditIn || isNaN(formData.salaryCreditIn)) {
            ERROR = true;
            ERRORMSG.push(Error.salaryCreditIn.error.replace(' salary', ''));
            inputErrorShow(parent.find('[name=salaryCreditIn]'), Error.salaryCreditIn.error.replace(' salary', ''));
        } else {
            inputErrorHide(parent.find('[name=salaryCreditIn]'));
        }
    } else if (formData.userOccupationTypeId == '5') {
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
    } else if (formData.userOccupationTypeId == '6') {
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
    } else if (formData.userOccupationTypeId == '7') {
        if (!formData.itrStatus || isNaN(formData.itrStatus)) {
            ERROR = true;
            ERRORMSG.push(Error.itrStatus.error);
            inputErrorShow(parent.find('[name=itrStatus]'), Error.itrStatus.error);
        } else {
            inputErrorHide(parent.find('[name=itrStatus]'));
        }
        // if (!formData.documentaryEvidence || isNaN(formData.documentaryEvidence)) {
        //     ERROR = true;
        //     ERRORMSG.push(Error.documentaryEvidence.error);
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text(Error.documentaryEvidence.error).attr('title', Error.documentaryEvidence.error).show();
        // } else {
        //     parent.find('[name=documentaryEvidence]').parent('label').siblings('span.custom-error').text('').attr('title', '').hide();
        // }
    }
}

function validateIncomeDetails(parent) {
    totalOtherIncome = 0;
    var div = parent.find('.addIncome').closest('ul'),
        value = unformatMoney(div.find('.incomeInput').val()),
        type = div.find('.incomeSelect').val(),
        description = div.find('.incomeSelect option:selected').text(),
        occupation = div.find('.incomeSelect option:selected').data('occupation'),
        incomeType = div.find('.incomeSelect option:selected').data('incometype'),
        frequency = div.find('.incomeSelect option:selected').data('frequency'),
        // incomeType = frequency == 1 ? "Monthly" : (frequency == 3 ? "Quarterly" : (frequency == 12) ? "Yearly" : ""),
        included = div.find('.incomeSelect option:selected').data('included');
    // value = value>100000000?100000000:value;
    if ($.isNumeric(value) && $.isNumeric(type)) {
        objToRender = {
            income: value,
            incomeTypeId: type,
            incomeDescription: description,
            occupation: occupation,
            incomeType: incomeType,
            frequency: frequency,
            included: included
        };
        var Ul = generateOtherIncomeRow(objToRender);
        div.closest('.tableBox.otherIncome').append(Ul);
        div.find('.incomeInput').val('');
        div.find('.incomeSelect').val('').trigger('chosen:updated');
    }
    parent.find('div.otherIncome').children('ul.tbodyBox').each(function() {
        type = $(this).find('li:eq(0)').find('div.valueBox p span').html();
        value = $(this).find('li:eq(1)').find('div.valueBox p span').html();
        totalOtherIncome += parseInt(unformatMoney(value));
        var incomeInput = $(this).find('li:eq(0)').find('div.valueBox p span');
        var obj = {
            "incomeTypeId": incomeInput.data('income'),
            // "biz_income_type_name": type,
            // "frequency": 1,
            // "is_included": incomeInput.data('included'),
            "incomeAmount": parseInt(unformatMoney(value)),
            "occupationId": incomeInput.data('occupation'),
            "applicantId": applicantId,
            "incomeType": incomeInput.data('frequency') == 1 ? "Monthly" : (incomeInput.data('frequency') == 3 ? "Quarterly" : (incomeInput.data('frequency') == 12) ? "Yearly" : "")
        };
        applicantsData['incomes'].push(obj);
    });
    minimumIncome = minIncome;
    if(parent.find('div.employmentFieldBox').find('form.empForm [name=incomeCurrency]').val() != 1){
        minimumIncome = 1;
    }
    if (minimumIncome > totalOtherIncome + totalMainIncome && totalOtherIncome + totalMainIncome != 0) {
        ERROR = true;
        parent.find('div.otherIncome').siblings('.custom-error').attr('title', Error.otherIncome.minimum + ' ' + minimumIncome);
        parent.find('div.otherIncome').siblings('.custom-error').text(Error.otherIncome.minimum + ' ' + minimumIncome).show();
        // parent.find('div.otherIncome').parent('.formGroupBox').append($('<span/>',{
        //         text : Error.otherIncome.minimum + ' ' + minimumIncome,
        //         class : 'custom-error'
        //     }));
    } else {
        parent.find('div.otherIncome').siblings('.custom-error').attr('title', '');
        parent.find('div.otherIncome').siblings('.custom-error').text('').hide();
        // parent.find('div.otherIncome').parent('.formGroupBox').find('.custom-error').remove();
    }
    // alert(totalOtherIncome);
}

function validateObligations(parent) {
    totalObligation = 0;
    var div = parent.find('.addObligation').closest('ul'),
        value = unformatMoney(div.find('.obligationInput').val()),
        type = div.find('.obligationSelect').val(),
        description = div.find('.obligationSelect option:selected').text();
    // value = value>100000000?100000000:value;
    if ($.isNumeric(value) && $.isNumeric(type)) {
        objToRender = {
            obligation: value,
            obligationType: type,
            obligationDescription: description,
        };
        var Ul = generateObligationRow(objToRender);
        div.closest('.tableBox.obligation').append(Ul);
        div.find('.obligationInput').val('');
        div.find('.obligationSelect').val('').trigger('chosen:updated');
    }
    parent.find('div.obligation').children('ul.tbodyBox').each(function() {
        type = $(this).find('li:eq(0)').find('div.valueBox p span').html();
        value = $(this).find('li:eq(1)').find('div.valueBox p span').html();
        totalObligation += parseInt(unformatMoney(value));
        var incomeInput = $(this).find('li:eq(0)').find('div.valueBox p span');
        var applicantId = $('#applicantId').val();
        var obj = {
            "loanTypeId": incomeInput.data('obligation'),
            "loanTypeName": type,
            "outstandingAmount": parseInt(unformatMoney(value)),
            "applicantId": applicantId
        };
        applicantsData['obligations'].push(obj);
    });
    if (totalObligation >= totalOtherIncome + totalMainIncome && totalOtherIncome + totalMainIncome != 0) {
        ERROR = true;
        parent.find('div.obligation').siblings('.custom-error').attr('title', Error.obligation.maximum);
        parent.find('div.obligation').siblings('.custom-error').text(Error.obligation.maximum).show();
        // parent.find('div.obligation').parent('.formGroupBox').append($('<span/>',{
        //     text : Error.obligation.maximum,
        //     class : 'custom-error'
        // }));
    } else {
        parent.find('div.obligation').siblings('.custom-error').attr('title', '');
        parent.find('div.obligation').siblings('.custom-error').text('').hide();
        // parent.find('div.obligation').parent('.formGroupBox').find('.custom-error').remove();
    }
}

function generateObligationRow(data) {
    var obligationUl = $('<ul class="tbodyBox"></ul>'),
        obligationSelectLi = $('<li data-field="obligationDesc"><div class="valueBox"><p><label>Loan Type</label><span data-obligation="' + data.obligationType + '">' + data.obligationDescription + '</span></p></div></li>'),
        obligationInputLi = $('<li data-field="obligationVal"><div class="valueBox"><p><label>Amount</label><span>' + inrCurrency(data.obligation) + '</span></p></div></li>'),
        obligationBalanceTenureLi = $('<li data-field="obligationBalanceTenure"><div class="valueBox"><p><label>Balance Tenure</label><span>' + data.obligationBalanceTenure + '</span></p></div></li>'),
        obligationRemoveLi = $('<li><a class="addRemove removeObligation"><em class="icon-trash"></em></a></li>');
    obligationUl.append(obligationSelectLi).append(obligationInputLi).append(obligationBalanceTenureLi).append(obligationRemoveLi);
    return obligationUl;
}

function generateOtherIncomeRow(data) {
    var incomeUl = $('<ul class="tbodyBox"></ul>'),
        incomeSelectLi = $('<li data-field="incomeDesc"><div class="valueBox"><p><label>Income Type</label><span data-income="' + data.incomeTypeId + '" data-occupation="' + data.occupation + '" data-incometype="' + data.incomeType + '" data-frequency="' + data.frequency + '" data-included="' + data.included + '">' + data.incomeDescription + '</span></p></div></li>'),
        incomeInputLi = $('<li data-field="incomeVal"><div class="valueBox"><p><label>Amount</label><span>' + inrCurrency(data.income) + '</span></p></div></li>'),
        incomeRemoveLi = $('<li><a class="addRemove removeIncome"><em class="icon-trash"></em></a></li>');
    incomeUl.append(incomeSelectLi).append(incomeInputLi).append(incomeRemoveLi);
    return incomeUl;
}

function setMobileRegex(select) {
    var regex = (select.find('option:selected').data('regex'));
    if (regex != '') {
        $('input[data-type=mobile]').attr('regex', regex);
    } else {
        $('input[data-type=mobile]').attr('regex', '');
    }
}

function generateCountryCodeOptions(CountryId, fullName) {
    if (typeof CountryId == "undefined") {
        var CountryId = "";
    }
    if (typeof fullName == "undefined") {
        var fullName = false;
    }
    var html = '<option value="" class="chosenHide"></option>';
    $.each(locationList.countries, function(id, country) {
        if (country.code != "") {
            if (fullName) {
                name = country.code + ' (' + country.name + ')';
            } else {
                name = country.code;
            }
            if (country.serial == CountryId) {
                html += '<option value="' + country.serial + '" data-regex="' + (country.mobile_regex || '') + '" selected>' + name + '</option>';
            } else {
                html += '<option value="' + country.serial + '" data-regex="' + (country.mobile_regex || '') + '">' + name + '</option>';
            }
        }
    });
    return html;
}

function setOccupationNonEditable() {
    $("#employmentDetails .empSection").each(function() {
        var applicantTypeId = $(this).data('applicant');
        var user = {};
        user.income = {};
        user.otherIncome = {};
        user.obligation = {};
        var inputs = $(this).find(
            "input[name][type!=checkbox][type!=hidden], select[name]"
        );
        $.each(inputs, function(id, input) {
            var obj = $(input);
            var tagName = obj.prop("tagName");
            if(obj.data('field') == 'income'){
                if (tagName.toLowerCase() == "input") {
                    user.income[obj.siblings('label').text()] = obj.val();
                }
            }else{
                if (tagName.toLowerCase() == "select") {
                    user[obj.attr("name")] = obj.find("option:selected").text();
                    user[obj.attr("name")+'_id'] = obj.val();
                } else {
                    user[obj.attr("name")] = obj.val();
                }
            }
        });
        var otherIncomeUl = $(this).find('.tableBox.otherIncome ul.tbodyBox');
        $.each(otherIncomeUl, function(id, incomeUl){
            var incomeUlObj = $(incomeUl);
            var incomeLi = incomeUlObj.find('li');
            var desc = '';
            var val = '';
            $.each(incomeLi, function(idx, incomeLi){
                var incomeLiObj  = $(incomeLi);
                if(incomeLiObj.data('field') == 'incomeDesc'){
                    // console.log('desc', incomeLiObj.find('span').text());
                    desc = incomeLiObj.find('span').text()+'_'+id;
                }else if(incomeLiObj.data('field') == 'incomeVal'){
                    // console.log('val', incomeLiObj.find('span').text());
                    val = incomeLiObj.find('span').text();
                }
                if(desc.length > 0 && val.length > 0){
                    user.otherIncome[desc] = val;
                }
            });
        });
        var obligationUl = $(this).find('.tableBox.obligation ul.tbodyBox');
        $.each(obligationUl, function(id, obligationUl){
            var obligationUlObj = $(obligationUl);
            var obligationLi = obligationUlObj.find('li');
            var desc = '';
            var val = '';
            $.each(obligationLi, function(idx, obligationLi){
                var obligationLiObj  = $(obligationLi);
                if(obligationLiObj.data('field') == 'obligationDesc'){
                    // console.log('desc', incomeLiObj.find('span').text());
                    desc = obligationLiObj.find('span').text()+'_'+id;
                }else if(obligationLiObj.data('field') == 'obligationVal'){
                    // console.log('val', incomeLiObj.find('span').text());
                    val = obligationLiObj.find('span').text();
                }
                if(desc.length > 0 && val.length > 0){
                    user.obligation[desc] = val;
                }
            });
        });
        // console.log(user);
        user.occupationName = ((user.companyName && user.companyName.length > 0) || user.userOccupationTypeId_id != 1) ? user.userOccupationTypeId : 'Not Available';
        $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=salaryMode]').closest('p').hide();
        $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=salaryCreditIn]').closest('p').show();
        if (user.userOccupationTypeId_id == 1) {
            user.occupationType = (user.companyName && user.companyName.length > 0) ? user.companyName : 'Not Available';
            user.occupationExp = user.workExpYY + ' ' + user.workExpMM;
            user.occupationExp = user.occupationExp.length > 1 ? user.occupationExp + ' ' + 'Experience' : 'Not Available';
            $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=salaryMode]').closest('p').show();
            if (!user.salaryMode_id || (user.salaryMode_id && user.salaryMode_id != 1)) {
                $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=salaryCreditIn]').closest('p').hide();
            }
            if (!user.salaryMode_id || user.salaryMode_id == 0 || user.companyName.length <= 0) {
                user.salaryMode = 'Not Available';
            }
        } else if (user.userOccupationTypeId_id == 2) {
            user.occupationType = (user.bizNature && user.bizNature.length > 0) ? user.bizNature : 'Not Available';
            user.occupationExp = (user.bizVintage && user.bizVintage.length > 0) ? user.bizVintage + ' ' + 'Experience' : 'Not Available';
        } else if (user.userOccupationTypeId_id == 3) {
            user.occupationType = (user.profName && user.profName.length > 0) ? user.profName : 'Not Available';
            user.occupationExp = (user.profPractisingSince && user.profPractisingSince.length > 0) ? user.profPractisingSince + ' ' + 'Experience' : 'Not Available';
        } else {
            user.occupationType = 'Not Available';
            user.occupationExp = 'Not Available';
            $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=salaryCreditIn]').closest('p').hide();
        }
        var currentDiv = $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']');
        currentDiv.find('div.incomeMonthly').html('');
        currentDiv.find('ul.otherIncomeBoxes').html('<p><em class="icon-other-income"></em>Other income (Monthly)</p>').hide();
        currentDiv.find('ul.obligationBox').html('<p><em class="icon-money"></em>EMI / Obligation (Monthly)</p>').hide();
        $.each(user, function(name, value) {
            if (name == 'income') {
                $.each(value, function(desc, incomeVal) {
                    incomeVal = incomeVal == '' ? 'Not Available' : '' + incomeVal;
                    var IncomePar = $('<p><em class="icon-monthly-income"></em>' + desc.replace('*', '') + ' <span data-name="monthlyIncome">' + incomeVal + '</span></p>');
                    currentDiv.find('div.incomeMonthly').append(IncomePar);
                });
            } else if (name == 'otherIncome') {
                $.each(value, function(desc, otherVal) {
                    currentDiv.find('ul.otherIncomeBoxes').show();
                    otherVal = otherVal == '' ? 'Not Available' : '' + otherVal;
                    desc = desc.split('_')[0];
                    var otherIncome = $('<li>' + desc + '<span data-name="bizIncome">Rs.' + otherVal + '</span></li>');
                    currentDiv.find('ul.otherIncomeBoxes').append(otherIncome);
                });
            } else if (name == 'obligation') {
                $.each(value, function(desc, obligation) {
                    currentDiv.find('ul.obligationBox').show();
                    obligation = obligation == '' ? 'Not Available' : '' + obligation;
                    desc = desc.split('_')[0];
                    var obligationLi = $('<li> ' + desc + '<span data-name="emiOutstanding">Rs.' + obligation + '</span></li>');
                    currentDiv.find('ul.obligationBox').append(obligationLi);
                });
            } else {
                value = (value != null && value.length) ? value : 'Not Available';
                $('#employmentDetailsNonEditable .empOccDetails[data-applicant=' + applicantTypeId + ']').find('[data-name=' + name + ']').text(value);
            }
        });
    });
    $('#boxxx28 .empNonEditable, .editLink.employment-detail').show();
    $('#boxxx28 .empEditable').hide();
    // debugger;
    if($('#financialCoapplicant').is(':checked') && hasCoapplicant == 1){
        // console.log('occupation', 'co-app financial');
        $('#coAppNonEditSection .available').show();
        $('#coAppNonEditSection .not-available').hide();
        $('#coAppNonEditSection').removeClass('centerBoxRelative').addClass('centerBoxRelative');
        // console.log('available shown, class added');
    }else{
        // console.log('occupation', 'co-app non-financial');
        $('#coAppNonEditSection .available').hide();
        $('#coAppNonEditSection .not-available').show();
        if(typeof(GUARANTOR) != 'undefined' && GUARANTOR){
            coAppName = 'Guarantor';
        }else{
            coAppName = 'Co-applicant';
        }
        if(hasCoapplicant){
            $('#coAppNonEditSection .not-available .centerBtnBox span').html(coAppName+' is not financial');
        }else{
            $('#coAppNonEditSection .not-available .centerBtnBox span').html(coAppName+' is not available');
        }
        $('#financialCoapplicant').siblings('span').html('Is '+coAppName+' Financial?');
        $('#employmentDetailsNonEditable #coAppNonEditSection').removeClass('centerBoxRelative');
        // console.log('not-available shown, class removed');
    }
}

function setReferenceTileNonEditable() {
    $("#referenceDetails .detailSection").each(function() {
        user = {};
        var inputs = $(this).find("input[name][type!=hidden], select[name]");
        $.each(inputs, function(id, input) {
            var obj = $(input);
            var tagName = obj.prop("tagName");
            if (tagName.toLowerCase() == "select") {
                user[obj.attr("name")] = obj.find("option:selected").text();
            } else if (obj.attr('type') == 'checkbox') {
                if (obj.is(':checked')) {
                    user[obj.attr('name')] = obj.val();
                } else {
                    user[obj.attr('name')] = 0;
                }
            } else {
                user[obj.attr("name")] = obj.val();
            }
        });
        var referenceNumber = $(this).data('refnum');
        user.relationText = (user.refRelation && user.refRelation.length > 0) ? '(' + user.refRelation + ')' : 'Not Available';
        user.userMobile = (user.refContact) ? user.refContact : '';
        user.userNameAlpha = (user.refName != '') ? user.refName.split("")[0].toUpperCase() : '';
        user.userName = user.refName.toTitleCase();
        user.addressText = ((user.refAddress.length > 0) ? (user.refAddress + ', ') : '') + ((user.refCity.length > 0) ? user.refCity + ', ' : '') + ((user.refCountry.length > 0) ? user.refCountry + ', ' : '') + user.refPin;
        user.addressText = user.addressText.replace(/,\s*$/, "");
        user.addressText = (user.addressText.length > 2) ? user.addressText : 'Not Available';
        user.userEmail = (user.refEmail && user.refEmail.length > 0) ? '(' + user.refEmail + ')' : 'Not Available';
        // console.log(user);
        $.each(user, function(name, value) {
            $('#referenceDetailsNonEditable .detailSection[data-refnum=' + referenceNumber + ']').find('[data-name=' + name + ']').text(value);
        });
    });
    $('#boxxx35 .editable').hide();
    $('#boxxx35 .non-editable,.editLink.reference-detail').show();
}

function ajaxCall(type, url, data) {
    return $.ajax({
        type: type,
        headers: {
            'X-CSRF-TOKEN': $('meta[name=csrf]').attr("value"),
        },
        url: url,
        data: data,
        beforeSend: function() {
            // $('#popupLoaderBox').show();
        },
        success: function() {
            // $('#popupLoaderBox').hide();
        },
        error: function(jqXHR, textStatus, errorMsg) {
            $('#popupLoaderBox').hide();
        }
    });
};

function pushData(data, target) {
    if (typeof target === 'undefined') {
        target = 'push-data';
    }
    var apiUrl = environment() + '/' + target;
    data['application'] = data['application'] ? data['application'] : {};
    data['application']['appId'] = $('#appId').val();
    if (data['applicant'] && data['applicant'][0]) {
        data['applicant'][0]['applicantId'] = $('#applicantId').val();
    }
    if (data['coApplicant'] && data['coApplicant'][0]) {
        data['coApplicant'][0]['applicantId'] = $('#coApplicantId').val();
    }
    return ajaxCall('POST', apiUrl, data).success(function(response, textStatus, jqXHR) {
        console.log(jqXHR);
        console.log(textStatus);
        handlePushBulkDataResponse(response);
    });
}

function isApplicationEditable(origin) {
    var isEditable = false;
    if (origin == 'builder' && queryParam('edit') != null && $.inArray(ELIGIBILITY_STATUS, [11, 12]) == -1) {
        isEditable = true;
    } else if (origin == 'inhouse' && $.inArray(APP_STATUS, [4, 58]) == -1 && ($.inArray(queryParam('employee'), empAssigned) == -1 || $.inArray(APP_STATUS, [57]) == -1)) {
        isEditable = true;
    } else if (origin == 'partner' && queryParam('edit') != null && $.inArray(ELIGIBILITY_STATUS, [40, 41, 42]) == -1) {
        isEditable = true;
    }  else if (origin == 'yesBank' && $.inArray(APP_STATUS, [4]) == -1){
        isEditable = true;
    }  else if (origin == 'iciciBank' && $.inArray(APP_STATUS, [4]) == -1){
        isEditable = true;
    }  else if (origin == 'partnerHL' && $.inArray(APP_STATUS, [4]) == -1){
        isEditable = true;
    }  else if (origin == 'iciciBank' && $.inArray(APP_STATUS, [4]) == -1){
        isEditable = true;
    }  else if (origin == 'iciciBre' && $.inArray(APP_STATUS, [4]) == -1){
        isEditable = true;
    }
    return isEditable;
}

function initSetOccupationNonEditable(origin) {
    if (typeof(origin) === undefined) {
        origin = '';
    }
    var result = validateBoxxx28();
    if (result.status) {
        $("#employmentDetails .empSection").each(function() {
            var userData = {};
            userData.income = {};
            userData.otherIncome = {};
            userData.obligation = {};
            var inputs = $(this).find("input[name][type!=checkbox][type!=hidden], select[name]");
            $.each(inputs, function(id, input) {
                var obj = $(input);
                var tagName = obj.prop("tagName");
                if (obj.data('field') == 'income') {
                    if (tagName.toLowerCase() == "input") {
                        userData.income[obj.siblings('label').text()] = obj.val();
                    }
                } else {
                    if (tagName.toLowerCase() == "select") {
                        userData[obj.attr("name")] = obj.find("option:selected").text();
                        userData[obj.attr("name") + '_id'] = obj.val();
                    } else {
                        userData[obj.attr("name")] = obj.val();
                    }
                }
            });
            var otherIncomeUl = $(this).find('.tableBox.otherIncome ul.tbodyBox');
            $.each(otherIncomeUl, function(id, incomeUl) {
                var incomeUlObj = $(incomeUl);
                var incomeLi = incomeUlObj.find('li');
                var desc = '';
                var val = '';
                $.each(incomeLi, function(idx, incomeLi) {
                    var incomeLiObj = $(incomeLi);
                    if (incomeLiObj.data('field') == 'incomeDesc') {
                        // console.log('desc', incomeLiObj.find('span').text());
                        desc = incomeLiObj.find('span').text() + '_' + id;
                    } else if (incomeLiObj.data('field') == 'incomeVal') {
                        // console.log('val', incomeLiObj.find('span').text());
                        val = incomeLiObj.find('span').text();
                    }
                    if (desc.length > 0 && val.length > 0) {
                        userData.otherIncome[desc] = val;
                    }
                });
            });
            var obligationUl = $(this).find('.tableBox.obligation ul.tbodyBox');
            $.each(obligationUl, function(id, obligationUl) {
                var obligationUlObj = $(obligationUl);
                var obligationLi = obligationUlObj.find('li');
                var desc = '';
                var val = '';
                $.each(obligationLi, function(idx, obligationLi) {
                    var obligationLiObj = $(obligationLi);
                    if (obligationLiObj.data('field') == 'obligationDesc') {
                        // console.log('desc', incomeLiObj.find('span').text());
                        desc = obligationLiObj.find('span').text() + '_' + id;
                    } else if (obligationLiObj.data('field') == 'obligationVal') {
                        // console.log('val', incomeLiObj.find('span').text());
                        val = obligationLiObj.find('span').text();
                    }
                    if (desc.length > 0 && val.length > 0) {
                        userData.obligation[desc] = val;
                    }
                });
            });
            setOccupationNonEditable(userData, $(this).data('applicant'));
        });
    } else {
        // console.log(result);
        $('#boxxx28').find('.custom-error').text('').hide();
        // $('#boxxx28 .empNonEditable, .editLink.employment-detail').hide();
        $('.editLink.employment-detail').hide();
        // $('#boxxx28 .empEditable').show();
    }
}

function sendExperianEmail(token) {
    var apiUrl = environment() + '/send-experian-email';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'data': token
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            // $('#btnPanVerify').addClass('btn1 loading');
            // $('#btnPanVerify').attr('disabled', 'disabled');
        },
        success: function(res) {
            // $('#btnPanVerify').removeAttr('disabled');
            // $('#btnPanVerify').removeClass('btn1 loading');
            // console.log(res);
            // if (!res['ERROR']) {
            //     res2 = $.parseJSON(res['RESPONSE_DATA']['RESPONSE_CODE']);
            //     if (res2['RESPONSE_CODE'] == '102') {
            //         $("#btnPanVerify").hide();
            //         $("#imgPanVerified").show();
            //         $("#PANChk").html('&#9679; PAN<em class="icon-check"></em><span>Verified</span>');
            //         $('#userName').prop('readonly', true);
            //         $('#userName').prop('disabled', true).addClass('disabled');
            //         $('#userPAN').prop('readonly', true);
            //         $('#userPAN').prop('disabled', true);
            //     }
            // } else {
            //     inputErrorShow($('#userPAN'), res['RESPONSE_DATA']['MESSAGE']);
            //     $('#PANChk').html('&#9679;<a href="javascript:void(0)"> PAN</a><span class="failure">! failure</span>');
            // }
        },
        error: function(d) {
            // $('#btnPanVerify').removeClass('btn1 loading');
            console.log(d);
        }
    });
}

function calculateInstantScore(appId, key) {
    //var apiUrl = environment() + '/../Api/calculate-instant-score';
	var apiUrl = APP_BASE_PATH + '/Api/calculate-instant-score';
    $.ajax({
        url: apiUrl,
        type: 'POST',
        data: {
            'appId': appId,
            'key': key,
            'validity':1440
        },
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val(),
        },
        beforeSend: function() {
            $('#popupLoaderBox').show();
        },
        success: function(res) {
            $('#popupLoaderBox').hide();
            if (!res['ERROR']) {
                var key = res['RESPONSE_DATA'];
                $("#instantScoreKey").val(key);
                //$('#calculateInstantScore').attr('disabled','disabled');
                $("#calculateInstantScore").text('Submit OTP');
                $('#reCalculateInstantScore').show();
                var newWindow = window.open("", "_blank");
                //newWindow.location.href = 'verify/' + key;
                newWindow.location.href = APP_BASE_PATH + '/verify/' + key;
            }
        },
        error: function(d) {
            $('#popupLoaderBox').hide();
            console.log(d);
        }
    });
}

function getMandatory(nationality, occupationId, isCoapp, origin) {
    var mandatoryArr = [];
    $.map(DOC_TYPE.labels, function(a) {
        if ($.inArray(a['id'], DOCUMENT_TYPES.MandatoryCommonDoc) >= 0) {
            mandatoryArr.push(a);
        }
        if (isCoapp == 1) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.MandatoryRelationDoc) >= 0) {
                mandatoryArr.push(a);
            }
        }
        if (occupationId == 1) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.MandatorySalariedDoc) >= 0) {
                mandatoryArr.push(a);
            }
        } else if (occupationId == 2 || occupationId == 3) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.MandatorySelfEmployedDoc) >= 0) {
                mandatoryArr.push(a);
            }
        }
        if (nationality != 2) {
            if ($.inArray(a['id'], DOCUMENT_TYPES.MandatoryNRIDoc) >= 0) {
                mandatoryArr.push(a);
            }
        }
    });
    var newArr = [];
    if(origin != 'partner'){
    	$.each(mandatoryArr, function(a) {
            newArr.push(mandatoryArr[a].id);
        })
    }
    return newArr;
}

function docCollected(data) {
    var collectURL = environment() + '/doc-collect';
    $.ajax({
        url: collectURL,
        dataType: 'json',
        type: 'POST',
        data: data,
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val()
        },
        beforeSend: function(e) {
            $("#popupLoaderBox").show();
        },
        success: function(d) {
            $("#popupLoaderBox").hide();
            if (data['isCollected'] && (!data['isOther'])) {
                $('#' + data['id']).parents('.proofBox').addClass('active');
            } else {
                $('#' + data['id']).parents('.proofBox').removeClass('active');
            }
        },
        error: function(d) {
            console.log(d);
            $("#popupLoaderBox").hide();
        }
    });
}

function inhouseDocCollected(data) {
    var collectURL = environment() + '/applicant-collected-documents';
    $.ajax({
        url: collectURL,
        dataType: 'json',
        type: 'POST',
        data: data.collectedDocs,
        headers: {
            'X-CSRF-TOKEN': $('input[name="_token"]').val()
        },
        beforeSend: function(e) {
            $("#popupLoaderBox").show();
        },
        success: function(d) {
            $("#popupLoaderBox").hide();
            if (data.collectedDocs.isCollected && (!data.isOther)) {
                $('#' + data.id).parents('.proofBox').addClass('active');
            } else {
                $('#' + data.id).parents('.proofBox').removeClass('active');
            }
        },
        error: function(d) {
            console.log(d);
            $("#popupLoaderBox").hide();
        }
    });
}

function queryParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return (results != null) ? results[1] : null;
}
/*--------------------- CHECK EMPTY -----------------*/
function isEmpty(val) {
    if (typeof val == 'undefined' || val == null || val == '') {
        return true;
    }
    return false;
}
/*--------------------- CHECK EMPTY -----------------*/
/*--------------------- VALIDATE PERSONAL TILE -----------------*/
function verifyPersonalTile() {
    var ERROR = false;
    var appNationality = $('#userNationalityId').val();
    var jsonData = {
        'applicant': [],
        'coApplicant': []
    };
    $('.applicantForm').each(function() {
        //ERROR = false;
        error = false;
        var applicantTypeId = $(this).data('applicant');
        var userData = {};
        var inputs = $(this).find('input[name]:not(.skip), select[name]:not(.skip)');
        $.each(inputs, function(id, input) {
            obj = $(input);
            if (obj.attr('type') == 'checkbox') {
                if (obj.is(':checked')) {
                    userData[obj.attr('name')] = obj.val();
                } else {
                    userData[obj.attr('name')] = 0;
                }
            } else {
                userData[obj.attr('name')] = obj.val();
            }
        });
        error = !validateUser(userData, applicantTypeId);
        if(typeof $('#coApplicantPAN').val() !== 'undefined' && $('#coApplicantPAN').val() != ""){
	        if ($('#userPAN').val() == $('#coApplicantPAN').val()) {
	            ERROR = true;
	            inputErrorShow($('[name="userPAN"]'), Error.userPAN.unique);
	        }
        }
        ERROR = ERROR ? ERROR : error;
        userData['userDob'] = userData['userDobYY'] + '-' + userData['userDobMM'] + '-' + userData['userDobDD'];
        if (applicantTypeId == 1) {
            jsonData.applicant.push(userData);
        } else {
            jsonData.coApplicant.push(userData);
        }
    });
    return {
        status: !ERROR,
        data: jsonData
    };
}
/*--------------------- VALIDATE PERSONAL TILE -----------------*/
/*--------------------- VALIDATE EMPLOYMENT TILE -----------------*/
function validateEmploymentTile() {
    var a = validateBoxxx28();
    return validateBoxxx28();
}
/*--------------------- VALIDATE EMPLOYMENT TILE -----------------*/
/*--------------------- VALIDATE REFERENCE TILE -----------------*/
function validateReferenceTile() {
    var $this = $('#verifyReferenceDetails');
    var ERROR = false;
    var error = false;
    var jsonData = {
        'reference': []
    };
    $('.refOneForm').each(function() {
        var refTypeId = $(this).data('refnum');
        var userData = {};
        var inputs = $(this).find('input[name]:not(.skip), select[name]:not(.skip)');
        $.each(inputs, function(id, input) {
            obj = $(input);
            if (obj.attr('type') == 'checkbox') {
                if (obj.is(':checked')) {
                    userData[obj.attr('name')] = obj.val();
                } else {
                    userData[obj.attr('name')] = 0;
                }
            } else {
                userData[obj.attr('name')] = obj.val();
            }
        });
        error = !validateReference(userData, refTypeId);
        ERROR = ERROR ? ERROR : error;
        userData['refTypeId'] = refTypeId;
        userData['appId'] = appId;
        jsonData.reference[refTypeId] = userData;
    });
    return {
        status: !ERROR,
        data: jsonData
    };
}
/*--------------------- VALIDATE REFERENCE TILE -----------------*/
/*--------------------- SET SUBMIT BUTTON -----------------*/
function setSubmitButton(){
    var targetTile = $('.pageSection:visible').last();
    $('.btnArea a').removeClass('lastFinalSubmit').html('Save & Continue <em class="icon-right-arrow"></em>');
    $('.btnArea a#lastFinalSubmit').remove();
    if(targetTile.find('.btnArea a').length){
        // console.log(targetTile.find('.btnArea a')[0]);
        targetTile.find('.btnArea a').html('Submit Application <em class="icon-right-arrow"></em>').addClass('lastFinalSubmit');
    }else{
        targetTile.find('.btnArea').prepend('<a href="javascript:void(0)" class="btn btnRripple lastFinalSubmit" id="lastFinalSubmit">Submit Application <em class="icon-right-arrow"></em></a>')
    }
}
/*--------------------- SET SUBMIT BUTTON -----------------*/
/*--------------------- AMOUNT TO WORD -----------------*/
function amountWord(amount) {
    amount = amount.toString();
    var amountWord = '';
    if(amount.length >= 8){
            amount = amount/10000000;
            amount = amount.toFixed(2);
            amountWord = 'Cr';
        }else if(amount.length >= 6){
            amount = amount/100000;
            amount = amount.toFixed(2);
            amountWord = 'Lacs';
        }else{
            amount = rupeeFormat(amount);
            amountWord = '';
        }
    return (amount + ' ' + amountWord); 
}
/*--------------------- AMOUNT TO WORD -----------------*/