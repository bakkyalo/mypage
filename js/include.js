// side-bar.html を挿入する
function input_side() {
    $.ajax( {
        url: "../side-bar.html",
        cache: false,
        success: function(html) {
            // document.write(html);
            document.append(html);
        }
    });
}

// https://qiita.com/yumetodo/items/00b37234cb86e741f0fb
let include_html = function(html_url, insert_into_arr) {
    $.ajax(html_url, {
        timeout: 1000,
        datatype: 'html'
    }).then(function(data) {
        let out_html = $($.parseHTML(data));
        let i;
        for(i = 0; i < insert_into_arr.length; ++i) {
            $("#" + insert_into_arr[i][1]).empty().append(out_html.filter("#" + insert_into_arr[i][0])[0].innerHTML);
        }
    }, function(jqXHR, textStatus) {
        if(textStatus !== "success") {
            let txt = "<p>textStatus: " + textStatus + "</p>" +
                "<p>status: " + jqXHR.status + "</p>" +
                "<p>responseText: </p><div>" + jqXHR.responseText + 
                "</div>";
            $('#page').html(txt);
            // $('#page2').html(txt);
        }
    });
};