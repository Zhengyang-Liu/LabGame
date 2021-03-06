// JavaScript source code
// Main script
//boolean for checking correct answer
//-1 for no answer, 0 for incorrect answer and 1 for correct answer
$(document).ready(function () {
    resizeWindow();
});
var gameMode = 0;
var hint = 1;
var startTime = new Date().getTime() / 60000;
var endTime;
selectPractice();
//Select Panel
$('#introSelectButton').click(function () {
    selectIntro();
});
$("#practiceSelectButton").click(function () {
    selectPractice();
})
$("#advancedSelectButton").click(function () {
    selectAdvanced();
})

function selectIntro() {
    $("#selectPanel").hide();
    $("#part1").show();
    gameMode = 1;
}

function selectPractice() {
    hint = 1;
    $("#selectPanel").hide();
    $("#part2").show();
    gameMode = 2;
}

function selectAdvanced() {
    hint = 0;
    $("#selectPanel").hide();
    $("#part2").show();
    gameMode = 3;
}
//selectPractice();
//Intro Mode
$("#backFromIntro").click(function () {
    backToMenu();
})
$("#backFromPractice").click(function () {
    backToMenu();
})
var el = document.getElementById('answerDiv');
var sortable = Sortable.create(el, {
    animation: 400
    , ghostClass: 'ghost'
    , onUpdate: function ( /**Event*/ evt) {
        evt.oldIndex; // element index within parent
        checkOrder();
        if (checkAnswer()) {
            succeed();
        }
    }
});
checkOrder();

function checkOrder() {
    for (i = 1; i < 13; i++) {
        if ($("#answer" + i).next().attr("id") == "answer" + (i + 1) || $("#answer" + i).prev().attr("id") == "answer" + (i - 1)) {
            $("#answer" + i).addClass("rightAnswer");
        }
        else {
            $("#answer" + i).removeClass("rightAnswer");
        }
    }
}

function checkAnswer() {
    for (i = 1; i < 12; i++) {
        if ($("#answer" + i).index() != i - 1) {
            return false;
        }
    }
    return true;
}
$(".answer").on('mouseover', function () {
    var number = $(this).attr("data-pic");
    $("#answerImg").attr("src", "pictures/" + number + ".PNG");
    if ($(this).attr("id") == "answer1") {}
}).mouseout(function () {
    $(this).css('background-color', 'white');
});

function succeed() {
    swal("Correct!");
    postAnswer();
    //or win
    //if (stepNumber == 5) {
    //    alert("GAME OVER");
    //    document.location.reload();
    //}
}

function postAnswer() {
    endTime = new Date().getTime() / 60000;
    var time = (endTime - startTime).toPrecision(2);
    $.post( //call the server
        "data.php", //At this url
        {
            time: time
            , gameMode: gameMode
        , } //And send this data to it
    ).done(function (msg) {}).fail(function () {
        alert("Error, please contact your professor.");
    });
}

function backToMenu() {
    $("#part1").hide();
    $("#part2").hide();
    $("#selectPanel").show();
}
//paractice mode
var gameState = 0;
var tube = 0;
var pipetteFluid = false;
$("#pipette2").hide();
var labelCounter = 0;
var animationController = 0;

