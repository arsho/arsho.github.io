$(document).ready(function () {
    /*Project API Starts*/
    $api_link = "http://datamate.ws/shofolio/api/index.php?username=arsho";

    $.getJSON($api_link, function (data) {
        $final_html_data = '';
        $projectAr = data.project;
        $mainArLen = $projectAr.length;
        if ($mainArLen === 0) {
            $final_html_data += '<div class="alert alert-danger">';
            $final_html_data += '<strong>Sorry';
            $final_html_data += '!</strong> API returns an empty list.';
            $final_html_data += '</div>';

        }
        /*Project iteration starts*/
        for ($i = 0; $i < $mainArLen; $i++) {
            $ShortName = $projectAr[$i]["ShortName"];
            $FullName = $projectAr[$i]["FullName"];
            $ImageUrl = $projectAr[$i]["ImageUrl"];
            $ImageUrlLen = $ImageUrl.length;
            $Catagory = $projectAr[$i]["Catagory"];
            $Description = $projectAr[$i]["Description"];
            $Technology = $projectAr[$i]["Technology"];
            $AuthorUsername = $projectAr[$i]["AuthorUsername"];
            $GithubUrl = $projectAr[$i]["GithubUrl"];
            $Link = $projectAr[$i]["Link"];

            $single_row = '';

            if ((($i + 1) % 4 === 0 || $i === 0) && $i !== $projectAr.length - 1) {
                $single_row += '             <div class="row"><!--.project_row-->';
            }

            $single_row += '             <div class="col-md-3 col-sm-12 col-xs-12">';
            $single_row += '                 <div class="panel panel-info text-center">';
            $single_row += '                    <div class="panel-heading">';
            $single_row += '                        <h4 class="project_title text-center">' + $FullName + '</h4>';
            $single_row += '                    </div>';
            $single_row += '                    <div data-toggle="tooltip" data-placement="top" title="Click to view details" class="panel-body project_panel_body">';
            $single_row += '                        <div class="hovereffect"  data-toggle="modal" data-target="#' + $ShortName + '">';
            $single_row += '                            <img class="img-thumbnail img-responsive project_image" src="' + $ImageUrl[0] + '" />';
            $single_row += '                            <div class="overlay">';
            $single_row += '                                <h2><i class="fa fa-database"></i><sup><i class="fa fa-heart text-danger icon_overlapping_left_small"></i></sup> Datamate</h2>';
            $single_row += '                            </div>';
            $single_row += '                        </div>';
            $single_row += '                    </div>';
            $single_row += '                    <div class="panel-footer">';

            for ($k = 0; $k < $Catagory.length; $k++) {
                $thisCat = $Catagory[$k];
                if ($thisCat === 'web') {
                    $single_row += '                        <span data-toggle="tooltip" data-placement="top" title="Web Application" class="btn btn-info btn-social-icon">';
                    $single_row += '                            <i class="fa fa-globe"></i>';
                    $single_row += '                        </span>';
                }
                if ($thisCat === 'desktop') {
                    $single_row += '                        <span data-toggle="tooltip" data-placement="top" title="Desktop Application" class="btn btn-warning btn-social-icon">';
                    $single_row += '                            <i class="fa fa-desktop"></i>';
                    $single_row += '                        </span>';
                }
                if ($thisCat === 'mobile') {
                    $single_row += '                        <span data-toggle="tooltip" data-placement="top" title="Mobile Application" class="btn btn-primary btn-social-icon">';
                    $single_row += '                            <i class="fa fa-mobile"></i>';
                    $single_row += '                        </span>';
                }
            }


            $single_row += '                    </div>';
            $single_row += '                </div>';

            $single_row += '                <!--.Project ' + $ShortName + ' modal starts-->';
            $single_row += '                <div class="modal fade" id="' + $ShortName + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
            $single_row += '                    <div class="modal-dialog modal-lg" role="document">';
            $single_row += '                        <div class="modal-content">';
            $single_row += '                            <div class="modal-header">';
            $single_row += '                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            $single_row += '                                <h4 class="modal-title" id="myModalLabel">' + $FullName + '</h4>';
            $single_row += '                            </div>';
            $single_row += '                            <div class="modal-body project_modal_panel_body">';
            $single_row += '                                <div class="row">';

            if ($ImageUrlLen > 1) {
                $single_row += '<!--carousal starts-->';
                $single_row += '<div id="carousel-' + $ShortName + '" class="carousel slide" data-ride="carousel">';
                $single_row += '    <!-- Indicators -->';
                $single_row += '    <ol class="carousel-indicators">';
                for ($k = 0; $k < $ImageUrlLen; $k++) {
                    if ($k === 0) {
                        $className = 'class="active"';
                    }
                    else {
                        $className = '';
                    }
                    $single_row += '        <li data-target="#carousel-' + $ShortName + '" data-slide-to="' + ($k + 1) + '" ' + $className + '></li>';
                }
                $single_row += '    </ol>';

                $single_row += '    <!-- Wrapper for slides -->';
                $single_row += '    <div class="carousel-inner" role="listbox">';

                for ($k = 0; $k < $ImageUrlLen; $k++) {
                    if ($k === 0) {
                        $className = ' active';
                    }
                    else {
                        $className = '';
                    }
                    $single_row += '        <div class="item' + $className + '">';
                    $single_row += '            <img class="center-block img-thumbnail img-responsive project_modal_image" src="' + $ImageUrl[$k] + '" alt="' + $FullName + '">';
                    $single_row += '        </div>';
                }

                $single_row += '    </div>';

                $single_row += '    <!-- Controls -->';
                $single_row += '    <a class="left carousel-control" href="#carousel-' + $ShortName + '" role="button" data-slide="prev">';
                $single_row += '        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
                $single_row += '        <span class="sr-only">Previous</span>';
                $single_row += '    </a>';
                $single_row += '    <a class="right carousel-control" href="#carousel-' + $ShortName + '" role="button" data-slide="next">';
                $single_row += '        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
                $single_row += '        <span class="sr-only">Next</span>';
                $single_row += '    </a>';
                $single_row += '</div>';
                $single_row += '<!--carousal ends-->';
            }
            else if ($ImageUrlLen === 1) {
                $single_row += '                                    <img class="center-block img-thumbnail img-responsive project_modal_image" src="' + $ImageUrl + '" />';
            }
            $single_row += '                                    <div class="well well-sm project_description_div">';
            $single_row += '                                    ' + $Description;
            $single_row += '                                        <p class="lead project_technology_p">';
            $single_row += '                                            <strong>Technology:</strong> ' + $Technology + '';
            $single_row += '                                        </p>';
            $single_row += '                                    </div>';
            $single_row += '                                </div>';
            $single_row += '                            </div>';

            $single_row += '                            <div class="modal-footer">';
            $single_row += '                                    <ul class="list-inline list-unstyled text-center pull-left">';

            if ($GithubUrl !== '') {
                $single_row += '                                        <li>';
                $single_row += '                                            <a data-toggle="tooltip" data-placement="top" title="Github Repo" class="btn btn-github btn-social-icon" href="' + $GithubUrl + '">';
                $single_row += '                                                <i class="fa fa-github"></i>';
                $single_row += '                                            </a>';
                $single_row += '                                        </li>';
            }
            if ($Link !== '') {
                $single_row += '                                        <li>';
                $single_row += '                                            <a data-toggle="tooltip" data-placement="top" title="Watch Live" class="btn btn-warning btn-social-icon" href="' + $Link + '">';
                $single_row += '                                                <i class="fa fa-link"></i>';
                $single_row += '                                            </a>';
                $single_row += '                                        </li>';
            }
            $single_row += '                                    </ul>';

            $single_row += '                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
            $single_row += '                            </div><!--./modal-footer-->';
            $single_row += '                        </div>';
            $single_row += '                    </div>';
            $single_row += '                </div>                    ';
            $single_row += '                <!--./Project ' + $ShortName + ' modal ends-->';
            $single_row += '            </div>';
            $single_row += '            <!--./Project ' + $ShortName + '-->';

            if (($i + 1) % 4 === 0 || $i === $projectAr.length - 1) {
                $single_row += '             </div> <!--./project_row-->';
            }


            $final_html_data += $single_row;
        }
        /*Project iteration ends*/

        $("#project_div").html($final_html_data);
        /*Tooltip starts*/
        $('[data-toggle="tooltip"]').tooltip();
        // carousel demo
        $('.carousel').carousel();
        /*Tooltip ends*/

    });

    /*Project API Ends*/
    /*Prettyphoto starts*/
    $("[rel^='lightbox']").prettyPhoto({
        theme: 'light_rounded',
        social_tools: false,
        deeplinking: false
    });
    /*Prettyphoto ends*/
});