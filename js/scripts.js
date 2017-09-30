$path_to_backend = 'https://das-lab.org/cse331fa2017/PhotosBackend/';

function fetchPhotos()
{
    // get the div where the images should go
    var $tn_div = $("#thumbs");

    // just in case there's anything still in the thumbnails div, clear it out
    $tn_div.empty();

    // retrieve images from the database
    $endpoint = $path_to_backend + 'getPhotos.php';
    var viewPhotoEndpoint = $path_to_backend + 'viewPhoto.php';
    var currentDiv;
    $.getJSON($endpoint, function(data)
    {
        jQuery.each(data, function(key, val)
        {
            var full_size_src = val.tn_src.replace('/tn/', '')

            var link = $("<a />")
                .attr("class", "image")
                .attr("href", $path_to_backend + full_size_src)
                .attr("id", val.id)
                .attr("data-lightbox", "gallery");

            var image = $("<img />")
                .attr("src", $path_to_backend + val.tn_src)
                .attr("id", val.id)
                .attr("class", "tn")
                .attr("data-lightbox", "gallery");


            var div = $("<div />")
                .attr("class", "col-xs-2");

            var div2 = $("<div />")
                .attr("class", "tn-image");

            var trash = $("<i />")
                .attr("class", "fa fa-trash deleteIcon")
                .attr("aria-hidden", "true")

            link.append(image);
            div2.append(link);
            div2.append(trash);
            div.append(div2);            
            div.appendTo($tn_div);
            
        });
    }).done(function(){
        $("a[class=image]").children().each(function(){
            var _id = $(this).attr("id");
            var item = $(this).parent();
            $.ajax({
                url: viewPhotoEndpoint + "?id=" + _id,
                type: 'GET',

                // some flags for jQuery
                cache: true,
                contentType: false,
                processData: false,
                success : function(data){
                    item.attr("data-title", data[0].description);
                    item.parent().find("i").on('click', function(){
                        console.log("click");
                        deletePhoto(item.parent());
                    });
                }
            });
        });
    });
};

$(document).ajaxStart(function() {
    $('#thumbs').hide();
    $('.loadgif').show();
});

$(document).ajaxStop(function() {
    $('#thumbs').show();
    $('.loadgif').hide();
});

$(document).ready(
    fetchPhotos()
);

// verification for the file
$(':file').on('change', function() 
{
    var file = this.files[0];
    if (file.size > 10485760)
    {
        alert('Max upload size is 10 MB.');
    }
});

$("input[value='Upload Photo']").on('click', function() 
{
    // for data, we want to submit the photo and the description
    var photoFormData = new FormData(document.forms['uploader']);
    $.ajax({
        url: $path_to_backend + 'uploadPhoto.php',
        type: 'POST',
        data: photoFormData,

        // some flags for jQuery
        cache: false,
        contentType: false,
        processData: false,

        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                // For handling the progress of the upload
                myXhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        $('progress').attr({
                            value: e.loaded,
                            max: e.total,
                        });
                    }
                } , false);
            }
            return myXhr;
        },
        success: function(data) {
            var datastr = JSON.stringify(data);
            if (datastr.includes("LAST_INSERT_ID()")) {
                fetchPhotos();
                document.getElementById("uploadme").reset();

            } else {
                alert("There was an error loading that image")
            }

        }
    });
});


function deletePhoto(container){

    var id = container.find("img").attr("id");
    var deletePhotoEndpoint = $path_to_backend + 'deletePhoto.php';
    var formData = new FormData();
    formData.append("id", id);
    $.ajax({
        url: deletePhotoEndpoint,
        type: 'POST',
        data: formData,

        // some flags for jQuery
        cache: true,
        contentType: false,
        processData: false,
        success : function(data){
            console.log(data);
            fetchPhotos();
            lightBoxGlobal.end();
        }
    });   
}


