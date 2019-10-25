
var firstpage = 1;
var pagelimit = 2;
var pagedata = null;

$('#home-estate').click((e) => {
    if (e.target.nodeName == 'H3') {
        $.ajax({

            type: 'GET',

            contentType: 'application/json;charset=UTF-8',

            url: e.target.dataset.api,

            success: function (result) {
                console.log('get:', e.target.dataset.api, '  sucess');
                $('#h-title').text(result.title);
                $('#h-image').attr('src', result.imageurl);
                $('#h-estate').text(result.estate);
                $('#h-area').text(result.area);
                $('#h-rent').text(result.rend);
                $('#h-bedrooms').text(result.bedrooms);
                $('#h-tenants').text(result.tenants);
                $('#h-createdAt').text(new Date(result.createdAt).toDateString());
                $('#h-updatedAt').text(new Date(result.updatedAt).toDateString());

                $('#modal-home').modal('show');
            },

            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    }

});

$('#createbutton').click(() => {
    console.log('click');
    var data = $('#createform').serializeArray();
    var estate = {
        'title': data[0]['value'],
        'imageurl': data[1]['value'],
        'estate': data[2]['value'],
        'bedrooms': data[3]['value'],
        'area': data[4]['value'],
        'tenants': data[5]['value'],
        'rent': data[6]['value'],
        'isHighlight': data[7] ? true : false,
    };
    console.log(estate);
    $.ajax({

        type: 'POST',

        contentType: 'application/json;charset=UTF-8',

        url: '/estate/cre',
        data: JSON.stringify({ Estate: estate }),

        beforeSend: function () {
            for (var i = 0; i < 7; i++) {
                if (!data[i].value) {
                    window.alert('please Complete the form');
                    return false;
                }
            }
        },
        success: function () {
            window.alert('create success!');

        },

        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });
});


$('#tableedit').on('click', (e) => {
    console.log(e.target, e.target.getAttribute('data-id'));

    if (e.target.nodeName == 'BUTTON') {

        // $('#modal-admin').modal('show');
        $.ajax({

            type: 'GET',

            contentType: 'application/json;charset=UTF-8',

            url: e.target.getAttribute('data-id'),


            success: function (result) {
                $('#editform input[name="title"]').val(result.title);
                $('#editform input[name="imageurl"]').val(result.imageurl);
                $('#editform select[name="estate"]').val(result.estate);
                $('#editform input[name="bedrooms"]').val(result.bedrooms);
                $('#editform input[name="area"]').val(result.area);
                $('#editform input[name="tenants"]').val(result.tenants);
                $('#editform input[name="rent"]').val(result.rent);
                $('#editform input[name="isHighlight"]').attr('checked', result.isHighlight);
                $('#editbutton').attr('data-id', '/estate/edit/' + result.id);
                $('#deletebutton').attr('data-id', '/estate/del/' + result.id);
                $('#modal-admin').modal('show');
            },

            error: function (e) {
                console.log(e.status);
                console.log(e.responseText);
            }
        });
    }
});


$('#editbutton').click(() => {
    console.log('click');
    var data = $('#editform').serializeArray();
    var estate = {
        'title': data[0]['value'],
        'imageurl': data[1]['value'],
        'estate': data[2]['value'],
        'bedrooms': data[3]['value'],
        'area': data[4]['value'],
        'tenants': data[5]['value'],
        'rent': data[6]['value'],
        'isHighlight': data[7] ? true : false,
    };
    console.log(estate);
    $.ajax({

        type: 'POST',

        contentType: 'application/json;charset=UTF-8',

        url: $('#editbutton').attr('data-id'),
        data: JSON.stringify({ Estate: estate }),

        beforeSend: function () {
            for (var i = 0; i < 7; i++) {
                if (!data[i].value) {
                    window.alert('please Complete the form');
                    return false;
                }
            }
        },
        success: function () {
            console.log('post:', $('#editbutton').attr('data-id'), '  success');
            location.reload();
        },

        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });
});

$('#deletebutton').click(() => {
    console.log('click');

    $.ajax({

        type: 'POST',

        contentType: 'application/json;charset=UTF-8',

        url: $('#deletebutton').attr('data-id'),

        success: function () {
            console.log('post:', $('#deletebutton').attr('data-id'), '  success');
            location.reload();
        },

        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });
});


$('#searchbutton').click(() => {
    var sd = $('#searchform').serializeArray();
    var dat = {};

    sd[0].value && (dat.bedrooms = sd[0].value);
    sd[1].value && (dat.estate = sd[1].value);

    $.ajax({

        type: 'POST',

        contentType: 'application/json;charset=UTF-8',

        url: '/estate/search',
        data: JSON.stringify({ Estate: dat }),
        success: function (res) {
            console.log('post:', '/estate/search', '  success');
            console.log(res);
            pagedata = res;
            pagination(0);
        },

        error: function (e) {
            console.log(e.status);
            console.log(e.responseText);
        }
    });
});


$('#three').hide();
function pagination(a) {
    if (!pagedata) {
        $('#zero').html('<h2>no serch result</h2>');
        $('#three').hide();
    }
    $('#three').show();
    var len = Math.ceil(pagedata.length / pagelimit);
    if (firstpage == 1 && a == -1) {
        window.alert('has first');
        a = 0;
    }
    if (firstpage == len && a == 1) {
        window.alert('has last');
        a = 0;
    }


    firstpage += a;
    var q = (firstpage - 1) * 2;

    if (pagedata[q]) {
        var html = `
        <div class="col-md-6">
            <h3 id="hh-title" style="color:#070708;"> ${pagedata[q].title} </h3>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div
                    style="width: 225px; height: 225px; overflow: hidden; position: relative;">
                    <img id="hh-image" style="position:absolute; max-width: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0;"
                        src="${pagedata[q].imageurl}" alt="estate">
                </div>

            </div>
            <div class="row">
                <div class="row"><b>Estate: </b><span id="hh-estate">${pagedata[q].estate}</span></div>
                <div class="row"><b>Gross Area: </b><span id="hh-area">${pagedata[q].area}</span></div>
                <div class="row"><b>Rent: </b><span id="hh-rent">${pagedata[q].rent}</span></div>
            </div>
        </div>    
        `;

        $('#one').html(html);
    }

    if (pagedata[q + 1]) {
        var html1 = `
        <div class="col-md-6">
            <h3 id="hh-title" style="color:#070708;"> ${pagedata[q + 1].title} </h3>
        </div>
        <div class="col-md-6">
            <div class="row">
                <div
                    style="width: 225px; height: 225px; overflow: hidden; position: relative;">
                    <img id="hh-image" style="position:absolute; max-width: 100%; left: 0; top: 0; right: 0; bottom: 0; margin: 0;"
                        src="${pagedata[q + 1].imageurl}" alt="estate">
                </div>

            </div>
            <div class="row">
                <div class="row"><b>Estate: </b><span id="hh-estate">${pagedata[q + 1].estate}</span></div>
                <div class="row"><b>Gross Area: </b><span id="hh-area">${pagedata[q + 1].area}</span></div>
                <div class="row"><b>Rent: </b><span id="hh-rent">${pagedata[q + 1].rent}</span></div>
            </div>
        </div>
        `;

        $('#two').html(html1);
    }


}