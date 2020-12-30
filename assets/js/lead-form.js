$(document).ready(function() {
    $(".leadCountryCode").on("change", function() {
        var parent=$(this).parents('form');
        var select = $(this);
        select.children("option").each(function() {
            $(this).html($(this).data("before"));
        });
        select.children("option:selected").html(
            $(this)
                .children("option:selected")
                .data("after")
        );

        parent.find(".leadCity").html('<option value="">Select City</option>');

        var selectedCountry_code =
            "+" + $(this).find("option:selected").val();
        var selected_country_index = locationList.countries.findIndex(
            country => country.code == selectedCountry_code
        );
        var selected_country_id =
            locationList.countries[selected_country_index].serial;
        var selected_states = new Array();
        selected_states = $.map(locationList.states, function(state) {
            if (state.parent == parseInt(selected_country_id))
                return state.serial;
        });
        if (selected_states.length) {
            var selected_cities = new Array();
            selected_cities = $.map(locationList.cities, function(city) {
                if ($.inArray(city.parent, selected_states) != -1) return city;
            });
            if (selected_cities.length) {
                selected_cities = selected_cities.slice().sort(nameCitySort);
                $.each(selected_cities, function(id, city) {
                    parent.find(".leadCity").append(
                        $("<option/>", {
                            value: city.name,
                            text: city.name
                        })
                    );
                });
            } else {
                noCities(selected_country_index);
            }
        } else {
            noCities(selected_country_index);
        }
    });

    $(".leadSave").on("click", function() {
        var parent = $(this).parents('form');
        validateLeadForm(parent);
    });

    $.getScript(
        APP_BASE_PATH + "public/datafiles/data.js?v=" + APP_VERSION,
        function() {
            $.each(locationList.countries, function(key, country) {
                if (country.code) {
                    $(".leadCountryCode").append(
                        $("<option/>", {
                            value: country.code.replace("+", ""),
                            text: country.name + " (" + country.code + ")",
                            "data-before":
                                country.name + " (" + country.code + ")",
                            "data-after": country.code
                        })
                    );
                }
            });

            $(".leadCountryCode")
                .val(91)
                .trigger("change");
        }
    );

    function validateLeadForm(parent) {
        var leadFlag = true;

        if (!validateName(parent.find(".leadName").val())) {
            leadFlag = false;
            parent.find(".leadName")
                .siblings("span.errorMsg")
                .html(parent.find(".leadName").attr("msg"));
        } else {
            parent.find(".leadName")
                .siblings("span.errorMsg")
                .html("");
        }

        if (!validateEmail(parent.find(".leadEmail").val())) {
            leadFlag = false;
            parent.find(".leadEmail")
                .siblings("span.errorMsg")
                .html(parent.find(".leadEmail").attr("msg"));
        } else {
            parent.find(".leadEmail")
                .siblings("span.errorMsg")
                .html("");
        }

        if (parent.find(".leadCountryCode").val() == "" && parent.find(".leadCountryCode").val() <= 0) {
            leadFlag = false;
            parent.find(".leadCountryCode")
                .siblings("span.errorMsg")
                .html(parent.find(".leadCountryCode").attr("msg"));
        } else {
            parent.find(".leadCountryCode")
                .siblings("span.errorMsg")
                .html("");
        }
        if (!validateMobile(parent.find(".leadContact").val()) || parent.find(".leadContact").val() == '') {
            leadFlag = false;
            parent.find(".leadContact")
                .parent('div')
                .siblings("span.errorMsg")
                .html(parent.find(".leadContact").attr("msg"));
        } else {
            parent.find(".leadContact")
                .parent('div')
                .siblings("span.errorMsg")
                .html("");
        }

        if (parent.find(".leadCity").val() == "" && parent.find(".leadCity").val() <= 0) {
            leadFlag = false;
            parent.find(".leadCity")
                .siblings("span.errorMsg")
                .html(parent.find(".leadCity").attr("msg"));
        } else {
            parent.find(".leadCity")
                .siblings("span.errorMsg")
                .html("");
        }

        if (parent.find(".leadLoanType").val() == "") {
            leadFlag = false;
            parent.find(".leadLoanType")
                .siblings("span.errorMsg")
                .html(parent.find(".leadLoanType").attr("msg"));
        } else {
            parent.find(".leadLoanType")
                .siblings("span.errorMsg")
                .html("");
        }

        if (parent.find(".leadLoanAmount").val() == "") {
            leadFlag = false;
            parent.find(".leadLoanAmount")
                .siblings("span.errorMsg")
                .html(parent.find(".leadLoanAmount").attr("msg"));
        } else {
            parent.find(".leadLoanAmount")
                .siblings("span.errorMsg")
                .html("");
        }

        if (leadFlag) {
            if (EVENT_TRACKING) {
                var objTrack = seoTalkToUsTracking(parent.find('#eventName').val());
                trackEvent.go(objTrack.category, objTrack.action);
            }

            var apiUrl = APP_BASE_PATH + "ExtApi/push-to-lms";

            $.ajax({
                url: apiUrl,
                type: "POST",
                dataType: "json",
                data: {
                    userName: parent.find(".leadName").val(),
                    userEmail: parent.find(".leadEmail").val(),
                    userCountryCode: parent.find(".leadCountryCode").val(),
                    userMobile: parent.find(".leadContact").val(),
                    userLocation: parent.find(".leadCity").val(),
                    loanTypeName: parent.find(".leadLoanType").val(),
                    loanAmount: parent.find(".leadLoanAmount").val(),
                    OptInWhatsapp : parent.find(".OptInWhatsapp").is(":checked") ? true : false
                },
                headers: {},
                beforeSend: function() {
                    parent.find('.successMsg').html('');
                    parent.find('#errorMsg').html('');
                    parent.find('.leadSave').prop('disabled', true);
                },
                success: function(response) {
                    if (response.Status && parseInt(response.Status) == 1) {
                        parent.find('.successMsg').html('Thanks for sharing your details. Our executive will get back to you shortly.');
                        parent[0].reset();
                        parent.find(".leadCountryCode")
                            .val(91)
                            .trigger("change");
                    }else{
                        parent.find('#errorMsg').html('Something went wrong. Please try again Later');
                    }
                    console.log(response);
                    parent.find('.leadSave').prop('disabled', false);
                },
                error: function(d) {
                    console.log(d);
                    parent.find('#errorMsg').html(d);
                    parent.find('.leadSave').prop('disabled', false);
                }
            });
        }
    }

    function nameCitySort(a, b) {
        if (b.name < a.name) return 1;
        else if (b.name > a.name) return -1;
        else return 0;
    }

    function noCities(selected_country_index) {
        $(".leadCity").append(
            $("<option/>", {
                value: locationList.countries[selected_country_index].name,
                text: locationList.countries[selected_country_index].name
            })
        );

        $(".leadCity").val(locationList.countries[selected_country_index].name);
    }

    
    function seoTalkToUsTracking(eventName){
        var objData = {};
        switch(eventName){
            case 'home':
                objData.category = 'TalkToUs_Clicked';
                objData.action = 'TalkToUs_Submitted';
            break;
            
            case 'aboutUs':
            case 'career':
                objData.category = 'AboutAndCareer_Clicked';
                objData.action = 'AboutAndCareer_Submitted';
            break;
            
            case 'aboutHomeLoan':
            case 'aboutPersonalLoan':
            case 'aboutLoanAgainstProperty':
            case 'aboutBusinessLoan':
                objData.category = 'LoansOffered_Clicked';
                objData.action = 'LoansOffered_Submitted';
            break;
            
            case 'mainPopup':
                objData.category = 'PopUp_Form_Clicked';
                objData.action = 'PopUp_Form_Submitted';
            break;                
        }    

        return objData;        
    }

    
});