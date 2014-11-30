/*! D3-resume v1.3.0 https://github.com/glena/d3-resume | Germán lena https://github.com/glena/ */
var d3Resume = function(_config){

	var lastTimeout = null;
	var formatToShow = d3.time.format("%m/%d/%Y");
	var format = d3.time.format("%Y-%m-%d");
	var parseDate = format.parse;
	var svg = null;
	var config = _config;
	var x = null;
	var y = null;
	var xAxis = null;

  var init = function()
  {
		svg = d3
		.select(config.wrapperSelector)
		.append('svg')
      		.attr("width", config.width)
      		.attr("height", config.height);

  		x = d3.time.scale().range([20, config.width-20]);
		y = d3.scale.linear().range([config.height, 0]);
		y.domain([0, config.height]);

		xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(30)
			.tickFormat(d3.time.format("%Y-%m"));

		d3.json(config.dataUrl, loadData)
  }

  var loadData = function(error, data){

		normalize(data.experience);
		normalize(data.study);

		x.domain([
				d3.min([
					d3.min(data.experience, function(d) { return d.from; }),
					d3.min(data.study, function(d) { return d.from; })
					])
				,
				d3.max([
					d3.max(data.experience, function(d) { return d.pto; }),
					d3.max(data.study, function(d) { return d.pto; })
					])
			]);

		calculateDiameter(data.experience);
		calculateDiameter(data.study);

		var graphContainer = svg
			.append("g")
			.attr("class", "graph-container")
			.attr("transform", "translate(" + [0,config.height - 200] + ")");;

		var xAxilsEl = graphContainer.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + 0 + ")")
				.call(xAxis);

		xAxilsEl.selectAll("text")
				.style("text-anchor", "end")
				.attr("transform", "rotate(-60)");

		graphContainer.append('text')
				.classed('axis-label',true)
				.text('WORKS')
				.style("text-anchor", "center")
				.attr("transform", "translate("+[25,- 55]+") rotate(-90)");

		graphContainer.append('text')
				.classed('axis-label',true)
				.text('STUDIES')
				.style("text-anchor", "center")
				.attr("transform", "translate("+[25,130]+") rotate(-90)");

		loadItems(svg, graphContainer, data.experience, "experience", -1, config.height / 8, config.getItemFillCollor);
		loadItems(svg, graphContainer, data.study, "study", 1, config.height / 8, config.getItemFillCollor);
	}

	var getPath = function (diameter, position)
	{
		var radius = diameter/2;
		var height = position * (100 + radius * 0.7);
		return "M0,0 q "+radius+" "+height+" "+diameter+" 0 z";
	}

	var normalize = function (data)
	{
		var a = 0;
		data.forEach(function(d) {
			d.id = a++;
			d.from = parseDate(d.from);
			if (d.to == null)
			{
				d.pto = new Date();
			}
			else
			{
				d.to = parseDate(d.to);
				d.pto = d.to;
			}
		});
	}

	var calculateDiameter = function (data)
	{
		data.forEach(function(d) {
			d.diameter = x(d.pto)-x(d.from);
			if (d.to == null)
			{
				d.diameter = d.diameter * 2;
			}
		});
		data.sort(function(a,b){
			return b.diameter - a.diameter;
		});
	}

	var addItemDetail = function (wrapper, size, position, weight, text){
		wrapper.append('text')
					.attr("font-size",size)
					.style("font-weight", weight)
					.text(text)
					.attr("transform", position);
	}


	var loadItems = function (svg, graphContainer, data, className, position, infoTopPosition, getItemFillCollor)
	{

		var gInfo = svg
			.selectAll("g.info."+className)
			.data(data)
			.enter()
				.append('g')
				.attr('class',function(d){ return className + d.id })
				.classed('info',true)
				.classed('default',function(d){return d.default_item;})
				.classed(className,true)
				.attr("transform", "translate("+[config.width*0.1,infoTopPosition]+")")
				.attr("fill-opacity", function(d){
					return d.default_item ? 1 : 0
				});

		addItemDetail(gInfo, "18px", "translate("+[0,0]+")", "normal", function(d){return d.type;});
		addItemDetail(gInfo, "18px", "translate("+[0,25]+")", "normal", function(d){return d.title;});
		addItemDetail(gInfo, "23px", "translate("+[0,50]+")", "normal",function(d){return d.institution;});
		addItemDetail(gInfo, "14px", "translate("+[0,70]+")", "bold", function(d){
																var text = formatToShow(d.from) + ' - ';
																if (d.to == null)
																	text += 'Now';
																else
																	text += formatToShow(d.to);
																return text;
															});

		var descriptionWrapper = gInfo.selectAll('text.description')
				.data(function(d, i) {
					var position = 70;
					return d.description.split("\n").map(function(i){
						position += 20;
						return {
							text:i,
							position:position
						};
					});
				})
				.enter();

		addItemDetail(descriptionWrapper, "14px", function(d) {return "translate(0,"+d.position+")";},
			"normal",function(d){return d.text;});


		graphContainer
			.selectAll("path."+className)
			.data(data)
			.enter()
				.append("path")
				.classed(className,true)
				.classed('item',true)
		        .attr("fill", function (d){return getItemFillCollor(d)})
		        .attr("fill-opacity", .6)
		        .attr("d",function(d){ return getPath(d.diameter, position); })
		        .attr("transform", function(d) {
					return "translate(" + [x(d.from),  0] + ")";
				})
				.on('mouseover', function(d){
					graphContainer.selectAll("path.item").transition()
							.attr("stroke-width", "1")
		                	.attr("fill-opacity", .2);
					d3.select(this).transition()
							.attr("stroke-width", "2")
		                	.attr("fill-opacity", 1);
	                showInfo(svg, className, d);
	            })
	          	.on('mouseout', function(d){
	              	graphContainer
						.selectAll("path.item")
						.transition()
						.attr("stroke-width", "2")
	                	.attr("fill-opacity", 0.5);
	                lastTimeout = setTimeout(hideInfo,3000);
	            });
	}

	var hideInfo = function ()
	{
		svg.selectAll("g.info").transition().attr("fill-opacity", 0);
		svg.selectAll("g.info.default").transition().attr("fill-opacity", 1);
	}

	var showInfo = function (svg, className, d)
	{
		if (lastTimeout)
		{
			clearTimeout(lastTimeout);
			lastTimeout = null;
		}
		svg.selectAll("g.info").transition().attr("fill-opacity", 0);
	    svg.selectAll("g.info."+className+"."+className+d.id).transition().attr("fill-opacity", 1);
	}

	init();
}
