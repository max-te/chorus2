// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Stream helpers
*/
helpers.stream = {};


/*
  Maps.
*/


//# Map for video stream sizes
helpers.stream.videoSizeMap = [
    {
      min: 0,
      max: 360,
      label: 'SD'
    },
    {
      min: 361,
      max: 480,
      label: '480'
    },
    {
      min: 481,
      max: 576,
      label: '576'
    },
    {
      min: 577,
      max: 720,
      label: '720p'
    },
    {
      min: 721,
      max: 1080,
      label: '1080p'
    },
    {
      min: 1081,
      max: 100000,
      label: '4K'
    }
  ];

//# Map for audio channels
helpers.stream.audioChannelMap = [
    {
      channels: 6,
      label: '5.1'
    },
    {
      channels: 8,
      label: '7.1'
    },
    {
      channels: 2,
      label: '2.1'
    },
    {
      channels: 1,
      label: 'mono'
    }
  ];

//# Map for language codes, TODO: Add more maps
helpers.stream.langMap = {
  'eng': 'English',
  'und': 'Unknown',
  'bul': 'Bulgaria',
  'ara': 'Arabic',
  'zho': 'Chinese',
  'ces': 'Czech',
  'dan': 'Danish',
  'nld': 'Netherlands',
  'fin': 'Finish',
  'fra': 'French',
  'deu': 'German',
  'nor': 'Norwegian',
  'pol': 'Polish',
  'por': 'Portuguese',
  'ron': 'Romanian',
  'spa': 'Spanish',
  'swe': 'Swedish',
  'tur': 'Turkish',
  'vie': 'Vietnamese'
};


/*
  Formatters.
*/


//# Format an array of video streams.
helpers.stream.videoFormat = function(videoStreams) {
  for (var i in videoStreams) {
    var stream = videoStreams[i];
    var match = {label: 'SD'};
    if (stream.height && (stream.height > 0)) {
       match = _.find( helpers.stream.videoSizeMap, function(res) { if (res.min < stream.height && stream.height <= res.max) { return true; } else { return false; }  });
     }
    videoStreams[i].label = stream.codec + ' ' + match.label + ' (' + stream.width + ' x ' + stream.height + ')';
    videoStreams[i].shortlabel = stream.codec + ' ' + match.label;
    videoStreams[i].res = match.label;
  }
  return videoStreams;
};


//# Formatter for language codes
helpers.stream.formatLanguage = function(lang) {
  if (helpers.stream.langMap[lang]) {
    return helpers.stream.langMap[lang];
  } else {
    return lang;
  }
};


//# Format an array of audio streams.
helpers.stream.audioFormat = function(audioStreams) {
  for (var i in audioStreams) {
    var stream = audioStreams[i];
    var ch = _.findWhere(helpers.stream.audioChannelMap, {channels: stream.channels});
    ch = ch ? ch.label : stream.channels;
    var lang = '';
    if (stream.language !== '') {
      lang = ' (' + helpers.stream.formatLanguage(stream.language) + ')';
    }
    audioStreams[i].label = stream.codec + ' ' + ch + lang;
    audioStreams[i].shortlabel = stream.codec + ' ' + ch;
    audioStreams[i].ch = ch;
  }
  return audioStreams;
};


//# Format an array of subtitles
helpers.stream.subtitleFormat = function(subtitleStreams) {
  for (var i in subtitleStreams) {
    var stream = subtitleStreams[i];
    subtitleStreams[i].label = helpers.stream.formatLanguage(stream.language);
    subtitleStreams[i].shortlabel = helpers.stream.formatLanguage(stream.language);
  }
  return subtitleStreams;
};


//# Format ALL streams
helpers.stream.streamFormat = function(streams) {
  const streamTypes = ['audio', 'video', 'subtitle'];
  for (var type of Array.from(streamTypes)) {
    if (streams[type] && (streams[type].length > 0)) {
      streams[type] = helpers.stream[type + 'Format'](streams[type]);
    } else {
      streams[type] = [];
    }
  }
  return streams;
};
