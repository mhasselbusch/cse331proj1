$path_to_backend = 'https://das-lab.org/cse331fa2017/PhotosBackend/';


function fetchPhotos()
{
    // get the dive where the images should go
    var $tn_div = $("#thumbs");

    // just in case there's anything still in the thumbnails div, clear it out
    $tn_div.empty();
    // retrieve images from the database
    $endpoint = $path_to_backend + 'getPhotos.php';

    $.getJSON($endpoint, function(data)
    {
        jQuery.each(data, function(key, val)
        {
            var full_size_src = val.tn_src.replace('/tn/', '')

            var link = $("<a />")
                .attr("href", $path_to_backend + full_size_src)
                .attr("data-lightbox", "gallery");

            var image = $("<img />")
                .attr("src", $path_to_backend + val.tn_src)
                .attr("id", val.id)
                .attr("class", "tn")
                .attr("data-lightbox", "gallery")


            var div = $("<div />")
                .attr("class", "col-xs-2 tn-image");

            link.append(image);
            div.append(link);
            div.appendTo($tn_div);
            
        });
    });
};

$(document).ready(fetchPhotos());

// verification for the file
$(':file').on('change', function() 
{
    var file = this.files[0];
    if (file.size > 10485760)
    {
        alert('Max upload size is 10 MB.');
    }
    // alert(file.name);
    // alert(file.type);
});

$(':button').on('click', function() 
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
        }
    });
});