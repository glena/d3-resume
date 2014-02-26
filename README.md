d3-resume
=========

D3.js based resume visualizer

Demo
----
http://glena.github.io/#experience


How to
------
Just include the D3.js library
```
<script src="http://d3js.org/d3.v3.min.js"></script>
```

and then the resume.js
```
<script src="http://rawgithub.com/glena/d3-resume/master/d3resume.min.js"></script>
```

and finally, instanciate the graph:

```
var resume = new d3Resume({
  width: 900,
  height: 900,
  wrapperSelector: "article.resume",
  dataUrl: 'data.json'
});
```

Data source
-----------
You need to create a file with your experience and studies formatted as json.

Format:
```
{
	"experience":[
		{
			"type":"Work",
			"institution":"First job institution",
			"title":"The job title!",
			"from":"2006-05-01",
			"to":"2006-09-30",
			"description":"all what i have done \n and this is a second line",
			"default_item":false
		},
		{
			"type":"Trainee",
			"institution":"Seocond job institution",
			"title":"The jon title!",
			"from":"2006-05-01",
			"to":null, /* because this is my current job, it doesn't have an end date */
			"description":"all what i have done \n and this is a second line",
			"default_item":true
		}
	],
	"study":[
		{
			"type":"Study",
			"institution":"Fist stydy",
			"title":"My title",
			"from":"2007-03-01",
			"to":"2011-12-20",
			"description":"",
			"default_item":false
		},
		{
			"type":"Study",
			"institution":"Also, I study another thing",
			"title":"IDK",
			"from":"2013-08-30",
			"to":null,
			"description":"",
			"default_item":false
		}
	]
}
```

Notes:
type: is the text shown on the first line.
to: if this attribute is null, it will count as an ongoing job/study and will be shown as an unfinished one.
description: when a "\n" is found will generate a new line (because SVG does not support text wrapping at the moment).
default_item: if this attribute is null, it will be the default text when there is no item selected.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/glena/d3-resume/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

[![Analytics](https://ga-beacon.appspot.com/UA-32429094-1/glena/d3-resume)](https://github.com/glena/d3-resume)
