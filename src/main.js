$(function () {

	var DEFAULTS = {
		tick_count: 10,
		x_tick_count: 16,

		top_circle_radius: 6,

		brush_height: 200,

		graph_width: 800,
		graph_height: 500,
		legend_width: 300
	};

	var margin = {top: 20, right: 20, bottom: 50, left: 60},
		width = DEFAULTS.graph_width - margin.left - margin.right,
		height = DEFAULTS.graph_height - margin.top - margin.bottom;

	var colors = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
	var svg = d3.select(".scatter-plot").append("svg")
		.attr("width", width + margin.left + margin.right + DEFAULTS.legend_width)
		.attr("height", height + margin.top + margin.bottom + DEFAULTS.brush_height)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");


	// GO GO GO :)
	d3.tsv("tcga-cases.tsv", function(error, data){
		if(error){
			return console.log(error);
		}
		
		var x = d3.scaleLinear()
			.domain(d3.extent(data, function (d) {
			return +d.case_days_to_death;
		})).range([0, width - margin.left - margin.right]);

		var y = d3.scaleLinear()
		.domain(d3.extent(data, function (d) {
			return +d.case_age_at_diagnosis;
		})).range([height - margin.top - margin.bottom, 0]);

		svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
		svg.append("g").attr("class", "y axis");
	
		svg.append("text")
			.attr("fill", "#414241")
			.attr("text-anchor", "end")
			.attr("x", width / 2)
			.attr("y", height - 35)
			.text("Days to death");


		// this is the actual definition of our x and y axes. The orientation refers to where the labels appear - for the x axis, below or above the line, and for the y axis, left or right of the line. Tick padding refers to how much space between the tick and the label. There are other parameters too - see https://github.com/mbostock/d3/wiki/SVG-Axes for more information
		var xAxis = d3.axisBottom().scale(x);
		var yAxis = d3.axisLeft().scale(y);

		// this is where we select the axis we created a few lines earlier. See how we select the axis item. in our svg we appended a g element with a x/y and axis class. To pull that back up, we do this svg select, then 'call' the appropriate axis object for rendering.    
		svg.selectAll("g.y.axis").call(yAxis);
		svg.selectAll("g.x.axis").call(xAxis);

		// now, we can get down to the data part, and drawing stuff. We are telling D3 that all nodes (g elements with class node) will have data attached to them. The 'key' we use (to let D3 know the uniqueness of items) will be the name. Not usually a great key, but fine for this example.
		var patient = svg.selectAll("g.node").data(data, function (d) {
			return d.case_id;
		});

		var patientGroup = patient.enter().append("g").attr("class", "node")
		// this is how we set the position of the items. Translate is an incredibly useful function for rotating and positioning items 
		.attr('transform', function (d) {
			return "translate(" + x(d.case_days_to_death) + "," + y(d.case_age_at_diagnosis) + ")";
		});

		// we add our first graphics element! A circle! 
		patientGroup.append("circle")
			.attr("r", 5)
			.attr("class", "dot")
			.style("fill", function (d) {
				return colors(d.case_disease_type);
		});

		/*
		// now we add some text, so we can see what each item is.
		patientGroup.append("text")
			.style("text-anchor", "middle")
			.attr("dy", -10)
			.text(function (d) {
				// this shouldn't be a surprising statement.
				return d.case_disease_type;
		});*/

	});


})
