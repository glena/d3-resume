d3-resume
=========

D3.js based resume visualizer


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
var width = $(document).width() * 0.95;
var height = $(document).height() * 0.95;

if (width < 900) width = 900;
if (height < 600) height = 600;

var resume = new d3Resume({
  width: width,
  height: height,
  wrapperSelector: "body"
});
```

Demo
====

http://glena.github.io
