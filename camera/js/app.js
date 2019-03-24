var video, canvas, context, imageData, download_btn;

function onLoad(){
  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  footer = document.getElementById("footer");
  download_btn = document.getElementById("download_btn");

  initializeCanvas();

  function initializeCanvas(){
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia){
      function successCallback(stream){
        if (window.webkitURL) {
          video.src = window.webkitURL.createObjectURL(stream);
        } else if (video.mozSrcObject !== undefined) {
          video.mozSrcObject = stream;
        } else {
          video.src = stream;
        }
      }
      function errorCallback(error){}

      navigator.getUserMedia({video: true}, successCallback, errorCallback);
      requestAnimationFrame(tick);
    }
    download_btn.addEventListener('click', screenshotDownload);
  }

  function resizeCanvas(){
    footer_height = footer.offsetHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = (window.innerHeight-footer_height) + "px";
    context = canvas.getContext("2d");
    canvas.width = parseInt(canvas.style.width);
    canvas.height = parseInt(canvas.style.height);
  }
}

function tick(){
  requestAnimationFrame(tick);
  if (video.readyState === video.HAVE_ENOUGH_DATA){
    snapshot();
  }
}

function snapshot(){
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  imageData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function screenshotDownload(){
  var canvasData = canvas.toDataURL('image/png');
  download_btn.href = canvasData;
}

window.onload = onLoad;
