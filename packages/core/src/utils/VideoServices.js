export const parseVideo = url => {
  // - Supported YouTube URL formats:
  //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
  //   - http://youtu.be/My2FRPA3Gf8
  //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
  // - Supported Vimeo URL formats:
  //   - http://vimeo.com/25451551
  //   - http://player.vimeo.com/video/25451551
  // - Also supports relative URLs:
  //   - //player.vimeo.com/video/25451551

  url.match(
    /(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com)|dailymotion.com)\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
  );

  if (RegExp.$3.indexOf('youtu') > -1) {
    return {
      type: 'youtube',
      id: RegExp.$6,
      src: '//www.youtube.com/embed/' + RegExp.$6,
    };
  } else if (RegExp.$3.indexOf('vimeo') > -1) {
    return {
      type: 'vimeo',
      id: RegExp.$6,
      src: '//player.vimeo.com/video/' + RegExp.$6,
    };
  } else if (RegExp.$3.indexOf('dailymotion.com') > -1) {
    return {
      type: 'dailymotion',
      id: RegExp.$6,
      src: '//www.dailymotion.com/embed/video/' + RegExp.$6,
    };
  }
};

export const createVideo = (url, width, height) => {
  // Returns an iframe of the video with the specified URL.
  var videoObj = parseVideo(url);
  var $iframe = $('<iframe>', { width: width, height: height });
  $iframe.attr('frameborder', 0);
  if (videoObj.type === 'youtube') {
    $iframe.attr('src', '//www.youtube.com/embed/' + videoObj.id);
  } else if (videoObj.type === 'vimeo') {
    $iframe.attr('src', '//player.vimeo.com/video/' + videoObj.id);
  }
  return $iframe;
};

export const getVideoThumbnail = (url, cb) => {
  // Obtains the video's thumbnail and passed it back to a callback function.
  var videoObj = parseVideo(url);
  if (videoObj.type === 'youtube') {
    cb('//img.youtube.com/vi/' + videoObj.id + '/maxresdefault.jpg');
  } else if (videoObj.type === 'vimeo') {
    // Requires jQuery
    $.get('http://vimeo.com/api/v2/video/' + videoObj.id + '.json', data =>
      cb(data[0].thumbnail_large)
    );
  }
};
