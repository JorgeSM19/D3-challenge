// @TODO: YOUR CODE HERE!

d3.csv("/assets/data/data.csv").then(function(seldata) {
    seldata.forEach(function(data) {
        data.smokes = +data.smokes;
        data.age = +data.age;
    });

    // Set the dimensions for the graph
    var margin = { top: 20, right: 40, bottom: 60, left: 90 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scaling functions
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(seldata, d => d.age) - 1, d3.max(seldata, d => d.age)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(seldata, d => d.smokes)])
        .range([height, 0]);

    // Axis functions
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    // Axis append
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    var circlesGroup = svg.selectAll("circle")
        .data(seldata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "20")
        .attr("fill", "red")
        .attr("opacity", "0.25");

    // Add state labels to the points
    var circleLabels = svg.selectAll(null)
        .data(seldata)
        .enter()
        .append("text")
        .attr("dx", d => xLinearScale(d.age) - 7)
        .attr("dy", d => yLinearScale(d.smokes) + 3)
        .text(function(d) { return d.abbr; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "900");

    // Create axes labels
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Smokers (%)");

    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Age (%)");

    // Tooltip

    var tool_tip = d3.tip(seldata)
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) { return `State: ${d.state} <br> Age: ${d.age} % <br> Income: ${d.income} %` });
    svg.call(tool_tip);

    /*var toolTip = d3.tip(seldata)
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`State: ${d.state} <br> Age: ${d.age} % <br> Income: ${d.income} %`);
        });
    svg.call(toolTip);
    */


    // Now render the SVG scene, connecting the tool tip to each circle.
    var circles = svg.selectAll("circle").data(d);
    circles.enter().append("circle")
        .attr("r", function(d) { return d; })
        .attr("dx", function(d) { return d; })
        .attr("dy", function(d) { return d; })
        .style("fill", "red")
        .style("stroke", "black")
        .on('mouseover', tool_tip.show)
        .on('mouseout', tool_tip.hide);

});