function dragMoveListener(event) {
    var target = event.target, // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        , y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}
state0();
//setTimer(300, 1000);
function state0() {
    messager("Click micro test tubes to label them as +pGLO and –pGLO");
    var state01 = 0;
    $("#tube1").click(function () {
        if ($(this).attr("data-state") == "-1") {
            state01++;
            $("#tube1").css("animation", "largerTube 1s forwards");
            setTimeout(function () {
                $("#penMover").show();
            }, 1000);
            setTimeout(function () {
                $("#penMover").hide();
                $("#tube1").attr("src", "pictures/open centrifuge tube without fluid M.svg")
            }, 1800);
            setTimeout(function () {
                $("#tube1").css("animation", "smallerTube 1s forwards");
            }, 2300);
            if (state01 >= 2) {
                gameState++;
                instruction();
                state1();
            };
            $(this).attr("data-state", "0");
        }
    });
    $("#tube2").click(function () {
        if ($(this).attr("data-state") == "-1") {
            state01++;
            $("#tube2").css("animation", "largerTube 1s forwards");
            setTimeout(function () {
                $("#penMover").show();
            }, 1000);
            setTimeout(function () {
                $("#penMover").hide();
                $("#tube2").attr("src", "pictures/open centrifuge tube without fluid P.svg")
            }, 1800);
            setTimeout(function () {
                $("#tube2").css("animation", "smallerTube 1s forwards");
            }, 2300);
            if (state01 >= 2) {
                gameState++;
                instruction();
                state1();
            };
            $(this).attr("data-state", "0");
        }
    });
}

function state1() {
    var tubeCounter = 0;
    //state 1
    messager("Drag a sterile transfer pipette to the Transformation solution bottle to withdraw 250µl of solution");
    interact('.pipette').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
    // enable draggables to be dropped into this
    interact('#container').dropzone({
        // only accept elements matching this CSS selector
        accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
        overlap: 0.15, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (animationController == 0) {
                $(event.relatedTarget).hide();
                $("#fakepipette1").show();
                $("#part2").addClass("anim_zoom1");
                setTimeout(function () {
                    $("#p1").show();
                }, 500);
                setTimeout(function () {
                    $("#p1").hide();
                    $("#part2").addClass("anim_zoomRe1");
                }, 2500)
                setTimeout(function () {
                    $("#fakepipette1").hide();
                    $(event.relatedTarget).show();
                    $("#part2").removeClass("anim_zoomRe1");
                    $("#part2").removeClass("anim_zoom1");
                }, 3000)
                animationController = 1;
            }
            if ($("#pipette1").offset().top + $("#pipette1").height() < ($("#container").offset().top + $("#container").height())) {
                $("#pipette1").attr("src", "pictures/1000 ul pipette (250 ul).svg");
                $("#pipette1").attr("data-state", "1");
                if (tubeCounter == 0) {
                    messager("Transfer transformation solution to the micro test tube labeled as +pGLO");
                }
                else {
                    messager("Transfer transformation solution to the micro test tube labeled as -pGLO");
                }
            }
            pipetteFluid = true;
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (pipetteFluid == true && $("#pipette1").offset().top + $("#pipette1").height() < ($(event.target).offset().top + $(event.target).height()) && $("#pipette1").attr("data-state") == 1) {
                if ($(event.target).attr("id") == "tube2") {
                    event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid P.svg");
                }
                else {
                    event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid M.svg");
                }
                $("#pipette1").attr("src", "pictures/Resized pipette without fluid.svg");
                $("#pipette1").attr("data-state", "0");
                if (event.target.getAttribute("data-state") == "0") {
                    event.target.setAttribute("data-state", "1")
                    tubeCounter++;
                    messager("Withdraw another 250µl of transformation solution ");
                    if (tubeCounter == 2) {
                        gameState++;
                        instruction();
                        messager("Discard the transfer pipette into the waste container");
                        interact('#trashBin').dropzone({
                            // only accept elements matching this CSS selector
                            accept: '#pipette1', // Require a 75% element overlap for a drop to be possible
                            overlap: 0.10, // listen for drop related events:
                            ondropactivate: function (event) {
                                // add active dropzone feedback
                                event.target.classList.add('drop-active');
                            }
                            , ondragenter: function (event) {
                                var draggableElement = event.relatedTarget
                                    , dropzoneElement = event.target;
                                // feedback the possibility of a drop
                                dropzoneElement.classList.add('drop-target');
                                draggableElement.classList.add('can-drop');
                            }
                            , ondragleave: function (event) {
                                // remove the drop feedback style
                                event.target.classList.remove('drop-target');
                                event.relatedTarget.classList.remove('can-drop');
                            }
                            , ondrop: function (event) {
                                trashItem("#pipette1");
                                state2();
                            }
                            , ondropdeactivate: function (event) {
                                // remove active dropzone feedback
                                event.target.classList.remove('drop-active');
                                event.target.classList.remove('drop-target');
                            }
                        });
                    }
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "parent"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
    interact('.loop').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            //restriction: "parent",
            endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
}
//state 2 
function state2() {
    messager("Take both micro test tubes out of the holder and transfer them to the crushed ice.");
    var state = 0;
    $("#pipette2").show();
    interact('.tube').draggable({
        // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }
    , });
    interact('.icebox').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tube', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("id") == "tube1") {
                if (event.relatedTarget.getAttribute("data-state") == "5") {
                    state++;
                }
                var left = $(event.target).position().left / $("#part2").width() * 100 + 22;
                $(event.relatedTarget).css("left", left + "%");
                var top = $(event.target).position().top / $("#part2").height() * 100 - 3;
                $(event.relatedTarget).css("top", top + "%");
                $(event.relatedTarget).css("transform", "");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2") {
                if (event.relatedTarget.getAttribute("data-state") == "5") {
                    state++;
                }
                var left = $(event.target).position().left / $("#part2").width() * 100 + 14;
                $(event.relatedTarget).css("left", left + "%");
                var top = $(event.target).position().top / $("#part2").height() * 100 - 3;
                $(event.relatedTarget).css("top", top + "%");
                $(event.relatedTarget).css("transform", "");
            }
            event.relatedTarget.setAttribute("data-x", "0");
            event.relatedTarget.setAttribute("data-y", "0");
            if (event.relatedTarget.getAttribute("data-state") == "1") {
                event.relatedTarget.setAttribute("data-state", "2");
                state++;
            }
            if (state == 2) {
                messager("Time for 60 secs ");
                gameState++;
                instruction();
                $("#timer").show();
                $("#timerInput").attr("value", "0");
                $("#timerConfirm").click(function () {
                    if (state == 2) {
                        var time = $("#timerInput").val();
                        if (time == 60) {
                            $("#timerInput").hide();
                            $("#timerConfirm").hide();
                            setTimer(time, 10);
                            state3();
                            state++;
                        }
                        else {
                            swal("Wrong time!");
                        }
                    }
                });
            }
            if (state == 5) {
                messager("Start the timer for 10mins");
                $("#timer").show();
                $("#timerInput").show();
                $("#timerInput").attr("value", "0");
                $("#timerConfirm").show();
                $("#timerConfirm").click(function () {
                    if (state == 5) {
                        state++;
                        var time = $("#timerInput").val();
                        if (time == 600) {
                            $("#timer").hide();
                            messager("Click on each of the four plates to label only on the bottom, but not the lid while waiting");
                            gameState = 8;
                            instruction();
                        }
                        else {
                            swal("Wrong time!")
                        }
                    }
                });
                $(".petriDish").click(function () {
                    if ($(this).attr("data-state3") == "0") {
                        switch ($(this).attr("id")) {
                        case "petriDish1":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "1" + ".svg");
                                $(".dishLabel").show();
                                $("#label1").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                                labelCounter++;
                                if (labelCounter == 4) {
                                    swal("Time's Up!");
                                    state6();
                                }
                            }, 2000);
                            break;
                        case "petriDish2":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "2" + ".svg");
                                $(".dishLabel").show();
                                $("#label2").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                                labelCounter++;
                                if (labelCounter == 4) {
                                    swal("Time's Up!");
                                    state6();
                                }
                            }, 2000);
                            break;
                        case "petriDish3":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "3" + ".svg");
                                $(".dishLabel").show();
                                $("#label3").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                                labelCounter++;
                                if (labelCounter == 4) {
                                    swal("Time's Up!");
                                    state6();
                                }
                            }, 2000);
                            break;
                        case "petriDish4":
                            $("#writeDish").show(1000);
                            setTimeout(function () {
                                $("#penMover1").show();
                            }, 1000);
                            setTimeout(function () {
                                $("#penMover1").hide();
                                $(".dishLabel").attr("src", "pictures/dishLabel" + "4" + ".svg");
                                $(".dishLabel").show();
                                $("#label4").show();
                                $("#writeDish").hide(2500);
                                $(".dishLabel").hide(2000);
                                labelCounter++;
                                if (labelCounter == 4) {
                                    swal("Time's Up!");
                                    state6();
                                }
                            }, 2000);
                            break;
                        default:
                            break;
                        }
                        $(this).attr("data-state3", "1");
                    }
                });
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}
//state 3 
function state3() {
    messager("Return the micro tubes to the holder");
    var state = 0;
    interact('.cube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.tube', // Require a 75% element overlap for a drop to be possible
        overlap: 0.50, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("id") == "tube1") {
                $("#tube1").css("left", "77.5%");
                $("#tube1").css("top", "51%");
                $(event.relatedTarget).css("transform", "");
                $("#tube1").attr("src", "pictures/open centrifuge tube with fluid M.svg");
            }
            if (event.relatedTarget.getAttribute("id") == "tube2") {
                $("#tube2").css("left", "68.5%");
                $("#tube2").css("top", "51%");
                $(event.relatedTarget).css("transform", "");
                $("#tube2").attr("src", "pictures/open centrifuge tube with fluid P.svg");
            }
            event.relatedTarget.setAttribute("data-x", "0");
            event.relatedTarget.setAttribute("data-y", "0");
            if (event.relatedTarget.getAttribute("data-state") == "2") {
                event.relatedTarget.setAttribute("data-state", "3");
                gameState++;
                instruction();
                if (gameState == 5) {
                    messager("Use a sterile loop to pick up a colony for the +pGLO/-pGLO tube");
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.starterPlate').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                if (event.relatedTarget.getAttribute("data-state") == "0") {
                    event.relatedTarget.setAttribute("data-state", "1")
                    $(event.relatedTarget).hide();
                    $("#fakeLoop0").show();
                    messager("Transfer the colony to one of the micro test tubes")
                    setTimeout(function () {
                        $("#fakeLoop0").css("animation", "loop 1s forwards");
                        $(event.target).attr("src", "pictures/starterplate without.svg");
                    }, 500);
                    $("#part2").addClass("anim_zoom3");
                    setTimeout(function () {
                        $("#part2").addClass("anim_zoomRe3");
                    }, 2000)
                    setTimeout(function () {
                        $("#fakeLoop0").hide();
                        $(event.relatedTarget).show();
                        $("#part2").removeClass("anim_zoomRe3");
                        $("#part2").removeClass("anim_zoom3");
                    }, 2500)
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("data-state") == "1") {
                $(event.relatedTarget).attr("data-state", "0");
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    if (event.target.getAttribute("data-state") == "3") {
                        if ($(event.target).attr("id") == "tube1") {
                            messager("Click the loop to twist it");
                            $(event.relatedTarget).hide();
                            $("#fakeLoop2").show();
                            $("#fakeLoop2").click(function () {
                                messager("Discard the loop");
                                $("#fakeLoop2").css("animation", "twist2 0.15s 4");
                                setTimeout(function () {
                                    $("#fakeLoop2").hide();
                                    $(event.relatedTarget).show();
                                }, 1000);
                            });
                        }
                        else {
                            messager("Click the loop to twist it");
                            $(event.relatedTarget).hide();
                            $("#fakeLoop1").show();
                            $("#fakeLoop1").click(function () {
                                messager("Discard the loop");
                                $("#fakeLoop1").css("animation", "twist2 0.15s 4");
                                setTimeout(function () {
                                    $("#fakeLoop1").hide();
                                    $(event.relatedTarget).show();
                                }, 1000);;
                            });
                        }
                        event.target.setAttribute("data-state", "4")
                        if (state == 0) {
                            $("#loop2").show();
                        }
                        gotoTrashBin("#loop1");
                        state++;
                        if (state == 2) {
                            $("#loop3").show();
                            gotoTrashBin("#loop2");
                        }
                    }
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state4() {
    messager("Immerse a new sterile loop into the plasmid DNA stock tube to withdraw a loopful of plasmid");
    interact('#plasmidContainer').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop'
        , overlap: 0.1, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (event.relatedTarget.getAttribute("data-state") == "0") {
                if ($(event.relatedTarget).offset().top + $(event.relatedTarget).height() < ($(event.target).offset().top + $(event.target).height())) {
                    $(event.relatedTarget).hide();
                    $("#fakeLoop").show();
                    $("#part2").addClass("anim_zoom2");
                    setTimeout(function () {}, 500);
                    setTimeout(function () {
                        $("#part2").addClass("anim_zoomRe2");
                    }, 2000)
                    setTimeout(function () {
                        $("#fakeLoop").hide();
                        $(event.relatedTarget).show();
                        $("#part2").removeClass("anim_zoomRe2");
                        $("#part2").removeClass("anim_zoom2");
                    }, 3000)
                    $(event.relatedTarget).attr("src", "pictures/yellow loop rainbow.svg");
                    messager("Mix the plasmid into the cells in +pGLO tube")
                    event.relatedTarget.setAttribute("data-state", 1);
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    //testing
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.loop', // Require a 75% element overlap for a drop to be possible
        overlap: 0.02, // listen for drop related events:
        ondrop: function (event) {
            if ($(event.target).attr("id") == "tube2") {
                gameState = 7;
                instruction();
                event.target.setAttribute("src", "pictures/closed centrifuge tube with fluid P.svg");
                $("#tube1").attr("src", "pictures/closed centrifuge tube with fluid M.svg");
                $(event.relatedTarget).hide();
                state5();
            }
            else {
                swal("Wrong Tube!");
            }
        }
    , });
}

function state5() {
    $(".tube").attr("data-state", "5");
    messager("Return the micro test tubes to the crushed ice.");
}

function state6() {
    gameState = 9;
    instruction();
    messager("Transfer the micro test tubes with the holder to the water bath");
    $("#cubeWithTubes").show();
    $(".origin").hide();
    interact('#cubeWithTubes').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
    var timer1 = 0;
    interact('#waterBath1').dropzone({
        // only accept elements matching this CSS selector
        accept: '#cubeWithTubes', // Require a 75% element overlap for a drop to be possible
        overlap: 0.10, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
            openWaterBath();
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
            closeWaterBath();
        }
        , ondrop: function (event) {
            messager("Start the timer for 50 seconds");
            $(event.relatedTarget).hide(1000, function () {
                $("#tubeInWaterbath").show()
            });
            closeWaterBath()
            setTimeout(openWaterBath, 2500); {
                $("#timer").show();
                $("#timerInput").show();
                $("#timerInput").attr("value", "0");
                $("#timerConfirm").show();
                $("#timerConfirm").click(function () {
                    if (timer1 == 0) {
                        timer1 = 1;
                        var time = $("#timerInput").val();
                        if (time == 50) {
                            $("#timerInput").hide();
                            $("#timerConfirm").hide();
                            setTimer(time, 10);
                            setTimeout(function () {
                                $("#timer").hide();
                                setTimeout(function () {
                                    $("#tubeInWaterbath").hide()
                                }, 1000);
                                setTimeout(function () {
                                    messager("Drag tubes into crushed ice for 2 minutes");
                                    $(event.relatedTarget).show(1000);
                                    interact('#icebox').dropzone({
                                        // only accept elements matching this CSS selector
                                        accept: '#cubeWithTubes', // Require a 75% element overlap for a drop to be possible
                                        overlap: 0.10, // listen for drop related events:
                                        ondropactivate: function (event) {
                                            // add active dropzone feedback
                                            event.target.classList.add('drop-active');
                                        }
                                        , ondragenter: function (event) {
                                            var draggableElement = event.relatedTarget
                                                , dropzoneElement = event.target;
                                            // feedback the possibility of a drop
                                            dropzoneElement.classList.add('drop-target');
                                            draggableElement.classList.add('can-drop');
                                        }
                                        , ondragleave: function (event) {
                                            // remove the drop feedback style
                                            event.target.classList.remove('drop-target');
                                            event.relatedTarget.classList.remove('can-drop');
                                        }
                                        , ondrop: function (event) {
                                            $("#tubeInIcebox").show();
                                            $("#cubeWithTubes").hide();
                                            $("#timer").show();
                                            $("#timerInput").show();
                                            $("#timerConfirm").show();
                                            $("#timerConfirm").click(function () {
                                                var time = $("#timerInput").val();
                                                if (time == 120) {
                                                    $("#timerInput").hide();
                                                    $("#timerConfirm").hide();
                                                    setTimer(time, 10);
                                                    setTimeout(function () {
                                                        $("#tubeInIcebox").hide();
                                                        $(".tube").show();
                                                        $("#tube1").css("top", "10");
                                                        $("#tube1").css("left", "10");
                                                        $("#tube2").css("top", "10");
                                                        $("#tube2").css("left", "10");
                                                        $("#cube").show();
                                                        $("#cubeTop").show();
                                                        state7();
                                                    }, 2000);
                                                }
                                                else {
                                                    swal("Wrong time!")
                                                }
                                            });
                                        }
                                        , ondropdeactivate: function (event) {
                                            // remove active dropzone feedback
                                            event.target.classList.remove('drop-active');
                                            event.target.classList.remove('drop-target');
                                        }
                                    });
                                }, 1000);
                            }, 500);
                        }
                        else {
                            swal("Wrong time!")
                        }
                    }
                });
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state7() {
    $("#tube1").css("left", "77.5%");
    $("#tube1").css("top", "51%");
    $("#tube2").css("left", "68.5%");
    $("#tube2").css("top", "51%");
    $("#tube1").attr("src", "pictures/open centrifuge tube with fluid M.svg");
    $("#tube2").attr("src", "pictures/open centrifuge tube with fluid P.svg");
    messager("Add 250ul LB broth to the +pGLO/-pGLO tube");
    gotoTrashBin(".pipette");
    gameState = 10;
    instruction();
    interact('#BrothContainer').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.relatedTarget).attr("data-state") == "0") {
                messager("Add the LB broth to a tube.");
                $(event.relatedTarget).attr("data-state", "1");
                $(event.relatedTarget).attr("src", "pictures/1000 ul pipette (250 ul).svg");
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    var counter = 0
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.relatedTarget).attr("data-state") == "1") {
                messager("Trash the used pipette. And add 250ul LB broth to the other tube.");
                $(event.relatedTarget).attr("data-state", "2");
                $(event.relatedTarget).attr("src", "pictures/Resized pipette without fluid.svg");
                counter++;
                if (counter == 2) {
                    messager("Trash the used pipette");
                    //11
                    gameState++;
                    instruction();
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state8() {
    messager("Transfer 100ul of mixture from  +pGLO/-pGLO to appropriate dishes");
    var counter = 0;
    interact('.tube').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.target).attr("id") == "tube2" && ($(event.relatedTarget).attr("data-state") == "0" || $(event.relatedTarget).attr("data-state") == "2")) {
                messager("Transfer 100ul of mixture from  +pGLO to appropriate dishes");
                $(event.relatedTarget).attr("data-state", "2");
                $(event.relatedTarget).attr("src", "pictures/Resized pipette with fluid.svg");
            }
            if ($(event.target).attr("id") == "tube1" && ($(event.relatedTarget).attr("data-state") == "0" || $(event.relatedTarget).attr("data-state") == "3")) {
                messager("Transfer  100ul of mixture from –pGLO to appropriate dishes");
                $(event.relatedTarget).attr("data-state", "3");
                $(event.relatedTarget).attr("src", "pictures/Resized pipette with fluid.svg");
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    interact('.petriDish').dropzone({
        // only accept elements matching this CSS selector
        accept: '.pipette'
        , overlap: 0.05, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if ($(event.target).attr("data-state") == "P" && $(event.relatedTarget).attr("data-state") == "2") {
                $(event.target).attr("data-state", "0");
                $(event.relatedTarget).attr("src", "pictures/Resized pipette without fluid.svg");
                counter++;
                messager("Transfer  100ul of mixture from  +pGLO to the second appropriate dish");
                if (counter == 2) {
                    messager("Discard the used pipette");
                    gotoTrashBin(".pipette");
                }
                if (counter == 4) {
                    messager("Discard the used pipette");
                    gotoTrashBin(".pipette");
                    //state9();
                }
            }
            if ($(event.target).attr("data-state") == "M" && $(event.relatedTarget).attr("data-state") == "3") {
                $(event.target).attr("data-state", "0");
                $(event.relatedTarget).attr("src", "pictures/Resized pipette without fluid.svg");
                counter++;
                messager("Transfer  100ul of mixture from –pGLO to the second appropriate dish");
                if (counter == 2) {
                    messager("Discard the used pipette");
                    gotoTrashBin(".pipette");
                }
                if (counter == 4) {
                    messager("Discard the used pipette");
                    gotoTrashBin(".pipette");
                    //state9();
                }
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state9() {
    gameState++;
    instruction();
    var thisDish;
    if (hint == 1) {
        $("#messager").text("Click on one of the plates to spread the suspension.");
    }
    $(".dish1").click(function () {
        if ($(this).attr("data-state2") == "0") {
            $("#topview").show();
            $("#rotate").show();
            thisDish = this;
            messager("Click on the dish surface to quickly skate the flat surface of the loop back and forth in one direction");
        }
    });
    $("#topview").click(function () {
        var state = $(this).attr("data-state");
        switch (state) {
        case "0":
            $(this).attr("src", "pictures/top%20view%201.svg");
            $(this).attr("data-state", "1");
            loopDraw();
            messager("Click Rotate to rotate 45 degree before after skating the loop in a new direction");
            break;
        case "1":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%202.svg");
                $(this).attr("data-state", "2");
                $(this).attr("data-rotate", "0");
                loopDraw();
                messager("Click Rotate to rotate 45 degree before after skating the loop in a new direction");
            }
            break;
        case "2":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%203.svg");
                $(this).attr("data-state", "3");
                $(this).attr("data-rotate", "0");
                loopDraw();
                messager("Click Rotate to rotate 45 degree before after skating the loop in a new direction");
            }
            break;
        case "3":
            if ($(this).attr("data-rotate") == "1") {
                $(this).attr("src", "pictures/top%20view%204.svg");
                $(this).attr("data-state", "4");
                $(this).attr("data-rotate", "0");
                loopDraw();
                messager("Click on dish to close this panel.");
                $("#rotate").hide();
            }
            break;
        case "4":
            $(this).hide();
            $(this).attr("src", "pictures/top%20view%200.svg");
            $(this).attr("data-state", "0");
            //$(thisDish).attr("src", "pictures/top%20view%204.svg");
            $(thisDish).attr("data-state2", "1");
            $(thisDish).attr("src", "pictures/dishWithLine.svg");
            $("#topview").css("transform", "rotate(0deg)");
            // loopDraw();
            messager("Click on one of the plates to spread the suspension.");
            break;
        }
        var checkValue = 0;
        $('.petriDish').each(function () {
            //if statement here
            // use $(this) to reference the current div in the loop
            //you can try something like...
            if ($(this).attr("data-state2") == "1") {
                checkValue++;
            }
        });
        if (checkValue == 4) {
            state10();
        }
        else {
            checkValue = 0;
        }
    })
    var angle = -90;
    $("#rotate").click(function () {
        if ($("#topview").attr("data-rotate") == "0") {
            messager("Click on the dish surface to quickly skate the flat surface of the loop back and forth in one direction");
            $("#topview").attr("data-rotate", "1");
            $("#topview").css("transform", "rotate(" + angle + "deg)");
            angle -= 90;
            if (angle == -360) {
                angle = -90;
            }
        }
    })
}

function loopDraw() {
    $("#drawLoop").show();
    setTimeout(function () {
        $("#drawLoop").hide();
    }, 1000)
}

function state10() {
    var state = 0
    gameState++;
    instruction();
    $("#petriDish1").css("animation", "stack1 1s forwards");
    $("#petriDish2").css("animation", "stack2 1s forwards");
    $("#petriDish3").css("animation", "stack3 1s forwards");
    $("#petriDish4").css("animation", "stack4 1s forwards");
    setTimeout(function () {
        $(".petriDish").hide();
        $("#stack").show(1000);
        if (hint == 1) $("#messager").text("Click on the stack of plates to turn it upside down");
    }, 1000);
    $("#stack").click(function () {
        if (state == 0) {
            $(this).css("animation", "upSideDown 1s forwards");
            state++;
            if (hint == 1) $("#messager").text("Drag the stack into incubator");
            setTimeout(function () {
                $("#stack").css("animation", "null");
                $("#stack").removeClass("stackUpSideDown");
            }, 1000);
            setTimeout(function () {
                state11();
            }, 2000);
        }
    })
}

function state11() {
    gameState++;
    instruction();
    $("#gameTable").hide();
    $("#gameTable2").show();
    setTimeout(function () {
        $("#lightOff").show();
    }, 500);
    setTimeout(function () {
        $("#lightOff").hide(1000);
    }, 3000);
    interact('#stack').draggable({
        // enable inertial throwing
        inertia: false, // keep the element within the area of it's parent
        restrict: {
            restriction: "#part2"
            , endOnly: true
            , elementRect: {
                top: 0
                , left: 0
                , bottom: 1
                , right: 1
            }
        }, // enable autoScroll
        autoScroll: true, // call this function on every dragmove event
        onmove: dragMoveListener, // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
            textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
        }
    });
    interact('#incubator').dropzone({
        // only accept elements matching this CSS selector
        accept: '#stack', // Require a 75% element overlap for a drop to be possible
        overlap: 0.15, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            $(event.relatedTarget).hide(1000);
            $(event.target).attr("src", "pictures/043_ rezized petri dish stack in incubator.svg");
            setTimeout(function () {
                $("#nextDay").show();
            }, 500);
            setTimeout(function () {
                $("#nextDay").hide(1000);
            }, 3000);
            state12();
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function state12() {
    var dishType = 0;
    var exam = 0;
    var counter = 0;
    messager("Click the incubator to take out the stack of plates");
    $("#incubator").click(function () {
        gameState++;
        instruction();
        $("#incubator").attr("src", "pictures/incubator.svg")
        $(".label").show();
        $(".dish2").show();
        if (hint == 1) $("#messager").text("Light is turned off.  Drag one plate at a time to the transilluminator to examine the result");
        interact('.dish2').draggable({
            // enable inertial throwing
            inertia: false, // keep the element within the area of it's parent
            restrict: {
                restriction: "#part2"
                , endOnly: true
                , elementRect: {
                    top: 0
                    , left: 0
                    , bottom: 1
                    , right: 1
                }
            }, // enable autoScroll `
            autoScroll: true, // call this function on every dragmove event
            onmove: dragMoveListener, // call this function on every dragend event
            onend: function (event) {
                var textEl = event.target.querySelector('p');
                textEl && (textEl.textContent = 'moved a distance of ' + (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px');
            }
        });
    });
    interact('.transilluminator').dropzone({
        // only accept elements matching this CSS selector
        accept: '.dish2', // Require a 75% element overlap for a drop to be possible
        overlap: 0.15, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (exam == 0) {
                $(event.target).hide();
                $(event.relatedTarget).hide();
                if ($(event.relatedTarget).attr("id") == "petriDish22") {
                    dishType = 2
                    $("#transillumintorWithDish").attr("src", "pictures/058_green dots transiluminator.svg")
                }
                else {
                    dishType = 1;
                    $("#transillumintorWithDish").attr("src", "pictures/053_rotated%20transiliuminator.svg")
                }
                $("#transillumintorWithDish").show();
                exam = 1;
                messager("Click the transilluminator to zoom in");
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
    $(".transilluminator").click(function () {
        if (exam == 1) {
            if (dishType == 0) {
                $("#zoomedPic").attr("src", "pictures/016_transiluminatorC2.svg");
            }
            else if (dishType == 1) {
                $("#zoomedPic").attr("src", "pictures/017_transiluminatorC3.svg");
            }
            else {
                $("#zoomedPic").attr("src", "pictures/018_transiluminatorC4.svg");
            }
            $("#zoomedPic").show();
            exam = 0;
            counter++;
        }
        messager("Pay attention to the result. Click again to remove the plate from the transilluminator");
    })
    $("#zoomedPic").click(function () {
        messager("Light is turned off.  Drag one plate at a time to the transilluminator to examine the result");
        $("#zoomedPic").hide();
        if (counter == 4) {
            swal("Congrats!  You make e-coli glow in green!");
            postAnswer();
            //Game ends here
        }
        $("#transilluminator").show();
        $("#transillumintorWithDish").hide();
    })
}

function openWaterBath() {
    $("#waterBath2").css("animation", "waterBathLeft 1s forwards");
}

function closeWaterBath() {
    $("#waterBath2").css("animation", "waterBathLeft2 1s forwards");
}

function instruction() {
    var picSrc = $("#insPic").attr("src");
    switch (gameState) {
    case 1:
        $("#insPic").attr("src", "pictures/02.PNG");
        $("#instruction").text("Step 2: Add transformation solution");
        break;
    case 2:
        $("#insPic").attr("src", "pictures/03.PNG");
        $("#instruction").text("Step 3: Cool down transformation solution");
        break;
    case 3:
        $("#insPic").attr("src", "pictures/04.PNG");
        $("#instruction").text("Step 4:  Add a colony of bacteria into transformation solution");
        break;
    case 6:
        $("#insPic").attr("src", "pictures/05.PNG");
        $("#instruction").text("Step 5: Add plasmid only to the +pGLO tube");
        break;
    case 7:
        $("#insPic").attr("src", "pictures/06.PNG");
        $("#instruction").text("Step 6: Incubate the mixture in both tubes on ice for 10 mins");
        break;
    case 8:
        $("#insPic").attr("src", "pictures/07.PNG");
        $("#instruction").text("Step 7: Label all plates on the bottom (not the lid)");
        break;
    case 9:
        $("#insPic").attr("src", "pictures/08.PNG");
        $("#instruction").text("Step 8: Heat Shock.");
        break;
    case 10:
        $("#insPic").attr("src", "pictures/09.PNG");
        $("#instruction").text("Step 9: Add 250ul of LB-Broth");
        break;
    case 11:
        $("#insPic").attr("src", "pictures/10.PNG");
        $("#instruction").text("Step 10: Pipet 100 µl from each of the tubes to the corresponding plates");
        break;
    case 12:
        $("#insPic").attr("src", "pictures/11.PNG");
        $("#instruction").text("Step 11: Spread the e-coli suspension on each plate");
        break;
    case 13:
        $("#insPic").attr("src", "pictures/12.PNG");
        $("#instruction").text("Step 12: Stack and invert the plates, and transfer them to incubator");
        break;
    case 14:
        $("#insPic").hide();
        $("#instruction").text("Step 13: Incubation at 37 Celcius until the next day");
        break;
    case 15:
        $("#instruction").text("Step 14: Examine the result inside a transilluminator");
        break;
    }
}
var trigger = 0;

function gotoTrashBin(x) {
    interact('#trashBin').dropzone({
        // only accept elements matching this CSS selector
        accept: x, // Require a 75% element overlap for a drop to be possible
        overlap: 0.01, // listen for drop related events:
        ondropactivate: function (event) {
            // add active dropzone feedback
            event.target.classList.add('drop-active');
        }
        , ondragenter: function (event) {
            var draggableElement = event.relatedTarget
                , dropzoneElement = event.target;
            // feedback the possibility of a drop
            dropzoneElement.classList.add('drop-target');
            draggableElement.classList.add('can-drop');
        }
        , ondragleave: function (event) {
            // remove the drop feedback style
            event.target.classList.remove('drop-target');
            event.relatedTarget.classList.remove('can-drop');
        }
        , ondrop: function (event) {
            if (x == "#loop2") {
                gameState++;
                instruction();
            }
            if (gameState == 5) {
                messager("Use another sterile loop to pick up a colony  for the other tube");
            }
            if (gameState == 6) {
                state4();
            }
            $(event.relatedTarget).fadeOut(1000);
            if (gameState >= 10) {
                $("#pipetteSpawn").append("<img class='pipette' src='pictures/Resized pipette without fluid.svg' data-state='0' />");
            }
            if (gameState == 11 && trigger == 0) {
                trigger = 1;
                state8();
            }
            else
            if (gameState == 11 && trigger == 1) {
                messager("Transfer 100ul of mixture from the other pGlo tube to appropriate dishes");
                trigger = 2;
            }
            else
            if (gameState == 11 && trigger == 2) {
                state9();
            }
        }
        , ondropdeactivate: function (event) {
            // remove active dropzone feedback
            event.target.classList.remove('drop-active');
            event.target.classList.remove('drop-target');
        }
    });
}

function setTimer(duration, speed, answer) {
    var timer = duration
        , minutes, seconds;
    display = document.querySelector('#timerNumber');
    var myVar = setInterval(function () {
        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;
        if (--timer < 0) {
            clearInterval(myVar);
            display.textContent = "";
            $("#timer").hide();
        }
    }, speed);
}

function messager(message) {
    if (hint == 1) {
        $("#messager").text(message);
    }
}

function trashItem(item) {
    $(item).fadeOut(1000);
}