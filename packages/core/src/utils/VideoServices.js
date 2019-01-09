//TODO: make the thumbnail unified
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
      thumbnail: '//img.youtube.com/vi/' + RegExp.$6 + '/maxresdefault.jpg',
    };
  } else if (RegExp.$3.indexOf('vimeo') > -1) {
    return {
      type: 'vimeo',
      id: RegExp.$6,
      src: '//player.vimeo.com/video/' + RegExp.$6,
      thumbnail: cb => {
        fetch('http://vimeo.com/api/v2/video/' + RegExp.$6 + '.json')
          .then(response => response.json())
          .then(data => cb(data[0].thumbnail_large));
      },
    };
  } else if (RegExp.$3.indexOf('dailymotion.com') > -1) {
    return {
      type: 'dailymotion',
      id: RegExp.$6,
      src: '//www.dailymotion.com/embed/video/' + RegExp.$6,
      thumbnail: '//www.dailymotion.com/thumbnail/video/' + RegExp.$6,
    };
  }
};
